"use client";

import Link from "next/link";
import { useState } from "react";
import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "記事一覧" },
    { href: "/categories", label: "カテゴリ" },
    { href: "/tags", label: "タグ" },
    { href: "/profile", label: "プロフィール" },
  ];

  return (
    <header className="border-b border-[var(--sotw-border)] bg-[var(--sotw-bg)]">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[var(--sotw-moss)] rounded-sm" />
          <span className="text-[var(--sotw-text)] font-bold tracking-tight text-lg">
            Still On The Wall
          </span>
        </Link>

        {/* デスクトップナビ */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--sotw-text-2)]">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[var(--sotw-moss)] transition-colors">
              {link.label}
            </Link>
          ))}
          <DarkModeToggle />
        </nav>

        {/* ハンバーガー＋トグル（モバイル） */}
        <div className="md:hidden flex items-center gap-2">
          <DarkModeToggle />
          <button
            className="flex flex-col gap-1.5 p-1"
            onClick={() => setOpen(!open)}
            aria-label="メニューを開く"
          >
            <span className={`block w-5 h-0.5 bg-[var(--sotw-text)] transition-transform duration-200 ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block w-5 h-0.5 bg-[var(--sotw-text)] transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-[var(--sotw-text)] transition-transform duration-200 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* モバイルメニュー */}
      {open && (
        <div className="md:hidden border-t border-[var(--sotw-border)] bg-[var(--sotw-bg)]">
          <nav className="flex flex-col max-w-4xl mx-auto px-6 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm text-[var(--sotw-text-2)] hover:text-[var(--sotw-moss)] border-b border-[var(--sotw-border)] last:border-0 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
