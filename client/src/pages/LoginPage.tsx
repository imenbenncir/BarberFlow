import { LoginForm } from '../features/auth/LoginForm'
import { AuthLayout } from '../features/auth/AuthLayout'
import { Link } from 'react-router-dom'

export const LoginPage = () => {
    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Enter your credentials to access your dashboard"
        >
            <LoginForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="underline underline-offset-4 hover:text-primary">
                    Sign up
                </Link>
            </p>
        </AuthLayout>
    )
}
