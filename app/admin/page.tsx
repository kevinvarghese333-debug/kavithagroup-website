import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { requireChatGPTUser } from "@/app/chatgpt-auth";
import { AdminDashboard } from "@/components/admin-dashboard";
import { isAdminUser } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Kavitha Group", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  if (!isAdminUser(user)) {
    return <main className="access-denied"><LockKeyhole size={36} /><h1>Admin access is restricted.</h1><p>{user.email} is signed in, but is not on the Kavitha Group admin allowlist.</p><Link href="/">Return to website</Link></main>;
  }
  return <AdminDashboard userEmail={user.email} />;
}
