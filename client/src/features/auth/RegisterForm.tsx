import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import api from '../../api/axios';
import { useAuthStore } from '../../store/useAuthStore';
import { Loader2, Mail, Lock, User, Briefcase } from 'lucide-react';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    barberShop: z.string().min(2, 'Shop name must be at least 2 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
    const [error, setError] = React.useState<string | null>(null);
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            barberShop: '',
        }
    });

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            setError(null);
            const response = await api.post('/auth/register', data);
            setAuth(response.data, response.data.token);
            navigate('/dashboard');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed';
            setError(message);
            console.error('REGISTRATION ERROR:', error.response?.data || error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Name</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                            <User size={18} />
                        </div>
                        <Input
                            {...register('name')}
                            placeholder="John Doe"
                            className="bg-muted/30 border-primary/5 h-14 pl-12 rounded-2xl font-bold focus:bg-background transition-all"
                        />
                    </div>
                    {errors.name && <p className="text-[10px] font-black text-destructive uppercase tracking-widest ml-1">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Shop Name</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                            <Briefcase size={18} />
                        </div>
                        <Input
                            {...register('barberShop')}
                            placeholder="Premium Cuts"
                            className="bg-muted/30 border-primary/5 h-14 pl-12 rounded-2xl font-bold focus:bg-background transition-all"
                        />
                    </div>
                    {errors.barberShop && <p className="text-[10px] font-black text-destructive uppercase tracking-widest ml-1">{errors.barberShop.message}</p>}
                </div>
            </div>

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
                <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Password</label>
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

            {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold p-4 rounded-xl animate-in fade-in slide-in-from-top-2">
                    {error}
                </div>
            )}

            <div className="pt-2">
                <Button
                    type="submit"
                    className="w-full h-14 text-lg font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all gap-2"
                    disabled={isSubmitting}
                >
                    <span className="flex items-center gap-2">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Creating Account...
                            </>
                        ) : 'Create Professional Account'}
                    </span>
                </Button>
            </div>

            <p className="text-center text-sm font-bold text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-black uppercase tracking-widest text-xs">
                    Sign In
                </Link>
            </p>
        </form>
    );
};
