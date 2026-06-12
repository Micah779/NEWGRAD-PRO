import type { ReactNode } from "react";

type TopicNotesProps = {
  title: string;
  content: string;
};

function renderLine(line: string, key: string) {
  if (line.startsWith("## ")) {
    return (
      <h2 key={key} className="mt-6 text-base font-semibold text-[var(--foreground)] first:mt-0">
        {line.slice(3)}
      </h2>
    );
  }

  if (line.startsWith("### ")) {
    return (
      <h3 key={key} className="mt-4 text-sm font-semibold text-[var(--foreground)]">
        {line.slice(4)}
      </h3>
    );
  }

  if (line.startsWith("> ")) {
    return (
      <blockquote
        key={key}
        className="border-l-2 border-black/10 pl-3 text-sm italic text-[var(--muted)]"
      >
        {line.slice(2)}
      </blockquote>
    );
  }

  if (line.startsWith("- ")) {
    return (
      <li key={key} className="ml-4 list-disc text-sm leading-relaxed text-[var(--muted)]">
        {line.slice(2)}
      </li>
    );
  }

  if (line.startsWith("```")) {
    return null;
  }

  if (line.trim() === "") {
    return <div key={key} className="h-2" />;
  }

  return (
    <p key={key} className="text-sm leading-relaxed text-[var(--muted)]">
      {line}
    </p>
  );
}

export function TopicNotes({ title, content }: TopicNotesProps) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let codeBlock: string[] = [];
  let inCode = false;

  lines.forEach((line, index) => {
    if (line.startsWith("```")) {
      if (inCode) {
        blocks.push(
          <pre
            key={`code-${index}`}
            className="overflow-x-auto rounded-[var(--radius-sm)] bg-black/[0.04] p-3 text-xs leading-relaxed"
          >
            <code>{codeBlock.join("\n")}</code>
          </pre>,
        );
        codeBlock = [];
        inCode = false;
      } else {
        inCode = true;
      }
      return;
    }

    if (inCode) {
      codeBlock.push(line);
      return;
    }

    const rendered = renderLine(line, `line-${index}`);
    if (rendered) blocks.push(rendered);
  });

  return (
    <article className="space-y-1">
      <h1 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
        {title}
      </h1>
      <div className="space-y-2">{blocks}</div>
    </article>
  );
}
