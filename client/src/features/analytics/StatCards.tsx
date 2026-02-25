import { DollarSign, TrendingUp, Users, Calendar, ArrowUpRight } from 'lucide-react';
import { CardSkeleton } from '../../components/Skeleton';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface StatCardsProps {
    stats: any;
    isLoading: boolean;
}

export const StatCards = ({ stats, isLoading }: StatCardsProps) => {
    const { t } = useTranslation();

    const items = [
        {
            label: t('analytics.stats.revenue'),
            value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`,
            icon: DollarSign,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            trend: '+12.5%'
        },
        {
            label: t('analytics.stats.bookings'),
            value: stats?.bookingCount || 0,
            icon: Calendar,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            trend: '+4'
        },
        {
            label: t('analytics.stats.clients'),
            value: stats?.clientCount || 0,
            icon: Users,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            trend: '+8.2%'
        },
        {
            label: t('analytics.stats.avg_ticket'),
            value: `$${stats?.averageTicket?.toFixed(2) || '0.00'}`,
            icon: TrendingUp,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            trend: '+2.1%'
        }
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, i) => (
                <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    className="bg-card border border-primary/5 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
                >
                    <div className="flex justify-between items-start relative z-10">
                        <div className={cn("p-4 rounded-2xl shadow-inner", item.bg, item.color)}>
                            <item.icon size={28} strokeWidth={2.5} />
                        </div>
                        <div className="flex items-center gap-1 text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-full border border-emerald-100/50">
                            <span>{item.trend}</span>
                            <ArrowUpRight size={14} strokeWidth={3} />
                        </div>
                    </div>
                    <div className="mt-8 relative z-10">
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.15em]">{item.label}</p>
                        <h3 className="text-4xl font-black mt-2 tracking-tight">{item.value}</h3>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500" />
                </motion.div>
            ))}
        </div>
    );
};
