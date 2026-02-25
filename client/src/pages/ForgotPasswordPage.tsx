import { AuthLayout } from '../features/auth/AuthLayout';
import { ForgotPasswordForm } from '../features/auth/ForgotPasswordForm';
import { PageTransition } from '../components/PageTransition';

export const ForgotPasswordPage = () => {
    return (
        <AuthLayout
            title="Recover Access"
            subtitle="Enter your email to reset your secret password"
        >
            <PageTransition>
                <ForgotPasswordForm />
            </PageTransition>
        </AuthLayout>
    );
};
