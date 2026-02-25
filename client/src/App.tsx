import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { DashboardLayout } from './components/DashboardLayout'
import { useAuthStore } from './store/useAuthStore'
import { PageTransition } from './components/PageTransition'
import { AnimatePresence } from 'framer-motion'
import { GlobalLoading } from './components/GlobalLoading'

// Lazy loaded pages
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })))
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const ServicesPage = lazy(() => import('./features/services/ServicesList').then(m => ({ default: m.ServicesPage })))
const CalendarPage = lazy(() => import('./features/calendar/CalendarPage').then(m => ({ default: m.CalendarPage })))
const ClientPage = lazy(() => import('./features/clients/ClientPage').then(m => ({ default: m.ClientPage })))
const SettingsPage = lazy(() => import('./features/settings/SettingsPage').then(m => ({ default: m.SettingsPage })))
const AnalyticsPage = lazy(() => import('./features/analytics/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })))
const PricingPage = lazy(() => import('./features/subscription/PricingPage').then(m => ({ default: m.PricingPage })))
const BillingPage = lazy(() => import('./features/subscription/BillingPage').then(m => ({ default: m.BillingPage })))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })))

const AnimatedRoutes = () => {
    const location = useLocation();
    const { isAuthenticated } = useAuthStore()

    return (
        <AnimatePresence mode="wait" initial={false}>
            <Suspense fallback={<GlobalLoading key="global-loading" />}>
                <Routes location={location} key={location.pathname}>
                    {/* Root Redirect */}
                    <Route
                        path="/"
                        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
                    />

                    {/* Public Routes */}
                    <Route
                        path="/login"
                        element={!isAuthenticated ? <PageTransition><LoginPage /></PageTransition> : <Navigate to="/dashboard" replace />}
                    />
                    <Route
                        path="/register"
                        element={!isAuthenticated ? <PageTransition><RegisterPage /></PageTransition> : <Navigate to="/dashboard" replace />}
                    />
                    <Route
                        path="/forgot-password"
                        element={!isAuthenticated ? <PageTransition><ForgotPasswordPage /></PageTransition> : <Navigate to="/dashboard" replace />}
                    />
                    <Route
                        path="/reset-password/:token"
                        element={!isAuthenticated ? <PageTransition><ResetPasswordPage /></PageTransition> : <Navigate to="/dashboard" replace />}
                    />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<DashboardLayout />}>
                            <Route path="/dashboard" element={<PageTransition><DashboardPage /></PageTransition>} />
                            <Route path="/services" element={<PageTransition><ServicesPage /></PageTransition>} />
                            <Route path="/calendar" element={<PageTransition><CalendarPage /></PageTransition>} />
                            <Route path="/analytics" element={<PageTransition><AnalyticsPage /></PageTransition>} />
                            <Route path="/billing" element={<PageTransition><BillingPage /></PageTransition>} />
                            <Route path="/pricing" element={<PageTransition><PricingPage /></PageTransition>} />
                            <Route path="/clients" element={<PageTransition><ClientPage /></PageTransition>} />
                            <Route path="/settings" element={<PageTransition><SettingsPage /></PageTransition>} />
                        </Route>
                    </Route>

                    {/* Fallback */}
                    <Route path="/404" element={<NotFoundPage />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
            </Suspense>
        </AnimatePresence>
    );
}

function App() {
    return (
        <Router
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <AnimatedRoutes />
        </Router>
    )
}

export default App
