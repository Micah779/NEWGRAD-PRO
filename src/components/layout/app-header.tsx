import { signOut } from "@/lib/auth";
import { AppNav } from "./app-nav";
import { LogOut } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-[var(--background)]/90 backdrop-blur-xl safe-top">
      <div className="mx-auto flex h-[var(--header-height)] max-w-3xl items-center justify-between px-4 sm:max-w-5xl lg:max-w-6xl">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold tracking-tight text-[var(--foreground)]">
            NewGrad Pro
          </p>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <AppNav />
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-black/[0.04] hover:text-[var(--foreground)]"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>

        <form
          className="md:hidden"
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            aria-label="Sign out"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--muted)] transition-colors active:bg-black/[0.06]"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </form>
      </div>
    </header>
  );
}
