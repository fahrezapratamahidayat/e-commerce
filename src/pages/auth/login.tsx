import LoginForm from "@/components/form/LoginForm";
import AuthLayouts from "@/components/layouts/AuthLayouts";

export default function login(){
    return (
        <>
            <AuthLayouts link="/auth/register" description="Belum punya akun?" descriptionLink="Sign up" title="Login">
                <LoginForm />
            </AuthLayouts>
        </>
    )
}