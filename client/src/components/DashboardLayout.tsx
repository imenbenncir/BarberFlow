import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    Scissors,
    Calendar,
    Users,
    Settings,
    LogOut,
    Menu,
    Bell,
    User,
    BarChart3,
    CreditCard
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/useAuthStore';

import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';

const getNavItems = (t: any) => [
    { icon: LayoutDashboard, label: t('navigation.dashboard'), path: '/dashboard' },
    { icon: Scissors, label: t('navigation.services'), path: '/services' },
    { icon: Users, label: t('navigation.clients'), path: '/clients' },
    { icon: Calendar, label: t('navigation.calendar'), path: '/calendar' },
    { icon: BarChart3, label: t('navigation.analytics'), path: '/analytics' },
    { icon: CreditCard, label: t('navigation.billing'), path: '/billing' },
    { icon: Settings, label: t('navigation.settings'), path: '/settings' },
];

export const DashboardLayout = () => {
    const { t } = useTranslation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const navItems = getNavItems(t);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar - Desktop */}
            <aside className={cn(
                "fixed inset-y-0 z-50 w-64 bg-zinc-950 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                t('dir') === 'rtl' ? "right-0 translate-x-full lg:translate-x-0" : "left-0 -translate-x-full lg:translate-x-0",
                isSidebarOpen && "translate-x-0"
            )}>
                <div className="flex flex-col h-full p-6">
                    <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter mb-10">
                        <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                            <Scissors size={20} />
                        </div>
                        BarberFlow
                    </div>

                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }: { isActive: boolean }) => cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                                )}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="pt-6 border-t border-zinc-800">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">{t('navigation.logout')}</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Navbar */}
                <header className="h-16 border-b bg-card flex items-center justify-between px-4 lg:px-8 z-40">
                    <button
                        className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className="hidden lg:block">
                        <h2 className="text-sm font-medium text-muted-foreground">{t('dashboard.subtitle')}</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <LanguageSelector />
                        <button className="p-2 text-muted-foreground hover:text-foreground relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-card" />
                        </button>
                        <div className="h-8 w-[1px] bg-border mx-1" />
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold leading-none">{user?.name}</p>
                                <p className="text-xs text-muted-foreground capitalize mt-1">{user?.role.toLowerCase()}</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                <User size={20} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dynamic Content */}
                <main className="flex-1 overflow-y-auto bg-zinc-50/50 dark:bg-zinc-950/50">
                    <div className="max-w-7xl mx-auto p-4 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Sidebar Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};
