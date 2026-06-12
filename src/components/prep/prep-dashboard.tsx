import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type TopicStat = {
  slug: string;
  title: string;
  summary: string;
  total: number;
  due: number;
  practiceDue: number;
  drillAccuracy: number | null;
  practiceAccuracy: number | null;
};

type PrepDashboardProps = {
  totalCards: number;
  dueCount: number;
  practiceDueCount: number;
  streak: number;
  topicStats: TopicStat[];
};

export function PrepDashboard({
  totalCards,
  dueCount,
  practiceDueCount,
  streak,
  topicStats,
}: PrepDashboardProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              Cards due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">{dueCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              Problems due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">{practiceDueCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">{streak}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              Total cards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">{totalCards}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button asChild className="w-full sm:w-auto" disabled={dueCount === 0}>
          <Link href="/prep/review">Review due cards ({dueCount})</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full sm:w-auto"
          disabled={practiceDueCount === 0}
        >
          <Link href="/prep/practice">Practice problems ({practiceDueCount})</Link>
        </Button>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href="/prep/drill">Drill patterns</Link>
        </Button>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold tracking-tight text-[var(--foreground)]">
          Topics
        </h2>
        <div className="space-y-2">
          {topicStats.map((topic) => (
            <Card key={topic.slug}>
              <CardHeader className="space-y-2 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-[15px]">{topic.title}</CardTitle>
                    <p className="mt-1 text-sm text-[var(--muted)]">{topic.summary}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {topic.due > 0 ? (
                      <Badge variant="success">{topic.due} due</Badge>
                    ) : (
                      <Badge variant="secondary">Caught up</Badge>
                    )}
                    {topic.practiceDue > 0 ? (
                      <Badge variant="success">{topic.practiceDue} practice</Badge>
                    ) : null}
                    {topic.drillAccuracy !== null ? (
                      <Badge variant="outline">{topic.drillAccuracy}% drill</Badge>
                    ) : null}
                    {topic.practiceAccuracy !== null ? (
                      <Badge variant="outline">{topic.practiceAccuracy}% practice</Badge>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                    <Link href={`/prep/topics/${topic.slug}`}>Study notes</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="w-full sm:w-auto"
                    disabled={topic.due === 0}
                  >
                    <Link href={`/prep/review?topic=${topic.slug}`}>
                      Review topic ({topic.due})
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                    disabled={topic.practiceDue === 0}
                  >
                    <Link href={`/prep/practice?topic=${topic.slug}`}>
                      Practice topic ({topic.practiceDue})
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" size="sm" className="w-full sm:w-auto">
                    <Link href={`/prep/drill?topic=${topic.slug}`}>Drill topic</Link>
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
