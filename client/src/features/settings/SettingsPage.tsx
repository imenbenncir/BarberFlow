import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import {
    User,
    Shield,
    Store,
    Save,
    CheckCircle2,
    AlertCircle,
    Mail,
    Lock
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import { settingsService } from './settingsService';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export const SettingsPage = () => {
    const { t } = useTranslation();
    const { user, setUser } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const profileSchema = z.object({
        name: z.string().min(2, t('clients.validation.name_min')),
        email: z.string().email(t('clients.validation.email_invalid')),
        barberShop: z.string().min(2, t('settings.profile.validation.shop_min')),
    });

    const passwordSchema = z.object({
        currentPassword: z.string().min(6, t('settings.security.validation.current_req')),
        newPassword: z.string().min(6, t('settings.security.validation.new_min')),
        confirmPassword: z.string().min(6, t('settings.security.validation.confirm_req')),
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: t('settings.security.validation.match'),
        path: ["confirmPassword"],
    });

    type ProfileFormValues = z.infer<typeof profileSchema>;
    type PasswordFormValues = z.infer<typeof passwordSchema>;

    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            barberShop: user?.barberShop || '',
        },
    });

    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const profileMutation = useMutation({
        mutationFn: settingsService.updateProfile,
        onSuccess: (data) => {
            setUser(data);
            showSuccess(t('settings.profile.success'));
        },
        onError: (error: any) => {
            showError(error.response?.data?.message || t('settings.profile.error'));
        }
    });

    const passwordMutation = useMutation({
        mutationFn: settingsService.updatePassword,
        onSuccess: () => {
            passwordForm.reset();
            showSuccess(t('settings.security.success'));
        },
        onError: (error: any) => {
            showError(error.response?.data?.message || t('settings.security.error'));
        }
    });

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const showError = (msg: string) => {
        setErrorMessage(msg);
        setTimeout(() => setErrorMessage(null), 3000);
    };

    const onProfileSubmit = (data: ProfileFormValues) => {
        profileMutation.mutate(data);
    };

    const onPasswordSubmit = (data: PasswordFormValues) => {
        const { currentPassword, newPassword } = data;
        passwordMutation.mutate({ currentPassword, newPassword });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-4xl font-black tracking-tight">{t('settings.title')}</h1>
                <p className="text-muted-foreground text-lg font-medium mt-1">{t('settings.subtitle')}</p>
            </div>

            {/* Tabs */}
            <div className="flex p-1.5 bg-muted/50 backdrop-blur-sm rounded-2xl w-fit border border-primary/5">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all ${activeTab === 'profile'
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                >
                    <User size={18} />
                    <span>{t('settings.tabs.profile')}</span>
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all ${activeTab === 'security'
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                >
                    <Shield size={18} />
                    <span>{t('settings.tabs.security')}</span>
                </button>
            </div>

            {/* Notifications */}
            {successMessage && (
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl animate-in slide-in-from-top-2">
                    <CheckCircle2 size={20} />
                    <span className="font-bold text-sm tracking-tight">{successMessage}</span>
                </div>
            )}
            {errorMessage && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl animate-in slide-in-from-top-2">
                    <AlertCircle size={20} />
                    <span className="font-bold text-sm tracking-tight">{errorMessage}</span>
                </div>
            )}

            <div className="grid grid-cols-1 gap-8">
                {activeTab === 'profile' && (
                    <div className="bg-card border border-primary/5 rounded-[2.5rem] shadow-xl shadow-zinc-200/50 dark:shadow-none overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
                        <div className="p-8 border-b border-primary/5 bg-muted/20">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-primary text-primary-foreground">
                                    <Store size={24} strokeWidth={2.5} />
                                </div>
                                <h2 className="text-2xl font-black tracking-tight">{t('settings.profile.title')}</h2>
                            </div>
                        </div>

                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">{t('settings.profile.label_name')}</label>
                                    <Input
                                        {...profileForm.register('name')}
                                        className="bg-muted/30 border-none rounded-2xl h-14 text-base font-bold pl-6"
                                        placeholder={t('settings.profile.placeholder_name')}
                                        error={profileForm.formState.errors.name?.message}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">{t('settings.profile.label_shop')}</label>
                                    <Input
                                        {...profileForm.register('barberShop')}
                                        className="bg-muted/30 border-none rounded-2xl h-14 text-base font-bold pl-6"
                                        placeholder={t('settings.profile.placeholder_shop')}
                                        error={profileForm.formState.errors.barberShop?.message}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">{t('settings.profile.label_email')}</label>
                                <div className="relative">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                    <Input
                                        {...profileForm.register('email')}
                                        className="bg-muted/30 border-none rounded-2xl h-14 text-base font-bold pl-14"
                                        placeholder="email@example.com"
                                        error={profileForm.formState.errors.email?.message}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="h-14 rounded-2xl w-full sm:w-fit px-12 font-black shadow-lg shadow-primary/20" disabled={profileMutation.isPending}>
                                <Save size={20} className="mr-2" />
                                {t('common.save')}
                            </Button>
                        </form>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="bg-card border border-primary/5 rounded-[2.5rem] shadow-xl shadow-zinc-200/50 dark:shadow-none overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="p-8 border-b border-primary/5 bg-muted/20">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-zinc-950 text-white">
                                    <Lock size={24} strokeWidth={2.5} />
                                </div>
                                <h2 className="text-2xl font-black tracking-tight">{t('settings.security.title')}</h2>
                            </div>
                        </div>

                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="p-8 space-y-8">
                            <div className="space-y-2">
                                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">{t('settings.security.label_current')}</label>
                                <Input
                                    type="password"
                                    {...passwordForm.register('currentPassword')}
                                    className="bg-muted/30 border-none rounded-2xl h-14 text-base font-bold pl-6"
                                    placeholder={t('settings.security.placeholder_pass')}
                                    error={passwordForm.formState.errors.currentPassword?.message}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">{t('settings.security.label_new')}</label>
                                    <Input
                                        type="password"
                                        {...passwordForm.register('newPassword')}
                                        className="bg-muted/30 border-none rounded-2xl h-14 text-base font-bold pl-6"
                                        placeholder={t('settings.security.placeholder_pass')}
                                        error={passwordForm.formState.errors.newPassword?.message}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">{t('settings.security.label_confirm')}</label>
                                    <Input
                                        type="password"
                                        {...passwordForm.register('confirmPassword')}
                                        className="bg-muted/30 border-none rounded-2xl h-14 text-base font-bold pl-6"
                                        placeholder={t('settings.security.placeholder_pass')}
                                        error={passwordForm.formState.errors.confirmPassword?.message}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="h-14 rounded-2xl w-full sm:w-fit px-12 font-black shadow-lg shadow-zinc-950/20 bg-zinc-950 text-white hover:bg-zinc-900" disabled={passwordMutation.isPending}>
                                <Save size={20} className="mr-2" />
                                {t('settings.security.submit')}
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};
