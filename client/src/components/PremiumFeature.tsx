import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Crown, Lock } from 'lucide-react';
import { Button } from './Button';
import { useTranslation } from 'react-i18next';

interface PremiumFeatureProps {
    children: ReactNode;
    fallback?: ReactNode;
}

export const PremiumFeature = ({ children, fallback }: PremiumFeatureProps) => {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const isPro = user?.plan !== 'free';

    if (isPro) {
        return <>{children}</>;
    }

    if (fallback) {
        return <>{fallback}</>;
    }

    return (
        <div className="relative group">
            <div className="filter blur-[2px] pointer-events-none opacity-50 select-none">
                {children}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/20 backdrop-blur-[1px] rounded-2xl border border-dashed border-primary/20 p-6 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Lock size={24} />
                </div>
                <h3 className="text-lg font-bold">{t('premium.title')}</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">{t('premium.description')}</p>
                <Link to="/pricing" className="mt-4">
                    <Button size="sm" className="gap-2 font-bold shadow-lg shadow-primary/20">
                        <Crown size={16} />
                        {t('premium.upgrade')}
                    </Button>
                </Link>
            </div>
        </div>
    );
};
