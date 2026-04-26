// import Image from "next/image";
// import Link from "next/link";

// export default function Footer() {
//   return (
//     <footer className="bg-[#111a3a] px-5 py-16 text-white lg:px-8">
//       <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
//         <div>
//           <Image
//             src="/medicalcenter/logo/logo2_footer.png"
//             alt="Smart HealthCare Footer Logo"
//             width={160}
//             height={45}
//             style={{ width: "auto", height: "auto" }}
//           />

//           <p className="mt-6 leading-7 text-blue-100">
//             Smart HealthCare helps manage hospital services, doctors, patients
//             and appointments from one modern platform.
//           </p>
//         </div>

//         <div>
//           <h3 className="text-xl font-bold">Quick Links</h3>

//           <div className="mt-6 grid gap-3 text-blue-100">
//             <Link href="/" className="hover:text-white">
//               Home
//             </Link>
//             <a href="#about" className="hover:text-white">
//               About
//             </a>
//             <a href="#doctors" className="hover:text-white">
//               Doctors
//             </a>
//             <a href="#departments" className="hover:text-white">
//               Departments
//             </a>
//           </div>
//         </div>

//         <div>
//           <h3 className="text-xl font-bold">Contact</h3>

//           <div className="mt-6 grid gap-3 text-blue-100">
//             <p>+564 7885 3222</p>
//             <p>smarthealthcare@hms.com</p>
//             <p>Dhaka, Bangladesh</p>
//           </div>
//         </div>

//         <div>
//           <h3 className="text-xl font-bold">Admin</h3>

//           <div className="mt-6 grid gap-4">
//             <Link
//               href="/admin/login"
//               className="rounded bg-white px-5 py-3 text-center text-sm font-bold text-blue-700"
//             >
//               Login
//             </Link>

//             <Link
//               href="/admin/signup"
//               className="rounded border border-white/40 px-5 py-3 text-center text-sm font-bold text-white hover:bg-white/10"
//             >
//               Registration
//             </Link>
//           </div>
//         </div>
//       </div>

//       <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-8 text-center text-sm text-blue-100">
//         © {new Date().getFullYear()} Smart HealthCare. All rights reserved.
//       </div>
//     </footer>
//   );
// }



import Image from "next/image";
import Link from "next/link";

type FooterLink = {
  label: string;
  href: string;
};

type FooterProps = {
  props?: {
    logoSrc?: string;
    logoAlt?: string;
    description?: string;
    quickLinksTitle?: string;
    quickLinks?: FooterLink[];
    contactTitle?: string;
    phone?: string;
    email?: string;
    address?: string;
    adminTitle?: string;
    loginText?: string;
    loginHref?: string;
    registrationText?: string;
    registrationHref?: string;
    brandName?: string;
  };
};

export default function Footer({ props }: FooterProps) {
  const logoSrc = props?.logoSrc || "/medicalcenter/logo/logo2_footer.png";
  const logoAlt = props?.logoAlt || "Smart HealthCare Footer Logo";

  const description =
    props?.description ||
    "Smart HealthCare helps manage hospital services, doctors, patients and appointments from one modern platform.";

  const quickLinksTitle = props?.quickLinksTitle || "Quick Links";

  const quickLinks = props?.quickLinks || [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "About",
      href: "#about",
    },
    {
      label: "Doctors",
      href: "#doctors",
    },
    {
      label: "Departments",
      href: "#departments",
    },
  ];

  const contactTitle = props?.contactTitle || "Contact";
  const phone = props?.phone || "+564 7885 3222";
  const email = props?.email || "smarthealthcare@hms.com";
  const address = props?.address || "Dhaka, Bangladesh";

  const adminTitle = props?.adminTitle || "Admin";
  const loginText = props?.loginText || "Login";
  const loginHref = props?.loginHref || "/admin/login";
  const registrationText = props?.registrationText || "Registration";
  const registrationHref = props?.registrationHref || "/admin/signup";

  const brandName = props?.brandName || "Smart HealthCare";

  return (
    <footer className="bg-[#111a3a] px-5 py-16 text-white lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div>
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={160}
            height={45}
            style={{ width: "auto", height: "auto" }}
          />

          <p className="mt-6 leading-7 text-blue-100">{description}</p>
        </div>

        <div>
          <h3 className="text-xl font-bold">{quickLinksTitle}</h3>

          <div className="mt-6 grid gap-3 text-blue-100">
            {quickLinks.map((link) => {
              const isHashLink = link.href.startsWith("#");

              if (isHashLink) {
                return (
                  <a key={link.label} href={link.href} className="hover:text-white">
                    {link.label}
                  </a>
                );
              }

              return (
                <Link key={link.label} href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold">{contactTitle}</h3>

          <div className="mt-6 grid gap-3 text-blue-100">
            <p>{phone}</p>
            <p>{email}</p>
            <p>{address}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold">{adminTitle}</h3>

          <div className="mt-6 grid gap-4">
            <Link
              href={loginHref}
              className="rounded bg-white px-5 py-3 text-center text-sm font-bold text-blue-700"
            >
              {loginText}
            </Link>

            <Link
              href={registrationHref}
              className="rounded border border-white/40 px-5 py-3 text-center text-sm font-bold text-white hover:bg-white/10"
            >
              {registrationText}
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-8 text-center text-sm text-blue-100">
        © {new Date().getFullYear()} {brandName}. All rights reserved.
      </div>
    </footer>
  );
}