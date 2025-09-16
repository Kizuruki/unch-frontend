"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();

  const isLevels   = pathname === "/" || pathname.startsWith("/levels");
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <div className="nav-links">
      <Link href="/" className={isLevels ? "active" : ""} aria-current={isLevels ? "page" : undefined} replace={true}>
        Levels
      </Link>
      <Link href="/dashboard" className={isDashboard ? "active" : ""} aria-current={isDashboard ? "page" : undefined}>
        Dashboard
      </Link>
    </div>
  );
}
