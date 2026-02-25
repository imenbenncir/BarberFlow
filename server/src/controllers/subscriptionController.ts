import { Request, Response } from 'express';
import Stripe from 'stripe';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

import { AuthRequest } from '../middleware/auth';

const PRICE_TO_PLAN: Record<string, 'pro' | 'business'> = {
    [process.env.STRIPE_PRO_PRICE_ID || 'price_pro_test_id']: 'pro',
    [process.env.STRIPE_BUSINESS_PRICE_ID || 'price_business_test_id']: 'business',
};

export const createCheckoutSession = async (req: AuthRequest, res: Response) => {
    try {
        const { planId } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create or get Stripe Customer
        let stripeCustomerId = user.stripeCustomerId;
        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: { userId: user._id.toString() }
            });
            stripeCustomerId = customer.id;
            user.stripeCustomerId = stripeCustomerId;
            await user.save();
        }

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: planId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${CLIENT_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
            cancel_url: `${CLIENT_URL}/billing`,
            metadata: {
                userId: user._id.toString(),
                plan: (Object.entries(PRICE_TO_PLAN).find(([id]) => id === planId)?.[1]) || 'pro'
            }
        });

        res.json({ url: session.url });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createPortalSession = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || !user.stripeCustomerId) {
            return res.status(400).json({ message: 'No active subscription found' });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${CLIENT_URL}/billing`,
        });

        res.json({ url: session.url });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const handleWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET || ''
        );
    } catch (err: any) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.userId;
            const plan = session.metadata?.plan as any;

            if (userId) {
                await User.findByIdAndUpdate(userId, {
                    subscriptionStatus: 'active',
                    plan: plan || 'pro'
                });
            }
            break;
        }
        case 'customer.subscription.updated': {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;
            const priceId = subscription.items.data[0].price.id;
            const plan = PRICE_TO_PLAN[priceId] || 'pro';

            const user = await User.findOne({ stripeCustomerId: customerId });
            if (user) {
                user.subscriptionStatus = subscription.status as any;
                if (subscription.status === 'active') {
                    user.plan = plan;
                } else if (['canceled', 'unpaid', 'past_due'].includes(subscription.status)) {
                    // Downgrade if subscription fails or is canceled
                    user.plan = 'free';
                }
                await user.save();
            }
            break;
        }
        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;
            const user = await User.findOne({ stripeCustomerId: customerId });
            if (user) {
                user.subscriptionStatus = 'none';
                user.plan = 'free';
                await user.save();
            }
            break;
        }
    }

    res.json({ received: true });
};
