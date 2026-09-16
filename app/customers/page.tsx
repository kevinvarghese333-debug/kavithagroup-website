import { ArrowUpRight, BriefcaseBusiness, Building2, Car, Gem, Home, Users } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

const services = [
  [Gem, "Gold Loan", "Unlock the value of gold with a clear, guided process."],
  [Home, "Property Loan", "Finance shaped around property-backed requirements."],
  [BriefcaseBusiness, "Business Loan", "Support for working capital and business ambitions."],
  [Users, "Personal Loan", "Straightforward finance for personal priorities."],
  [Car, "Vehicle Loan", "Flexible options for new mobility and commercial needs."],
  [Building2, "Consumer & Group Loans", "Purpose-led products for households and communities."],
];

export const metadata = { title: "Customer Corner | Kavitha Group" };

export default async function CustomersPage() {
  const content = await getSiteContent();
  return (
    <main>
      <PageHero eyebrow="Customer Corner" title="The right path, without the runaround." body="Start with the service you need, then continue with the relevant Kavitha Group business." />
      <section className="service-grid section-pad">
        {services.map(([Icon, title, copy]) => (
          <article key={String(title)}><Icon size={24} /><h2>{String(title)}</h2><p>{String(copy)}</p></article>
        ))}
      </section>
      <section className="portal-band section-pad">
        <div><p className="eyebrow light">Existing customers</p><h2>Quick access to<br />your services.</h2></div>
        <div className="portal-links">
          <a href="https://customer.kavithagroup.in/" target="_blank" rel="noreferrer"><span>Customer portal</span><ArrowUpRight size={19} /></a>
          <a href="https://support.kavithagroup.in/AdminMainPage" target="_blank" rel="noreferrer"><span>Support portal</span><ArrowUpRight size={19} /></a>
          <a href="https://freemeninvestments.in/" target="_blank" rel="noreferrer"><span>Freemen Investments</span><ArrowUpRight size={19} /></a>
        </div>
      </section>
      <SiteFooter content={content} />
    </main>
  );
}
