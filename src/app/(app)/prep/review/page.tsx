import Link from "next/link";
import { PrepReviewSession } from "@/components/prep/prep-review-session";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type ReviewPageProps = {
  searchParams: Promise<{ topic?: string }>;
};

export default async function PrepReviewPage({ searchParams }: ReviewPageProps) {
  const { topic } = await searchParams;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <PageHeader
          title="Review"
          description="Review due flashcards."
        />
        <Button asChild variant="outline" size="sm" className="shrink-0">
          <Link href="/prep">Back</Link>
        </Button>
      </div>
      <PrepReviewSession key={topic ?? "all"} topicSlug={topic} />
    </div>
  );
}
