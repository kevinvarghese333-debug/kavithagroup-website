import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export const metadata = {
  title: "Admin Sign In | Kavitha Group",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <main className="auth-shell">
      <div className="auth-brand">
        <Image src="/assets/kavitha-group-logo.png" alt="Kavitha Group" width={220} height={82} priority />
        <p>Secure website administration</p>
      </div>
      <SignIn forceRedirectUrl="/admin" />
    </main>
  );
}
