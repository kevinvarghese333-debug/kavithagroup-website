import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { PortraitPlaceholder } from "@/components/portrait-placeholder";
import { SiteFooter } from "@/components/site-footer";
import { getLeaders, getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

const values = [
  ["Trust", "Every relationship begins with honesty, transparency and the confidence to keep our word."],
  ["Enterprise", "We stay alert to practical opportunities that create lasting value for customers and communities."],
  ["Community", "The Group grows when the families, entrepreneurs and neighbourhoods around it grow."],
  ["Stewardship", "We take a long view—building institutions that can serve the next generation responsibly."],
];

export const metadata = { title: "Our Group | Kavitha Group" };

export default async function AboutPage() {
  const [content, leaders] = await Promise.all([getSiteContent(), getLeaders()]);
  return (
    <main>
      <PageHero eyebrow="Our Group" title="A family enterprise with an enduring point of view." body="Kavitha Group grew from entrepreneurial instinct, local relationships and the belief that trust compounds over time." />
      <section className="editorial-split section-pad">
        <div><p className="eyebrow">The beginning</p><h2>{content.storyTitle}</h2></div>
        <div className="editorial-copy">
          <p className="lead-copy">{content.storyBody}</p>
          <p>From the age of 15, K. Varghese explored multiple businesses before establishing a silver trade that served retailers and wholesalers. In 1998, that experience took permanent form as a small gold jewellery shop in Cherai—Kavitha Jewellery.</p>
          <p>Vypin Kuries and Finance followed with a simple idea: encourage people to save, bring them closer to the business and create relationships that went beyond a single purchase. Kavitha Finance later extended that spirit into microfinance for working women and loans shaped around everyday needs.</p>
          <p>In 2016, Kavitha Nidhi Limited joined the Group. The next defining chapter arrived in 2021 with an RBI licence for NBFC operations. Today, Kavitha Group spans eight businesses and a network of more than 38 branches across four Kerala districts.</p>
        </div>
      </section>

      <section className="origin-image section-pad">
        <div className="image-frame"><Image src="/assets/head-office.jpg" alt="Kavitha Group head office" fill sizes="80vw" /></div>
        <blockquote>“The first room was small. The ambition—and the responsibility—never was.”</blockquote>
      </section>

      <section className="values-section section-pad">
        <p className="eyebrow light">What guides us</p>
        <div className="values-grid">
          {values.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="leadership-page section-pad">
        <div className="section-heading"><div><p className="eyebrow">Leadership</p><h2>People behind<br />the long view.</h2></div><p>Draft profiles are clearly marked and can be replaced with approved biographies and original portraits through the admin panel.</p></div>
        <div className="leader-grid">
          {leaders.map((leader) => (
            <article className="leader-card" key={leader.id}>
              {leader.imageKey ? <div className="leader-image"><Image src={leader.imageKey} alt={leader.name} fill sizes="25vw" /></div> : <PortraitPlaceholder name={leader.name} />}
              <div><h3>{leader.name}</h3><span>{leader.role}</span><p>{leader.bio}</p></div>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter content={content} />
    </main>
  );
}
