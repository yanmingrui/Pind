"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SectionId = "top" | "studio" | "templates" | "tutorial";

const navigationItems: Array<{ id: Exclude<SectionId, "top">; label: string; href: string }> = [
  { id: "studio", label: "转换", href: "/#studio" },
  { id: "templates", label: "模板", href: "/templates" },
  { id: "tutorial", label: "教程", href: "/#tutorial" }
];

export function SiteHeader() {
  const [activeSection, setActiveSection] = useState<SectionId>("top");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      const currentScrolled = window.scrollY > 24;
      setIsScrolled(currentScrolled);
      document.body.classList.toggle("page-scrolled", currentScrolled);

      const studio = document.getElementById("studio");
      const templates = document.getElementById("templates");
      const tutorial = document.getElementById("tutorial");
      const heroBottom = studio?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;

      if (heroBottom > 180) {
        setActiveSection("top");
        return;
      }

      const candidates: Array<{ id: Exclude<SectionId, "top">; top: number }> = [
        { id: "studio", top: studio?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY },
        { id: "templates", top: templates?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY },
        { id: "tutorial", top: tutorial?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY }
      ];

      const visibleSection =
        candidates
          .filter((candidate) => candidate.top <= 180)
          .sort((left, right) => right.top - left.top)[0]?.id ?? "studio";

      setActiveSection(visibleSection);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      document.body.classList.remove("page-scrolled");
    };
  }, []);

  return (
    <header className="site-header" data-scrolled={isScrolled}>
      <div className="site-header-inner">
        <Link aria-current={activeSection === "top" ? "page" : undefined} className="site-logo" href="/">
          <span className="site-logo-mark">T</span>
          <span>Trajec</span>
        </Link>

        <nav aria-label="Primary" className="site-nav">
          {navigationItems.map((item) => (
            <Link
              aria-current={activeSection === item.id ? "page" : undefined}
              className={activeSection === item.id ? "site-nav-link site-nav-link-active" : "site-nav-link"}
              href={item.href}
              key={item.id}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-nav-actions">
          <button className="nav-text-button" type="button">
            登录
          </button>
          <Link className="primary-button nav-cta" href="/#studio">
            开始使用
          </Link>
        </div>
      </div>
    </header>
  );
}