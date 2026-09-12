import { env } from "cloudflare:workers";
import { getChatGPTUser, type ChatGPTUser } from "@/app/chatgpt-auth";

export function isAdminUser(user: ChatGPTUser): boolean {
  if (process.env.NODE_ENV !== "production" && user.email === "seedy@sites.test") {
    return true;
  }
  const allowlist = String(env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  return allowlist.includes(user.email.toLowerCase());
}

export async function getAuthorizedAdmin(): Promise<ChatGPTUser | null> {
  const user = await getChatGPTUser();
  return user && isAdminUser(user) ? user : null;
}
