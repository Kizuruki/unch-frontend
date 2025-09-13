"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();

  const isLevels   = pathname === "/" || pathname.startsWith("/levels");
  const isMyCharts = pathname.startsWith("/mycharts");
  const isUpload   = pathname.startsWith("/upload");

  return (
    <div className="nav-links">
      <Link href="/" className={isLevels ? "active" : ""} aria-current={isLevels ? "page" : undefined}>
        Levels
      </Link>
      <Link href="/mycharts" className={isMyCharts ? "active" : ""} aria-current={isMyCharts ? "page" : undefined}>
        My Charts
      </Link>
      <Link href="/upload" className={isUpload ? "active" : ""} aria-current={isUpload ? "page" : undefined}>
        Upload
      </Link>
    </div>
  );
}
