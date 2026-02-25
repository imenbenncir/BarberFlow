import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/useAuthStore'
import { cn } from '../lib/utils'
import { LucideIcon, TrendingUp, Users, Calendar, DollarSign, ArrowUpRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { RevenueTrends } from '../features/analytics/RevenueTrends';
import { ServiceDistribution } from '../features/analytics/ServiceDistribution';
import { PremiumFeature } from '../components/PremiumFeature';
import { StaggerContainer, StaggerItem, SlideIn } from '../components/PageTransition';

interface Stat {
    label: string;
    value: string;
    icon: LucideIcon;
    trend: string;
    color: string;
    bg: string;
    id: string;
}

export const DashboardPage = () => {
    const { t } = useTranslation();
    const { user } = useAuthStore()

    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const response = await api.get('/analytics/stats');
            return response.data;
        }
    });

    const statItems: Stat[] = [
        { id: 'revenue', label: t('dashboard.stats.revenue'), value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`, icon: DollarSign, trend: '+12.5%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 'bookings', label: t('dashboard.stats.bookings'), value: stats?.bookingCount || '0', icon: Calendar, trend: '+4', color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'clients', label: t('dashboard.stats.clients'), value: stats?.clientCount || '0', icon: Users, trend: '+8.2%', color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { id: 'avg', label: t('dashboard.stats.avg_ticket'), value: `$${stats?.averageTicket?.toFixed(2) || '0.00'}`, icon: TrendingUp, trend: '+2.1%', color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <div className="space-y-10">
            <SlideIn direction="down">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">{t('dashboard.overview_title')}</h1>
                    <p className="text-muted-foreground mt-1 text-lg">{t('dashboard.overview_subtitle', { name: user?.name })}</p>
                </div>
            </SlideIn>

            <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statItems.map((stat) => (
                    <StaggerItem key={stat.id}>
                        <div className="p-6 rounded-3xl border bg-card shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden group border-primary/5">
                            {isLoading ? (
                                <div className="animate-pulse space-y-3">
                                    <div className="h-10 w-10 bg-muted rounded-xl" />
                                    <div className="h-4 w-24 bg-muted rounded" />
                                    <div className="h-8 w-16 bg-muted rounded" />
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start relative z-10">
                                        <div className={cn("p-4 rounded-2xl", stat.bg, stat.color)}>
                                            <stat.icon size={24} />
                                        </div>
                                        <div className="flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                            <span>{stat.trend}</span>
                                            <ArrowUpRight size={14} />
                                        </div>
                                    </div>
                                    <div className="mt-6 relative z-10">
                                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                                        <h3 className="text-3xl font-black mt-1 tracking-tight">{stat.value}</h3>
                                    </div>
                                </>
                            )}
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-tl-full translate-x-12 translate-y-12 group-hover:scale-150 group-hover:bg-primary/10 transition-all duration-500" />
                        </div>
                    </StaggerItem>
                ))}
            </StaggerContainer>

            <SlideIn delay={0.3}>
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-black text-xl flex items-center gap-2">
                                <TrendingUp size={20} className="text-primary" />
                                {t('dashboard.charts.revenue_performance')}
                            </h3>
                            <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{t('dashboard.charts.live_preview')}</div>
                        </div>
                        <PremiumFeature>
                            <RevenueTrends />
                        </PremiumFeature>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-black text-xl flex items-center gap-2">
                            <Users size={20} className="text-primary" />
                            {t('dashboard.charts.service_distribution')}
                        </h3>
                        <PremiumFeature>
                            <ServiceDistribution />
                        </PremiumFeature>
                    </div>
                </div>
            </SlideIn>
        </div>
    )
}
