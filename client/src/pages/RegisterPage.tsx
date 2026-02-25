import { RegisterForm } from '../features/auth/RegisterForm'
import { AuthLayout } from '../features/auth/AuthLayout'

export const RegisterPage = () => {
    return (
        <AuthLayout
            title="Create an account"
            subtitle="Enter your details to register as a professional"
        >
            <RegisterForm />
        </AuthLayout>
    )
}
