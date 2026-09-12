import { SiteHeader } from "@/components/site-header";

export function PageHero({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <>
      <SiteHeader />
      <section className="page-hero">
        <p className="eyebrow light">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{body}</p>
      </section>
    </>
  );
}
