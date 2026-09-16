import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { isAdminAuthConfigured } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Sign In | Kavitha Group",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  if (!isAdminAuthConfigured()) {
    return (
      <main className="access-denied">
        <h1>Admin sign-in is not configured yet.</h1>
        <p>Add the required Clerk environment variables in Vercel, then redeploy.</p>
        <Link href="/">Return to website</Link>
      </main>
    );
  }

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
