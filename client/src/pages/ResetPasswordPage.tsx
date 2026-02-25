import { AuthLayout } from '../features/auth/AuthLayout';
import { ResetPasswordForm } from '../features/auth/ResetPasswordForm';
import { PageTransition } from '../components/PageTransition';

export const ResetPasswordPage = () => {
    return (
        <AuthLayout
            title="New Credentials"
            subtitle="Set a strong new password for your professional account"
        >
            <PageTransition>
                <ResetPasswordForm />
            </PageTransition>
        </AuthLayout>
    );
};
