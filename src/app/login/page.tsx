import { redirect } from "next/navigation";
import { auth, isAuthConfigured, signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  const authConfigured = isAuthConfigured();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>NewGrad Pro</CardTitle>
          <p className="text-sm text-slate-500">
            Sign in to track your new grad job search.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {!authConfigured ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
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
            <Button className="w-full" type="submit" variant="default">
              Continue with GitHub
            </Button>
          </form>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <Button className="w-full" type="submit" variant="outline">
              Continue with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
