import { useMutation } from '@tanstack/react-query';
import { CreditCard, ExternalLink, ShieldCheck, Zap, Crown, Check } from 'lucide-react';
import api from '../../api/axios';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { SlideIn, StaggerContainer, StaggerItem } from '../../components/PageTransition';
import { useTranslation } from 'react-i18next';

export const BillingPage = () => {
    const { t } = useTranslation();
    const { user } = useAuthStore();

    const portalMutation = useMutation({
        mutationFn: async () => {
            const response = await api.post('/billing/portal');
            return response.data;
        },
        onSuccess: (data) => {
            if (data.url) {
                window.location.href = data.url;
            }
        }
    });

    const isPro = user?.plan !== 'free';
    const perks = t('billing.perks', { returnObjects: true }) as string[];

    return (
        <div className="space-y-12">
            <SlideIn direction="down">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">{t('billing.title')}</h1>
                    <p className="text-muted-foreground mt-1 text-lg">{t('billing.subtitle')}</p>
                </div>
            </SlideIn>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Current Plan Card */}
                <div className="lg:col-span-2 space-y-8">
                    <SlideIn delay={0.1} direction="left">
                        <div className="bg-card border-2 border-primary/5 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group">
                            <div className="flex justify-between items-start relative z-10">
                                <div className="space-y-6">
                                    <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest inline-block ${isPro ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-muted text-muted-foreground'}`}>
                                        {t('billing.membership', { plan: user?.plan })}
                                    </div>
                                    <h2 className="text-5xl font-black flex items-center gap-3">
                                        {isPro ? t('billing.pro_name') : t('billing.free_name')}
                                        {isPro && <Crown className="text-primary" size={32} />}
                                    </h2>
                                    <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
                                        {isPro ? t('billing.pro_desc') : t('billing.free_desc')}
                                    </p>
                                </div>
                                <div className={`p-6 rounded-3xl shadow-inner ${isPro ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                    <Zap size={48} strokeWidth={3} />
                                </div>
                            </div>

                            <div className="mt-12 pt-10 border-t border-primary/5 flex flex-wrap gap-4 relative z-10">
                                {isPro ? (
                                    <Button
                                        className="gap-2 px-8 h-14 font-black rounded-2xl text-lg shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                        onClick={() => portalMutation.mutate()}
                                        disabled={portalMutation.isPending}
                                    >
                                        <ExternalLink size={20} strokeWidth={3} />
                                        {portalMutation.isPending ? t('billing.connecting') : t('billing.manage')}
                                    </Button>
                                ) : (
                                    <Button
                                        className="gap-2 px-10 h-14 font-black rounded-2xl text-lg shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                        onClick={() => window.location.href = '/pricing'}
                                    >
                                        {t('billing.upgrade')}
                                    </Button>
                                )}
                            </div>

                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
                        </div>
                    </SlideIn>

                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6" delay={0.3}>
                        <StaggerItem>
                            <div className="bg-card border border-primary/5 rounded-3xl p-8 shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow">
                                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 shadow-inner">
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <h4 className="font-black text-lg">{t('billing.next_billing')}</h4>
                                    <p className="text-muted-foreground font-bold mt-1">March 15, 2026</p>
                                    <div className="mt-4 text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded inline-block">
                                        {t('billing.auto_renew')}
                                    </div>
                                </div>
                            </div>
                        </StaggerItem>
                        <StaggerItem>
                            <div className="bg-card border border-primary/5 rounded-3xl p-8 shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow">
                                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 shadow-inner">
                                    <CreditCard size={28} />
                                </div>
                                <div>
                                    <h4 className="font-black text-lg">{t('billing.payment_method')}</h4>
                                    <p className="text-muted-foreground font-bold mt-1">Visa ending in 4242</p>
                                    <div className="mt-4 text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded inline-block">
                                        {t('billing.payment_default')}
                                    </div>
                                </div>
                            </div>
                        </StaggerItem>
                    </StaggerContainer>
                </div>

                {/* Benefits List */}
                <SlideIn delay={0.4} direction="right">
                    <div className="bg-zinc-950 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden h-full">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-8 flex items-center gap-2">
                                <Crown size={24} className="text-primary" />
                                {t('billing.perks_title')}
                            </h3>
                            <ul className="space-y-6">
                                {perks.map((perk) => (
                                    <li key={perk} className="flex gap-4 text-sm font-bold items-center group">
                                        <div className="p-1 rounded-full bg-primary text-primary-foreground group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
                                            <Check size={14} strokeWidth={4} />
                                        </div>
                                        <span className="text-zinc-300 group-hover:text-white transition-colors">{perk}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 text-xs text-zinc-400 font-medium leading-relaxed">
                                {t('billing.stripe_note')}
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-50" />
                    </div>
                </SlideIn>
            </div>
        </div>
    );
};
