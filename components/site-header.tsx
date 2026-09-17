import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { MobileNavigation } from "@/components/mobile-navigation";

export function BrandLockup({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className={`brand-lockup ${dark ? "brand-dark" : ""}`} aria-label="Kavitha Group home">
      <Image src="/assets/kavitha-mark.png" alt="" width={39} height={35} priority />
      <span><strong>Kavitha</strong><em>Group</em></span>
    </Link>
  );
}

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  return (
    <header className={`site-header ${overlay ? "header-overlay" : "header-solid"}`}>
      <BrandLockup dark={!overlay} />
      <nav aria-label="Primary navigation" className="desktop-nav">
        <Link href="/about">Our Group</Link>
        <Link href="/businesses">Businesses</Link>
        <Link href="/investors">Investor Corner</Link>
        <Link href="/customers">Customer Corner</Link>
        <Link href="/careers">Careers</Link>
      </nav>
      <Link href="/contact" className="nav-cta">
        Contact <ArrowDownRight size={15} aria-hidden="true" />
      </Link>
      <MobileNavigation solid={!overlay} />
    </header>
  );
}
