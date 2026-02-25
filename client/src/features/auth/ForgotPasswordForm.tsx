import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import api from '../../api/axios';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordForm = () => {
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        }
    });

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        try {
            setError(null);
            await api.post('/auth/forgot-password', data);
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
            console.error('FORGOT PASSWORD ERROR:', err.response?.data || err);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center space-y-6">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-primary animate-in zoom-in duration-500">
                    <Mail size={40} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black uppercase tracking-tight">Check your email</h2>
                    <p className="text-muted-foreground font-medium">We've sent a password reset link to your email address.</p>
                </div>
                <RouterLink to="/login">
                    <Button variant="outline" className="w-full h-14 font-black uppercase tracking-widest text-xs rounded-2xl gap-2">
                        <ArrowLeft size={16} />
                        Back to Login
                    </Button>
                </RouterLink>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
            <div className="space-y-2 text-center pb-2">
                <h2 className="text-2xl font-black uppercase tracking-tight">Forgot Password?</h2>
                <p className="text-muted-foreground font-medium text-sm">No worries, we'll send you reset instructions.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                            <Mail size={18} />
                        </div>
                        <Input
                            {...register('email')}
                            placeholder="name@example.com"
                            type="email"
                            className="bg-muted/30 border-primary/5 h-14 pl-12 rounded-2xl font-bold focus:bg-background transition-all"
                        />
                    </div>
                    {errors.email && <p className="text-[10px] font-black text-destructive uppercase tracking-widest ml-1">{errors.email.message}</p>}
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
                            Sending...
                        </>
                    ) : 'Reset Password'}
                </span>
            </Button>

            <RouterLink to="/login" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors font-black uppercase tracking-widest text-[10px]">
                <ArrowLeft size={14} />
                Back to Login
            </RouterLink>
        </form>
    );
};
