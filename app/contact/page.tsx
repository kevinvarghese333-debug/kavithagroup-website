import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { SiteFooter } from "@/components/site-footer";
import { getSiteContent } from "@/lib/site-content";

export const metadata = { title: "Contact | Kavitha Group" };

export default async function ContactPage() {
  const content = await getSiteContent();
  return (
    <main>
      <PageHero eyebrow="Contact" title="Start a conversation with the right team." body="For business, customer, investor, career or media enquiries, reach Kavitha Group through one clear point of contact." />
      <section className="contact-section section-pad">
        <div className="contact-details">
          <p className="eyebrow">Head office</p>
          <h2>North Paravur,<br />Kerala.</h2>
          <div><MapPin size={19} /><span>{content.contactAddress}</span></div>
          <div><Phone size={19} /><a href={`tel:${content.contactPhone.replace(/\s/g, "")}`}>{content.contactPhone}</a></div>
          <div><Mail size={19} /><a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a></div>
        </div>
        <ContactForm />
      </section>
      <SiteFooter content={content} />
    </main>
  );
}
