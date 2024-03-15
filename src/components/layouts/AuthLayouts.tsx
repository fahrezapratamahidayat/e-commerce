import Link from "next/link";

export default function AuthLayouts({
  children,
  link = "/auth/register",
  description = "Sudah punya akun?",
  descriptionLink = "Sign in",
  title = "Create Your Account",
}: {
  children: React.ReactNode;
  link: "/auth/register" | "/auth/login";
  description: "Sudah punya akun?" | "Belum punya akun?";
  descriptionLink: "Sign in" | "Sign up";
  title: "Create Your Account" | "Login";
}) {
  return (
    <>
      <div className="min-h-screen max-w-full px-6 py-10 mx-auto">
        <div className="flex items-center justify-center w-full flex-col">
          <div className="flex flex-col bg-white rounded-lg shadow-lg drop-shadow-md lg:w-1/3 p-5">
            <div className="mb-5">
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-muted-foreground mt-1">
                To continue with ZASTORE
              </p>
            </div>
            {children}
            {/* <div className="mt-4 text-center text-sm">
              {description}{" "}
              <Link className="underline" href={link}>
                {descriptionLink}
              </Link>
            </div> */}
          </div>
          <div className="mt-5 text-center text-muted-foreground">
              {description}{" "}
              <Link className="text-blue-600 font-semibold" href={link}>
                {descriptionLink}
              </Link>
            </div>
        </div>
      </div>
    </>
  );
}
