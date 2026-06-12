import { AppHeader } from "@/components/layout/app-header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 pb-[calc(var(--nav-height)+1.5rem)] pt-5 sm:max-w-5xl sm:pb-8 sm:pt-6 lg:max-w-6xl md:pb-8">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}
