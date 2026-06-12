import Link from "next/link";
import { PrepPracticeSession } from "@/components/prep/prep-practice-session";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type PracticePageProps = {
  searchParams: Promise<{ topic?: string }>;
};

export default async function PrepPracticePage({ searchParams }: PracticePageProps) {
  const { topic } = await searchParams;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <PageHeader
          title="Problem Practice"
          description="Identify the pattern, then analyze the implementation complexity."
        />
        <Button asChild variant="outline" size="sm" className="shrink-0">
          <Link href="/prep">Back</Link>
        </Button>
      </div>
      <PrepPracticeSession key={topic ?? "all"} topicSlug={topic} />
    </div>
  );
}
