"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type HeaderProps = {
  props?: {
    page?: string;
    activePage?: string;
    ctaText?: string;
    ctaHref?: string;
  };
};

export default function Header({ props }: HeaderProps) {
  const page = props?.page || "Smart HealthCare";
  const activePage = props?.activePage || "home";
  const ctaText = props?.ctaText || "Appointment";
  const ctaHref = props?.ctaHref || "/admin/signup";

  useEffect(() => {
    document.title = page;
  }, [page]);

  const navItems = [
    {
      label: "Home",
      href: "/",
      key: "home",
    },
    {
      label: "About",
      href: "#about",
      key: "about",
    },
    {
      label: "Doctors",
      href: "#doctors",
      key: "doctors",
    },
    {
      label: "Department",
      href: "#departments",
      key: "departments",
    },
    {
      label: "Blog",
      href: "#blog",
      key: "blog",
    },
    {
      label: "Contact",
      href: "#contact",
      key: "contact",
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/medicalcenter/logo/logo.png"
            alt="Smart HealthCare Logo"
            width={150}
            height={45}
            priority
            style={{ width: "auto", height: "auto" }}
          />
        </Link>

        <div className="hidden items-center gap-8 text-sm font-semibold text-slate-700 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`transition hover:text-blue-600 ${
                activePage === item.key ? "text-blue-600" : "text-slate-700"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/admin/login"
            className={`transition hover:text-blue-600 ${
              activePage === "login" ? "text-blue-600" : "text-slate-700"
            }`}
          >
            Login
          </Link>
        </div>

        <Link
          href={ctaHref}
          className="hidden rounded bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 md:inline-block"
        >
          {ctaText}
        </Link>
      </nav>
    </header>
  );
}