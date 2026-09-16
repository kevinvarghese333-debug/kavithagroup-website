import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { getJobs, getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export const metadata = { title: "Careers | Kavitha Group" };

export default async function CareersPage() {
  const [content, jobs] = await Promise.all([getSiteContent(), getJobs()]);
  return (
    <main>
      <PageHero eyebrow="Careers" title="Build work that stays close to people." body="Join a diversified Kerala enterprise where practical thinking, integrity and long-term relationships matter." />
      <section className="career-values section-pad">
        <div><span>01</span><h2>Ownership</h2><p>Take responsibility for the details and the outcome.</p></div>
        <div><span>02</span><h2>Clarity</h2><p>Speak plainly, work transparently and keep promises.</p></div>
        <div><span>03</span><h2>Growth</h2><p>Learn across businesses while helping communities move forward.</p></div>
      </section>
      <section className="openings section-pad">
        <div className="section-heading"><div><p className="eyebrow">Open positions</p><h2>Find your next<br />opportunity.</h2></div><p>Roles published from the admin panel will appear here automatically.</p></div>
        <div className="job-list">
          {jobs.length ? jobs.map((job) => <article key={job.id}><div><h3>{job.title}</h3><span><MapPin size={14} />{job.location} · {job.type}</span><p>{job.description}</p></div><Link href={`/contact?subject=Career:%20${encodeURIComponent(job.title)}`}>Apply <ArrowRight size={16} /></Link></article>) : <div className="empty-jobs"><p>There are no published openings at the moment.</p><Link href="/contact" className="text-link">Send a general enquiry <ArrowRight size={16} /></Link></div>}
        </div>
      </section>
      <SiteFooter content={content} />
    </main>
  );
}
