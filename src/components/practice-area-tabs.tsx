import Link from "next/link";
import type { PracticeAreaVariant } from "@/components/landing-page";

const tabs: { variant: PracticeAreaVariant; href: string; label: string }[] = [
  { variant: "dental", href: "/", label: "Dental" },
  { variant: "litigation", href: "/litigation", label: "Litigation — Any Case" },
];

export function PracticeAreaTabs({ active }: { active: PracticeAreaVariant }) {
  return (
    <div
      role="tablist"
      aria-label="Practice area"
      className="flex gap-1.5 font-mono text-[0.7rem] uppercase tracking-wider"
    >
      {tabs.map((tab) => {
        const isActive = tab.variant === active;
        return (
          <Link
            key={tab.variant}
            href={tab.href}
            role="tab"
            aria-selected={isActive}
            className={
              isActive
                ? "rounded-full bg-ivory px-3 py-1 text-obsidian"
                : "rounded-full px-3 py-1 text-smoke transition-colors hover:text-ivory"
            }
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
