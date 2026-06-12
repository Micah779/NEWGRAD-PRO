import Link from "next/link";
import { notFound } from "next/navigation";
import { getPrepTopic } from "@/db/prep-catalog";
import { TopicNotes } from "@/components/prep/topic-notes";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type TopicPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PrepTopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = getPrepTopic(slug);

  if (!topic) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Study notes
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/prep/review?topic=${topic.slug}`}>Review cards</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/prep">Back</Link>
          </Button>
        </div>
      </div>
      <TopicNotes title={topic.title} content={topic.content} />
    </div>
  );
}
