import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site-shell";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Genuine Client Reviews — First Step Future" },
      {
        name: "description",
        content:
          "Approved testimonials from real First Step Future clients. Nothing is invented, and every review was shared with permission.",
      },
      {
        property: "og:title",
        content: "Genuine Client Reviews — First Step Future",
      },
      {
        property: "og:description",
        content:
          "Approved testimonials from real First Step Future clients.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Client reviews"
        title="Genuine feedback, collected with care."
        copy="Only approved feedback from real client work appears here, and only from clients who gave permission. Nothing is invented."
      />

      <section className="mx-auto max-w-5xl px-5">
        <div className="glass-card text-center">
          <h2 className="font-display text-xl font-bold">
            No approved reviews yet.
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            This space will grow naturally as genuine projects are completed.
          </p>
        </div>
      </section>
    </main>
  );
}