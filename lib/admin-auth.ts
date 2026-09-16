import { auth, currentUser } from "@clerk/nextjs/server";

export type AdminIdentity = {
  userId: string;
  displayName: string;
  email: string;
  authorized: boolean;
};

function adminEmails() {
  return String(process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminAuthConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
  );
}

export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  if (!isAdminAuthConfigured()) return null;
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses[0]?.emailAddress;
  if (!user || !email) return null;

  return {
    userId,
    displayName: user.fullName ?? email,
    email,
    authorized: adminEmails().includes(email.toLowerCase()),
  };
}

export async function getAuthorizedAdmin(): Promise<AdminIdentity | null> {
  const user = await getAdminIdentity();
  return user?.authorized ? user : null;
}
