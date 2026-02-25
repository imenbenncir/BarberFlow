import { Check, Zap, Shield, Crown } from 'lucide-react';
import { Button } from '../../components/Button';
import { useMutation } from '@tanstack/react-query';
import api from '../../api/axios';
import { SlideIn, StaggerContainer, StaggerItem, FadeIn } from '../../components/PageTransition';

const plans = [
    {
        name: 'Free',
        price: '$0',
        description: 'Perfect for solo barbers starting out.',
        features: ['Up to 50 appointments/mo', 'Basic Analytics', 'Standard Support'],
        priceId: null,
        icon: Zap,
        color: 'text-zinc-400'
    },
    {
        name: 'Pro',
        price: '$29',
        description: 'Advanced features for growing barbers.',
        features: ['Unlimited appointments', 'Advanced Analytics', 'PDF Reports', 'Priority Support'],
        priceId: (import.meta as any).env.VITE_STRIPE_PRO_PRICE_ID || 'price_pro_test_id',
        icon: Crown,
        color: 'text-primary',
        popular: true
    },
    {
        name: 'Business',
        price: '$79',
        description: 'Scaling solution for full barber shops.',
        features: ['Everything in Pro', 'Multi-employee support', 'Inventory management', 'API access'],
        priceId: (import.meta as any).env.VITE_STRIPE_BUSINESS_PRICE_ID || 'price_business_test_id',
        icon: Shield,
        color: 'text-purple-500'
    }
];

export const PricingPage = () => {
    const checkoutMutation = useMutation({
        mutationFn: async (planId: string) => {
            const response = await api.post('/billing/checkout', { planId });
            return response.data;
        },
        onSuccess: (data) => {
            if (data.url) {
                window.location.href = data.url;
            }
        }
    });

    return (
        <div className="space-y-16 pb-20">
            <SlideIn direction="down">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest mb-2">
                        Pricing Plans
                    </div>
                    <h1 className="text-5xl font-black tracking-tight lg:text-7xl">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-muted-foreground">Choose the plan that fits your growth. Scale as your client base grows.</p>
                </div>
            </SlideIn>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                {plans.map((plan) => (
                    <StaggerItem key={plan.name}>
                        <div
                            className={`relative flex flex-col p-8 rounded-[2.5rem] bg-card border shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl h-full ${plan.popular ? 'border-primary ring-4 ring-primary/10 scale-105 z-10' : 'border-primary/5'}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-10 -translate-y-1/2 bg-primary text-primary-foreground px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className={`p-4 rounded-3xl w-fit bg-muted ${plan.color} mb-8 shadow-inner`}>
                                <plan.icon size={32} />
                            </div>

                            <h3 className="text-3xl font-black">{plan.name}</h3>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-5xl font-black">{plan.price}</span>
                                <span className="text-muted-foreground font-bold">/mo</span>
                            </div>
                            <p className="mt-4 text-muted-foreground leading-relaxed text-lg">{plan.description}</p>

                            <div className="mt-10 space-y-4 flex-1">
                                <div className="text-sm font-black uppercase tracking-widest text-muted-foreground/50 mb-4">Features included:</div>
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex gap-3 text-sm font-bold group">
                                        <div className="p-1 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                            <Check size={14} strokeWidth={4} />
                                        </div>
                                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12">
                                {plan.priceId ? (
                                    <Button
                                        className="w-full h-14 text-lg font-black rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
                                        onClick={() => checkoutMutation.mutate(plan.priceId!)}
                                        disabled={checkoutMutation.isPending}
                                    >
                                        {checkoutMutation.isPending ? 'Redirecting...' : `Get ${plan.name} Access`}
                                    </Button>
                                ) : (
                                    <Button variant="outline" className="w-full h-14 text-lg font-black rounded-2xl bg-muted border-dashed border-2 cursor-default" disabled>
                                        Your Current Plan
                                    </Button>
                                )}
                            </div>
                        </div>
                    </StaggerItem>
                ))}
            </StaggerContainer>

            <FadeIn delay={1}>
                <div className="text-center text-muted-foreground text-sm font-medium">
                    All plans include 14-day money back guarantee • Secure payment via Stripe
                </div>
            </FadeIn>
        </div>
    );
};
