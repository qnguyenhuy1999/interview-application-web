"use client";

import { useAuthStore } from "@features/auth";
import type { Note } from "@features/notes/types";
import { Button } from "@shared/components/atoms";
import { cn } from "@shared/utils";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deepDiveNote, generateQuiz, loadPreviousQuiz } from "../api";

const ReactMarkdown = dynamic(
  () => import("react-markdown").then((m) => m.default),
  { ssr: false },
);

function CodeBlock({
  children,
  language,
}: {
  children: React.ReactNode;
  language: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6 rounded-xl border border-border/50 bg-[#1e1e1f] shadow-inner overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-2">
        <span className="text-xs font-mono font-medium text-slate-400 capitalize">
          {language || "text"}
        </span>
        <button
          onClick={handleCopy}
          className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300 opacity-0 transition-all hover:bg-white/10 group-hover:opacity-100"
        >
          {copied ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Copied!
            </span>
          ) : (
            "Copy"
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4 text-[13px] leading-relaxed text-slate-50 font-mono">
        <pre>
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
}

const MarkdownComponents: any = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || "");
    if (!inline && match) {
      return (
        <CodeBlock language={match[1]}>
          {String(children).replace(/\n$/, "")}
        </CodeBlock>
      );
    }
    if (!inline) {
      return (
        <CodeBlock language="text">
          {String(children).replace(/\n$/, "")}
        </CodeBlock>
      );
    }
    return (
      <code
        className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[13px] text-primary"
        {...props}
      >
        {children}
      </code>
    );
  },
  h1: ({ children }: any) => (
    <h1 className="mt-8 mb-4 text-3xl font-extrabold tracking-tight">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="mt-8 mb-4 text-2xl font-bold tracking-tight text-foreground border-b pb-2">
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="mt-6 mb-3 text-xl font-bold tracking-tight text-foreground">
      {children}
    </h3>
  ),
  a: ({ href, children }: any) => (
    <a
      href={href}
      className="text-primary hover:underline font-medium decoration-primary/50 underline-offset-4"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  ),
  p: ({ children }: any) => (
    <p className="leading-7 not-first:mt-6 text-muted-foreground">{children}</p>
  ),
  ul: ({ children }: any) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 text-muted-foreground">
      {children}
    </ol>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="mt-6 border-l-4 border-primary/50 pl-6 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
};

interface NoteDetailClientProps {
  note: Note;
  onDeepDiveComplete: () => void;
}

export function NoteDetailClient({
  note,
  onDeepDiveComplete,
}: NoteDetailClientProps) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const noteId = note.id;

  const [aiLoading, setAiLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeepDive = async () => {
    if (!token) return;
    setAiLoading(true);
    try {
      await deepDiveNote(noteId, token);
      onDeepDiveComplete();
    } catch {
      setError("Failed to generate deep dive");
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!token) return;
    setQuizLoading(true);
    try {
      const result = await generateQuiz(noteId, token);
      router.push(`/quiz/${result.quizId}`);
    } catch {
      setError("Failed to generate quiz");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleLoadPreviousQuiz = async () => {
    if (!token) return;
    setQuizLoading(true);
    try {
      const result = await loadPreviousQuiz(noteId, token);
      if (result.quiz) {
        router.push(`/quiz/${result.quiz.id}`);
      }
    } catch {
      setError("Failed to load previous quiz");
    } finally {
      setQuizLoading(false);
    }
  };

  const isMastered = note.hasQuiz && note.aiExplanation;
  const isReviewed = note.aiExplanation && !note.hasQuiz;
  const statusColor = isMastered
    ? "bg-emerald-500 shadow-emerald-500/20"
    : isReviewed
      ? "bg-amber-400 shadow-amber-400/20"
      : "bg-slate-300";

  return (
    <div className="w-full animate-fade-in pb-24">
      {/* Dynamic Context Header */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between border-b pb-8">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={cn("flex h-3 w-3 rounded-full shadow-sm", statusColor)}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {isMastered
                ? "Mastery Achieved"
                : isReviewed
                  ? "Needs Practice"
                  : "Draft Concept"}
            </span>
            <span className="h-3 w-px bg-border" />
            <span className="text-xs font-medium text-muted-foreground">
              {note.topic || "Uncategorized"}
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            {note.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Added {new Date(note.createdAt).toLocaleDateString()}
            </span>
            {note.aiExplanation && (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                AI Analyzed
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={() => router.push(`/notes/${noteId}/edit`)}
            className="rounded-full shadow-sm"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Note
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/notes")}
            className="rounded-full shadow-sm"
          >
            Back to Syllabus
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-8 rounded-xl bg-destructive/10 p-4 border border-destructive/20 text-destructive font-medium shadow-sm">
          {error}
        </div>
      )}

      {/* Main 2-column Layout */}
      <div className="flex flex-col gap-8 lg:flex-row xl:gap-12">
        {/* Content Column (Left) */}
        <div className="flex-1 space-y-12 min-w-0">
          {/* Key Takeaways Box (If AI exists) */}
          {note.aiExplanation && (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </span>
                <h3 className="font-bold text-primary">
                  Senior Developer Breakdown
                </h3>
              </div>
              <div className="prose prose-sm dark:prose-invert">
                <ReactMarkdown components={MarkdownComponents}>
                  {note.aiExplanation}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Original Note Document */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground border-b border-border/40 pb-4">
              <svg
                className="h-5 w-5 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Original Source Note
            </h2>
            <div className="prose prose-sm dark:prose-invert opacity-90">
              <ReactMarkdown components={MarkdownComponents}>
                {note.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Sticky Sidebar Action Panel (Right) */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="sticky top-28 space-y-6">
            {/* Practice / Quiz Card */}
            <div className="rounded-2xl border border-border/50 bg-card/60 p-6 shadow-lg backdrop-blur-xl">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <span className="text-emerald-500">🎯</span> Practice Mode
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Test your knowledge to build interview confidence.
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleGenerateQuiz}
                  disabled={quizLoading}
                  className={cn(
                    "w-full py-6 font-bold shadow-md transition-transform hover:-translate-y-0.5",
                    !note.hasQuiz && "animate-pulse shadow-primary/20",
                  )}
                >
                  {quizLoading
                    ? "Preparing Environment..."
                    : "Generate New Interview Quiz"}
                </Button>

                {note.hasQuiz && (
                  <Button
                    variant="outline"
                    onClick={handleLoadPreviousQuiz}
                    disabled={quizLoading}
                    className="w-full flex items-center justify-center gap-2 border-primary/20 text-primary hover:bg-primary/5"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Resume Previous Quiz
                  </Button>
                )}
              </div>
            </div>

            {/* AI Deep Dive Generator Card */}
            {!note.aiExplanation && (
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-primary">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                  AI Deep Dive
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Your note is currently raw. Let AI expand it into a
                  structured, senior-level explanation with technical depth.
                </p>
                <Button
                  onClick={handleDeepDive}
                  disabled={aiLoading}
                  variant="secondary"
                  className="w-full"
                >
                  {aiLoading ? "Analyzing..." : "Generate Deep Dive"}
                </Button>
              </div>
            )}

            {/* Quick Stats optional block */}
            <div className="rounded-2xl border border-border/50 bg-card p-5 text-sm text-muted-foreground hidden lg:block">
              <div className="flex justify-between py-2 border-b border-border/40">
                <span>Word Count</span>
                <span className="font-medium text-foreground">
                  {note.content.split(" ").length}
                </span>
              </div>
              <div className="flex justify-between py-2 text-xs">
                Press{" "}
                <kbd className="mx-1 rounded bg-muted px-1.5 py-0.5 border text-foreground">
                  cmd
                </kbd>{" "}
                +{" "}
                <kbd className="mx-1 rounded bg-muted px-1.5 py-0.5 border text-foreground">
                  enter
                </kbd>{" "}
                to copy context.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
