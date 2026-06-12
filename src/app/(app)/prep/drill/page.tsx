import Link from "next/link";
import { PrepDrillSession } from "@/components/prep/prep-drill-session";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type DrillPageProps = {
  searchParams: Promise<{ topic?: string }>;
};

export default async function PrepDrillPage({ searchParams }: DrillPageProps) {
  const { topic } = await searchParams;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <PageHeader
          title="Drill"
          description={
            topic
              ? `Pattern recognition for ${topic.replace(/-/g, " ")}.`
              : "Name the pattern family from a problem scenario."
          }
        />
        <Button asChild variant="outline" size="sm" className="shrink-0">
          <Link href="/prep">Back</Link>
        </Button>
      </div>
      <PrepDrillSession key={topic ?? "all"} topicSlug={topic} />
    </div>
  );
}
