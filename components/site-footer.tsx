import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandLockup } from "@/components/site-header";
import type { SiteContent } from "@/lib/site-content";

export function SiteFooter({ content }: { content: SiteContent }) {
  return (
    <footer className="site-footer">
      <div className="footer-intro">
        <BrandLockup />
        <p>One group. Many enterprises. A single promise—built on trust.</p>
      </div>
      <div className="footer-links">
        <div>
          <span>Explore</span>
          <Link href="/about">Our Group</Link>
          <Link href="/businesses">Businesses</Link>
          <Link href="/investors">Investor Corner</Link>
          <Link href="/careers">Careers</Link>
        </div>
        <div>
          <span>Connect</span>
          <Link href="/contact">Contact</Link>
          <Link href="/customers">Customer Corner</Link>
          <a href="https://www.linkedin.com/company/kavithagroup" target="_blank" rel="noreferrer">
            LinkedIn <ArrowUpRight size={13} />
          </a>
          <Link href="/admin">Admin</Link>
        </div>
        <div className="footer-contact">
          <span>Head office</span>
          <p>{content.contactAddress}</p>
          <a href={`tel:${content.contactPhone.replace(/\s/g, "")}`}>{content.contactPhone}</a>
          <a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Kavitha Group. All rights reserved.</span>
        <span>Built on trust.</span>
      </div>
    </footer>
  );
}
