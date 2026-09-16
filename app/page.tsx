import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, Building2, Gem, Landmark, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PortraitPlaceholder } from "@/components/portrait-placeholder";
import { getBusinesses, getLeaders, getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

const milestones = [
  ["The beginning", "From age 15, K. Varghese explored multiple small ventures from a single room at home before building a silver trade serving retailers and wholesalers."],
  ["1998", "Kavitha Jewellery opened in Cherai, giving the emerging enterprise a name and a permanent home in the community."],
  ["A new idea", "Vypin Kuries and Finance followed, encouraging savings and creating new reasons for local families to engage with the Group."],
  ["2016", "Kavitha Nidhi Limited was established, expanding the Group's member-focused savings and deposit services."],
  ["2021", "The Group entered its next chapter with an RBI licence for NBFC operations and a growing regional footprint."],
  ["Today", "More than 38 branches across four districts, with eight businesses connected by one enduring promise."],
];

const portfolioIcons = [Landmark, Landmark, Building2, Landmark, Gem, Sparkles, Building2, Sparkles];

export default async function Home() {
  const [content, businesses, leaders] = await Promise.all([
    getSiteContent(),
    getBusinesses(),
    getLeaders(),
  ]);
  const featured = businesses.filter((item) => item.imageKey).slice(0, 3);

  return (
    <main className="site-shell">
      <SiteHeader overlay />

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy reveal-up">
          <p className="eyebrow light">{content.heroEyebrow}</p>
          <h1 id="hero-title">
            {content.heroTitle}
            {content.heroAccent ? <><br /><span>{content.heroAccent}</span></> : null}
          </h1>
          <p className="hero-intro">{content.heroBody}</p>
          <div className="hero-actions">
            <Link href="/businesses" className="button button-gold">
              Explore our businesses <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link href="/about" className="text-link light-link">
              Discover our story <ArrowDownRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="hero-visual" aria-label="Kavitha Group head office">
          <Image src="/assets/head-office-2.jpg" alt="Kavitha Group head office" fill priority sizes="(max-width: 900px) 100vw, 50vw" />
          <div className="hero-image-wash" />
          <div className="hero-quote">
            <Image src="/assets/kavitha-mark.png" alt="" width={46} height={41} />
            <p>One group. Many enterprises. A single promise.</p>
          </div>
        </div>
      </section>

      <section className="metrics" aria-label="Kavitha Group at a glance">
        <article><strong>1998</strong><span>Kavitha Jewellery opened in Cherai</span></article>
        <article><strong>38+</strong><span>Branches across Kerala</span></article>
        <article><strong>4</strong><span>Districts served</span></article>
        <article><strong>8</strong><span>Businesses under one group</span></article>
      </section>

      <section className="business-preview section-pad">
        <div className="section-heading">
          <div><p className="eyebrow">Our businesses</p><h2>Built differently.<br />United by trust.</h2></div>
          <p>Finance, jewellery, savings, fashion, events and leisure—each enterprise carries the values that shaped Kavitha Group from the beginning.</p>
        </div>
        <div className="business-grid">
          {featured.map((business, index) => (
            <Link className={`business-card card-${index + 1}`} href={`/businesses#${business.id}`} key={business.id}>
              <Image src={business.imageKey!} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" />
              <span className="business-overlay" />
              <div className="business-content">
                <p>{business.category}</p><h3>{business.name}</h3><span>{business.summary}</span>
                <i aria-hidden="true"><ArrowDownRight size={18} /></i>
              </div>
            </Link>
          ))}
        </div>
        <div className="portfolio-list">
          {businesses.map((business, index) => {
            const Icon = portfolioIcons[index] ?? Building2;
            return (
              <Link href={`/businesses#${business.id}`} key={business.id}>
                <Icon size={18} aria-hidden="true" /><span>{business.name}</span><ArrowDownRight size={16} aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="story-section section-pad">
        <div className="story-intro">
          <p className="eyebrow light">Our origin</p>
          <h2>{content.storyTitle}</h2>
          <p>{content.storyBody}</p>
          <Link href="/about" className="text-link light-link">Read the full story <ArrowRight size={16} /></Link>
        </div>
        <div className="timeline">
          {milestones.map(([year, detail], index) => (
            <article key={year}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><strong>{year}</strong><p>{detail}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="leadership-preview section-pad">
        <div className="section-heading">
          <div><p className="eyebrow">Leadership</p><h2>Experience with<br />a long view.</h2></div>
          <p>Four leaders carrying forward a family enterprise with clarity, discipline and an instinct for opportunity.</p>
        </div>
        <div className="leader-grid">
          {leaders.slice(0, 4).map((leader) => (
            <article className="leader-card" key={leader.id}>
              {leader.imageKey ? <div className="leader-image"><Image src={leader.imageKey} alt={leader.name} fill sizes="25vw" /></div> : <PortraitPlaceholder name={leader.name} />}
              <div><h3>{leader.name}</h3><span>{leader.role}</span><p>{leader.bio}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="document-cta section-pad">
        <div>
          <p className="eyebrow light">Corporate governance</p>
          <h2>Clarity is a form<br />of confidence.</h2>
        </div>
        <div>
          <p>AGM reports, annual reports, company policies and statutory disclosures will live in one orderly, searchable library.</p>
          <Link href="/investors" className="button button-gold">Visit Investor Corner <ArrowRight size={17} /></Link>
        </div>
      </section>

      <SiteFooter content={content} />
    </main>
  );
}
