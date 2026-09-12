import { Download, FileText, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { getDocuments, getSiteContent } from "@/lib/site-content";

const labels: Record<string, string> = { annual: "Annual Reports", agm: "AGM Reports", policy: "Company Policies", disclosure: "Disclosures" };

export const metadata = { title: "Investor Corner | Kavitha Group" };

export default async function InvestorsPage() {
  const [content, documents] = await Promise.all([getSiteContent(), getDocuments()]);
  const categories = ["annual", "agm", "policy", "disclosure"];
  return (
    <main>
      <PageHero eyebrow="Investor Corner" title="Governance made visible." body="A clear, organised home for Kavitha Group reports, policies and statutory information." />
      <section className="document-library section-pad">
        <div className="library-note"><ShieldCheck size={26} /><div><strong>Corporate document library</strong><p>Published documents are managed securely through the Kavitha Group admin panel.</p></div></div>
        {categories.map((category) => {
          const items = documents.filter((document) => document.category === category);
          return (
            <section className="document-category" key={category}>
              <div><p className="eyebrow">{labels[category]}</p><span>{items.length} {items.length === 1 ? "document" : "documents"}</span></div>
              <div className="document-list">
                {items.length ? items.map((document) => (
                  <a href={`/media/${document.fileKey}`} key={document.id} target="_blank" rel="noreferrer">
                    <FileText size={20} /><span><strong>{document.title}</strong><small>{document.year} · {(document.size / 1_000_000).toFixed(1)} MB</small></span><Download size={18} />
                  </a>
                )) : <div className="empty-library"><FileText size={21} /><span>Documents will appear here when published.</span></div>}
              </div>
            </section>
          );
        })}
      </section>
      <SiteFooter content={content} />
    </main>
  );
}
