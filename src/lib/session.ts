import { auth } from "@/lib/auth";

export const E2E_TEST_EMAIL = "e2e@test.local";

export function getAllowedEmails() {
  return (process.env.ALLOWED_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function getDefaultOwnerEmail() {
  const allowed = getAllowedEmails();
  return allowed[0] ?? E2E_TEST_EMAIL;
}

export async function getSessionUserEmail(): Promise<string | null> {
  if (process.env.E2E_TEST_MODE === "true") {
    return E2E_TEST_EMAIL;
  }

  const session = await auth();
  return session?.user?.email?.toLowerCase() ?? null;
}

export async function requireUserEmail(): Promise<string> {
  const email = await getSessionUserEmail();
  if (!email) {
    throw new Error("Unauthorized");
  }
  return email;
}
