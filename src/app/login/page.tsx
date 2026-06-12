import { redirect } from "next/navigation";
import { auth, isAuthConfigured, signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  const authConfigured = isAuthConfigured();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-6 safe-top safe-bottom">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="font-mono text-2xl font-medium tracking-tight text-[var(--foreground)]">
            scout<span className="text-[var(--accent)]">.</span>
          </h1>
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            Sign in to your job search workspace.
          </p>
        </div>

        <div className="space-y-3">
          {!authConfigured ? (
            <p className="rounded-[var(--radius)] border border-[var(--warning)]/20 bg-[var(--warning-bg)] p-4 text-left text-sm text-[var(--warning)]">
              OAuth is not configured yet. Add GitHub or Google credentials to
              `.env.local`, or run in development without an allowlist.
            </p>
          ) : null}

          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/" });
            }}
          >
            <Button className="w-full" type="submit" variant="default" size="lg">
              Continue with GitHub
            </Button>
          </form>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <Button className="w-full" type="submit" variant="outline" size="lg">
              Continue with Google
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
