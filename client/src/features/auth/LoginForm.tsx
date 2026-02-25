import * as React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import api from '../../api/axios';
import { useAuthStore } from '../../store/useAuthStore';
import { Loader2, Mail, Lock } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
    const [error, setError] = React.useState<string | null>(null);
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setError(null);
            const response = await api.post('/auth/login', data);
            setAuth(response.data, response.data.token);
            navigate('/dashboard');
        } catch (err: any) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            console.error('LOGIN ERROR:', err.response?.data || err);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
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

                <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Password</label>
                        <RouterLink to="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Forgot password?</RouterLink>
                    </div>
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
                            Authenticating...
                        </>
                    ) : 'Sign In To Dashboard'}
                </span>
            </Button>
        </form>
    );
};
