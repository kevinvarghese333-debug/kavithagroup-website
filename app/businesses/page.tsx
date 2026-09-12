import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { getBusinesses, getSiteContent } from "@/lib/site-content";

export const metadata = { title: "Our Businesses | Kavitha Group" };

export default async function BusinessesPage() {
  const [content, businesses] = await Promise.all([getSiteContent(), getBusinesses()]);
  return (
    <main>
      <PageHero eyebrow="Our Businesses" title="One group. Eight distinct expressions of trust." body="A portfolio spanning finance, savings, jewellery, fashion, events and leisure—built around the needs of Kerala's communities." />
      <section className="business-directory section-pad">
        {businesses.map((business, index) => (
          <article id={business.id} className="business-row" key={business.id}>
            <div className={`business-row-visual visual-${(index % 4) + 1}`}>
              {business.imageKey ? <Image src={business.imageKey} alt="" fill sizes="(max-width: 800px) 100vw, 45vw" /> : <span>{business.name.split(" ").map((word) => word[0]).join("").slice(0, 2)}</span>}
            </div>
            <div className="business-row-copy">
              <span className="business-number">{String(index + 1).padStart(2, "0")}</span>
              <p className="eyebrow">{business.category}</p>
              <h2>{business.name}</h2>
              <p>{business.summary}</p>
              {business.location && <small><MapPin size={15} /> {business.location}</small>}
              {business.websiteUrl && <a href={business.websiteUrl} target="_blank" rel="noreferrer" className="text-link">Visit website <ArrowUpRight size={16} /></a>}
            </div>
          </article>
        ))}
      </section>
      <SiteFooter content={content} />
    </main>
  );
}
