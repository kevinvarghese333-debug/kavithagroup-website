"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
  { href: "/about", label: "Our Group" },
  { href: "/businesses", label: "Businesses" },
  { href: "/investors", label: "Investor Corner" },
  { href: "/customers", label: "Customer Corner" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export function MobileNavigation({ solid = false }: { solid?: boolean }) {
  return (
    <div className={`mobile-navigation ${solid ? "mobile-navigation-solid" : ""}`}>
      <Sheet>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon-lg"
              className="mobile-nav-trigger"
              aria-label="Open navigation"
            />
          }
        >
          <Menu aria-hidden="true" />
        </SheetTrigger>
        <SheetContent className="mobile-nav-sheet" side="right">
          <SheetHeader className="mobile-nav-header">
            <Image src="/assets/kavitha-mark.png" alt="" width={42} height={38} />
            <div>
              <span>Established enterprise</span>
              <SheetTitle>Kavitha Group</SheetTitle>
            </div>
          </SheetHeader>
          <nav className="mobile-nav-links" aria-label="Mobile navigation">
            {navigation.map((item, index) => (
              <SheetClose
                key={item.href}
                render={<Link href={item.href} className="mobile-nav-link" />}
              >
                <span>{item.label}</span>
                <small>{String(index + 1).padStart(2, "0")}</small>
              </SheetClose>
            ))}
          </nav>
          <div className="mobile-nav-footer">
            <p>One group. Many enterprises. Built on trust.</p>
            <Link href="/investors">
              Corporate information <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
