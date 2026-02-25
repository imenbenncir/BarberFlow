import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Calendar, Download } from 'lucide-react';
import api from '../../api/axios';
import { Button } from '../../components/Button';
import { RevenueTrends } from '@/features/analytics/RevenueTrends';
import { ServiceDistribution } from '@/features/analytics/ServiceDistribution';
import { StatCards } from '@/features/analytics/StatCards';
import { generatePDF } from '@/lib/pdfExport';
import { PremiumFeature } from '../../components/PremiumFeature';
import { SlideIn, FadeIn } from '../../components/PageTransition';
import { useTranslation } from 'react-i18next';

export const AnalyticsPage = () => {
    const { t } = useTranslation();

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['analytics-stats'],
        queryFn: async () => {
            const response = await api.get('/analytics/stats');
            return response.data;
        }
    });

    const handleExport = () => {
        generatePDF('analytics-content', 'BarberFlow-Report.pdf');
    };

    return (
        <div className="space-y-10" id="analytics-content">
            <SlideIn direction="down">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">{t('analytics.title')}</h1>
                        <p className="text-muted-foreground mt-1 text-lg">{t('analytics.subtitle')}</p>
                    </div>
                    <PremiumFeature>
                        <Button onClick={handleExport} variant="outline" className="flex gap-2 font-bold h-12 px-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                            <Download size={18} />
                            <span>{t('analytics.export_pdf')}</span>
                        </Button>
                    </PremiumFeature>
                </div>
            </SlideIn>

            <FadeIn delay={0.2}>
                <StatCards stats={stats} isLoading={statsLoading} />
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PremiumFeature>
                    <SlideIn delay={0.4} direction="left">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black flex items-center gap-2">
                                    <TrendingUp size={20} className="text-primary" />
                                    {t('analytics.revenue_trends')}
                                </h2>
                                <div className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                    {t('analytics.pro_feature')}
                                </div>
                            </div>
                            <RevenueTrends />
                        </div>
                    </SlideIn>
                </PremiumFeature>
                <PremiumFeature>
                    <SlideIn delay={0.5} direction="right">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black flex items-center gap-2">
                                    <Calendar size={20} className="text-primary" />
                                    {t('analytics.service_distribution')}
                                </h2>
                                <div className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                    {t('analytics.pro_feature')}
                                </div>
                            </div>
                            <ServiceDistribution />
                        </div>
                    </SlideIn>
                </PremiumFeature>
            </div>
        </div>
    );
};
