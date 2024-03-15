import RegisterForm from "@/components/form/RegisterForm";
import AuthLayouts from "@/components/layouts/AuthLayouts";

export default function RegisterPage() {
  return (
    <>
      <AuthLayouts
        link="/auth/login"
        description="Sudah punya akun?"
        descriptionLink="Sign in"
        title="Create Your Account"
      >
        <RegisterForm />
      </AuthLayouts>
    </>
  );
}
