import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { getAdminIdentity, isAdminAuthConfigured } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Kavitha Group", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!isAdminAuthConfigured()) {
    return <main className="access-denied"><LockKeyhole size={36} /><h1>Admin setup is required.</h1><p>Add the Clerk, Neon Postgres and Vercel Blob environment variables to activate website administration.</p><Link href="/">Return to website</Link></main>;
  }
  const user = await getAdminIdentity();
  if (!user) redirect("/sign-in");
  if (!user.authorized) {
    return <main className="access-denied"><LockKeyhole size={36} /><h1>Admin access is restricted.</h1><p>{user.email} is signed in, but is not on the Kavitha Group admin allowlist.</p><Link href="/">Return to website</Link></main>;
  }
  return <AdminDashboard userEmail={user.email} />;
}
