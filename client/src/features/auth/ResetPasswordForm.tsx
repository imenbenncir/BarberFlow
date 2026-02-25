import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import api from '../../api/axios';
import { Loader2, Lock, ShieldCheck } from 'lucide-react';

const resetPasswordSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordForm = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        }
    });

    const onSubmit = async (data: ResetPasswordFormValues) => {
        try {
            setError(null);
            await api.post(`/auth/reset-password/${token}`, { password: data.password });
            setIsSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Something went wrong');
            console.error('RESET PASSWORD ERROR:', error.response?.data || error);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center space-y-6">
                <div className="bg-green-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-green-500 animate-in zoom-in duration-500">
                    <ShieldCheck size={40} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-green-500">Password Reset!</h2>
                    <p className="text-muted-foreground font-medium">Your password has been updated. Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
            <div className="space-y-2 text-center pb-2">
                <h2 className="text-2xl font-black uppercase tracking-tight">Reset Password</h2>
                <p className="text-muted-foreground font-medium text-sm">Please enter your new password below.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">New Password</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                            <Lock size={18} />
                        </div>
                        <Input
                            {...register('password')}
                            type="password"
                            placeholder="••••••••"
                            className="bg-muted/30 border-primary/5 h-14 pl-12 rounded-2xl font-bold focus:bg-background transition-all"
                        />
                    </div>
                    {errors.password && <p className="text-[10px] font-black text-destructive uppercase tracking-widest ml-1">{errors.password.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Confirm New Password</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                            <ShieldCheck size={18} />
                        </div>
                        <Input
                            {...register('confirmPassword')}
                            type="password"
                            placeholder="••••••••"
                            className="bg-muted/30 border-primary/5 h-14 pl-12 rounded-2xl font-bold focus:bg-background transition-all"
                        />
                    </div>
                    {errors.confirmPassword && <p className="text-[10px] font-black text-destructive uppercase tracking-widest ml-1">{errors.confirmPassword.message}</p>}
                </div>
            </div>

            {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold p-4 rounded-xl animate-in fade-in slide-in-from-top-2">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                className="w-full h-14 text-lg font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all gap-2"
                disabled={isSubmitting}
            >
                <span className="flex items-center gap-2">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Updating...
                        </>
                    ) : 'Update Password'}
                </span>
            </Button>
        </form>
    );
};
