import React from 'react'
import { Scissors, CheckCircle2 } from 'lucide-react'
import { SlideIn, FadeIn, StaggerContainer, StaggerItem } from '../../components/PageTransition'

export const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) => {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background overflow-hidden">
            {/* Left Side: Branding & Quote */}
            <div className="hidden lg:flex flex-col justify-between p-16 bg-zinc-950 text-zinc-50 relative overflow-hidden">
                <FadeIn delay={0.2}>
                    <div className="flex items-center gap-3 font-black text-3xl tracking-tighter relative z-10">
                        <div className="p-3 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                            <Scissors size={28} strokeWidth={2.5} />
                        </div>
                        <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                            BarberFlow
                        </span>
                    </div>
                </FadeIn>

                <div className="space-y-10 relative z-10">
                    <SlideIn delay={0.4} direction="left">
                        <h2 className="text-5xl font-black leading-[1.1] tracking-tight">
                            Elevate Your <br />
                            <span className="text-primary italic">Barber Shop</span> To <br />
                            New Heights.
                        </h2>
                    </SlideIn>

                    <StaggerContainer delay={0.6} className="space-y-4">
                        {[
                            'Seamless client booking experience',
                            'Real-time revenue & growth analytics',
                            'Professional PDF reporting tools',
                            'Multi-employee shift management'
                        ].map((feature, i) => (
                            <StaggerItem key={i}>
                                <div className="flex items-center gap-3 text-zinc-400 font-bold group">
                                    <div className="p-1 rounded-full bg-primary/20 text-primary group-hover:scale-110 transition-transform">
                                        <CheckCircle2 size={18} strokeWidth={3} />
                                    </div>
                                    <span className="group-hover:text-zinc-200 transition-colors">{feature}</span>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>

                <FadeIn delay={1}>
                    <div className="text-sm text-zinc-500 font-bold tracking-widest uppercase relative z-10">
                        © 2026 BarberFlow • Premium Barber SaaS
                    </div>
                </FadeIn>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Right Side: Form */}
            <div className="flex flex-col items-center justify-center p-8 bg-zinc-50/50 dark:bg-background">
                <div className="w-full max-w-md space-y-10">
                    <div className="space-y-3 text-center lg:text-left">
                        <SlideIn direction="down">
                            <h1 className="text-4xl font-black tracking-tight">{title}</h1>
                            <p className="text-muted-foreground text-lg font-medium">{subtitle}</p>
                        </SlideIn>
                    </div>

                    <div className="bg-card border border-primary/5 p-10 rounded-[2.5rem] shadow-xl shadow-zinc-200/50 dark:shadow-none animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
