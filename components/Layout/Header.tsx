import Image from "next/image";
import Link from "next/link";

export default function Header() {
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
          <Link href="/" className="transition hover:text-blue-600">
            Home
          </Link>

          <a href="#about" className="transition hover:text-blue-600">
            About
          </a>

          <a href="#doctors" className="transition hover:text-blue-600">
            Doctors
          </a>

          <a href="#departments" className="transition hover:text-blue-600">
            Department
          </a>

          <a href="#blog" className="transition hover:text-blue-600">
            Blog
          </a>

          <a href="#contact" className="transition hover:text-blue-600">
            Contact
          </a>

          <Link href="/admin/login" className="transition hover:text-blue-600">
            Login
          </Link>
        </div>

        <Link
          href="/admin/signup"
          className="hidden rounded bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 md:inline-block"
        >
          Appointment
        </Link>
      </nav>
    </header>
  );
}