// import Image from "next/image";
// import Link from "next/link";
// import type { Metadata } from "next";
// import Header from "@/components/Layout/Header";
// import Footer from "@/components/Layout/Footer";


// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// export const metadata: Metadata = {
//   title: "Smart HealthCare | Hospital Management System",
//   description:
//     "Smart HealthCare is a modern hospital management system for doctors, patients, departments, appointments and healthcare services.",
//   keywords: [
//     "hospital management system",
//     "medical center",
//     "healthcare website",
//     "doctor appointment",
//     "patient management",
//     "hospital dashboard",
//   ],
//   robots: {
//     index: true,
//     follow: true,
//   },
// };

// const departments = [
//   {
//     title: "Dentistry",
//     image: "/medicalcenter/gallery/clean.png",
//     description:
//       "Professional dental care services for diagnosis, treatment and oral health management.",
//   },
//   {
//     title: "Cardiology",
//     image: "/medicalcenter/gallery/heart.png",
//     description:
//       "Heart care services with expert doctors, modern diagnosis and patient monitoring.",
//   },
//   {
//     title: "ENT Specialists",
//     image: "/medicalcenter/gallery/medical.png",
//     description:
//       "Ear, nose and throat care for patients with specialist consultation support.",
//   },
//   {
//     title: "Orthopedic",
//     image: "/medicalcenter/gallery/orthopedics.png",
//     description:
//       "Bone, joint and muscle care with proper treatment planning and recovery support.",
//   },
//   {
//     title: "Neurology",
//     image: "/medicalcenter/gallery/brainstorm.png",
//     description:
//       "Neurology consultation for brain, nerves and related medical conditions.",
//   },
//   {
//     title: "Blood Screening",
//     image: "/medicalcenter/gallery/red-blood-cells.png",
//     description:
//       "Quick and organized screening services for safe medical decision making.",
//   },

// ];

// const doctors = [
//   {
//     name: "Alvin Maxwell",
//     role: "Medicine Specialist",
//     image: "/medicalcenter/gallery/team1.png",
//   },
//   {
//     name: "Maria Smith",
//     role: "Cardiology Specialist",
//     image: "/medicalcenter/gallery/team2.png",
//   },
//   {
//     name: "Angela Doe",
//     role: "Dental Specialist",
//     image: "/medicalcenter/gallery/team3.png",
//   },
// ];

// const blogs = [
//   {
//     category: "Health",
//     date: "Nov 30, 2026",
//     title: "Amazing Places To Visit In Summer",
//     image: "/medicalcenter/gallery/blog1.png",
//   },
//   {
//     category: "Checkup",
//     date: "Nov 30, 2026",
//     title: "Developing Care Without Losing Quality",
//     image: "/medicalcenter/gallery/blog2.png",
//   },
//   {
//     category: "Operation",
//     date: "Nov 30, 2026",
//     title: "Winter Healthcare Tips From Doctors",
//     image: "/medicalcenter/gallery/blog3.png",
//   },
// ];

// export default function HomePage() {
//   return (
//     <>
//       <Header />

//       <main className="min-h-screen bg-white text-slate-900">
//         {/* Hero */}
//         <section className="relative min-h-[720px] overflow-hidden bg-[#eef7ff]">
//           <Image
//             src="/medicalcenter/hero/h1_hero.png"
//             alt="Medical center hero"
//             fill
//             priority
//             className="object-cover object-center"
//           />

//           <div className="relative z-10 mx-auto flex min-h-[720px] max-w-7xl items-center px-5 lg:px-8">
//             <div className="max-w-3xl">
//               <p className="mb-5 text-lg font-semibold text-blue-600">
//                 Committed to success
//               </p>

//               <h1 className="text-5xl font-black leading-tight text-slate-900 sm:text-6xl lg:text-7xl">
//                 We care about your{" "}
//                 <span className="text-blue-600">health</span>
//               </h1>

//               <p className="mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
//                 Manage doctors, patients, appointments, departments and
//                 hospital services from one smart healthcare management system.
//               </p>

//               <div className="mt-9 flex flex-col gap-4 sm:flex-row">
//                 <Link
//                   href="/admin/signup"
//                   className="rounded bg-blue-600 px-8 py-4 text-center text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700"
//                 >
//                   Appointment →
//                 </Link>

//                 <Link
//                   href="/admin/login"
//                   className="rounded border border-blue-600 px-8 py-4 text-center text-sm font-bold uppercase tracking-wide text-blue-600 transition hover:bg-blue-600 hover:text-white"
//                 >
//                   Admin Login
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* About */}
//         <section id="about" className="px-5 py-24 lg:px-8">
//           <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
//             <div>
//               <p className="text-lg font-semibold text-blue-600">
//                 About Our Company
//               </p>

//               <h2 className="mt-4 max-w-xl text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
//                 Welcome To Our Hospital
//               </h2>

//               <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">
//                 Smart HealthCare helps hospitals organize daily work such as
//                 doctor management, patient records, appointments, departments
//                 and medical services.
//               </p>

//               <div className="mt-8 grid gap-4">
//                 <Link
//                   href="#doctors"
//                   className="inline-flex w-fit rounded bg-blue-600 px-7 py-4 text-sm font-bold uppercase text-white transition hover:bg-blue-700"
//                 >
//                   Find Doctors →
//                 </Link>

//                 <Link
//                   href="/admin/signup"
//                   className="inline-flex w-fit rounded border border-blue-600 px-7 py-4 text-sm font-bold uppercase text-blue-600 transition hover:bg-blue-600 hover:text-white"
//                 >
//                   Appointment →
//                 </Link>

//                 <Link
//                   href="#contact"
//                   className="inline-flex w-fit rounded border border-blue-600 px-7 py-4 text-sm font-bold uppercase text-blue-600 transition hover:bg-blue-600 hover:text-white"
//                 >
//                   Emergency →
//                 </Link>
//               </div>
//             </div>

//             <div className="relative min-h-[620px]">
//               <Image
//                 src="/medicalcenter/gallery/about1.png"
//                 alt="Hospital doctor"
//                 width={360}
//                 height={617}
//                 className="absolute bottom-0 right-0 z-20 rounded-lg"
//                 style={{ width: "auto", height: "auto" }}
//               />

//               <Image
//                 src="/medicalcenter/gallery/about2.png"
//                 alt="Hospital service"
//                 width={360}
//                 height={617}
//                 className="absolute left-0 top-0 z-10 rounded-lg shadow-2xl"
//                 style={{ width: "auto", height: "auto" }}
//               />

//               <div className="absolute bottom-8 left-8 z-30 rounded bg-blue-600 px-8 py-6 text-white shadow-xl">
//                 <p className="text-4xl font-black">24+</p>
//                 <p className="mt-1 text-sm font-semibold uppercase">
//                   Years Experience
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Departments */}
//         <section id="departments" className="bg-slate-50 px-5 py-24 lg:px-8">
//           <div className="mx-auto max-w-7xl">
//             <div className="mx-auto max-w-2xl text-center">
//               <p className="text-lg font-semibold text-blue-600">
//                 Our Departments
//               </p>

//               <h2 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">
//                 Our Medical Services
//               </h2>
//             </div>

//             <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {departments.map((department) => (
//                 <article
//                   key={department.title}
//                   className="overflow-hidden rounded bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
//                 >
//                   <div className="relative h-56 w-full overflow-hidden bg-blue-50">
//                     <Image
//                       src={department.image}
//                       alt={department.title}
//                       fill
//                       className="object-cover transition duration-500 hover:scale-105"
//                       sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                     />
//                   </div>

//                   <div className="p-8">
//                     <h3 className="text-2xl font-bold text-slate-900">
//                       {department.title}
//                     </h3>

//                     <p className="mt-4 leading-7 text-slate-600">
//                       {department.description}
//                     </p>

//                     <Link
//                       href="/admin/signup"
//                       className="mt-6 inline-flex font-bold text-blue-600 hover:text-blue-700"
//                     >
//                       Appointment →
//                     </Link>
//                   </div>
//                 </article>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Doctors */}
//         <section id="doctors" className="px-5 py-24 lg:px-8">
//           <div className="mx-auto max-w-7xl">
//             <div className="mx-auto max-w-2xl text-center">
//               <p className="text-lg font-semibold text-blue-600">
//                 Our Doctors
//               </p>

//               <h2 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">
//                 Our Specialist
//               </h2>
//             </div>

//             <div className="mt-14 grid gap-8 md:grid-cols-3">
//               {doctors.map((doctor) => (
//                 <article
//                   key={doctor.name}
//                   className="overflow-hidden rounded bg-white text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
//                 >
//                   <Image
//                     src={doctor.image}
//                     alt={doctor.name}
//                     width={360}
//                     height={444}
//                     className="w-full"
//                     style={{ height: "auto" }}
//                   />

//                   <div className="p-7">
//                     <h3 className="text-2xl font-bold">{doctor.name}</h3>
//                     <p className="mt-2 text-sm font-semibold text-blue-600">
//                       {doctor.role}
//                     </p>
//                   </div>
//                 </article>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Appointment Form */}
//         <section id="contact" className="bg-slate-50 px-5 py-24 lg:px-8">
//           <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
//             <div>
//               <p className="text-lg font-semibold text-blue-600">
//                 Appointment Apply Form
//               </p>

//               <h2 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">
//                 Appointment Form
//               </h2>

//               <form className="mt-10 grid gap-5">
//                 <div className="grid gap-5 sm:grid-cols-2">
//                   <input
//                     type="text"
//                     placeholder="Name"
//                     className="rounded border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-600"
//                   />

//                   <input
//                     type="email"
//                     placeholder="Email"
//                     className="rounded border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-600"
//                   />
//                 </div>

//                 <div className="grid gap-5 sm:grid-cols-2">
//                   <select className="rounded border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-600">
//                     <option>Health Law</option>
//                     <option>Cardiology</option>
//                     <option>Dentistry</option>
//                     <option>Neurology</option>
//                   </select>

//                   <select className="rounded border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-600">
//                     <option>Choose Doctor</option>
//                     <option>Alvin Maxwell</option>
//                     <option>Maria Smith</option>
//                     <option>Angela Doe</option>
//                   </select>
//                 </div>

//                 <textarea
//                   placeholder="Message"
//                   rows={5}
//                   className="rounded border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-600"
//                 />

//                 <button
//                   type="submit"
//                   className="w-fit rounded bg-blue-600 px-8 py-4 text-sm font-bold uppercase text-white transition hover:bg-blue-700"
//                 >
//                   Submit Now →
//                 </button>
//               </form>
//             </div>

//             <div>
//               <Image
//                 src="/medicalcenter/gallery/contact_form.png"
//                 alt="Appointment contact form"
//                 width={650}
//                 height={650}
//                 className="w-full"
//                 style={{ height: "auto" }}
//               />
//             </div>
//           </div>
//         </section>

//         {/* Blog */}
//         <section id="blog" className="px-5 py-24 lg:px-8">
//           <div className="mx-auto max-w-7xl">
//             <div className="mx-auto max-w-2xl text-center">
//               <p className="text-lg font-semibold text-blue-600">
//                 Our Recent News
//               </p>

//               <h2 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">
//                 Our News From Blog
//               </h2>
//             </div>

//             <div className="mt-14 grid gap-8 md:grid-cols-3">
//               {blogs.map((blog) => (
//                 <article
//                   key={blog.title}
//                   className="overflow-hidden rounded bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
//                 >
//                   <Image
//                     src={blog.image}
//                     alt={blog.title}
//                     width={360}
//                     height={250}
//                     className="h-60 w-full object-cover"
//                   />

//                   <div className="p-7">
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="font-bold text-blue-600">
//                         {blog.category}
//                       </span>
//                       <span className="text-slate-500">{blog.date}</span>
//                     </div>

//                     <h3 className="mt-5 text-xl font-bold leading-7">
//                       {blog.title}
//                     </h3>

//                     <Link
//                       href="/admin/login"
//                       className="mt-6 inline-flex font-bold text-blue-600 hover:text-blue-700"
//                     >
//                       Read more →
//                     </Link>
//                   </div>
//                 </article>
//               ))}
//             </div>
//           </div>
//         </section>
//       </main>

//       <Footer />
//     </>
//   );
// }



import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Smart HealthCare | Hospital Management System",
  description:
    "Smart HealthCare is a modern hospital management system for doctors, patients, departments, appointments and healthcare services.",
  keywords: [
    "hospital management system",
    "medical center",
    "healthcare website",
    "doctor appointment",
    "patient management",
    "hospital dashboard",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

const departments = [
  {
    title: "Dentistry",
    image: "/medicalcenter/gallery/clean.png",
    description:
      "Professional dental care services for diagnosis, treatment and oral health management.",
  },
  {
    title: "Cardiology",
    image: "/medicalcenter/gallery/heart.png",
    description:
      "Heart care services with expert doctors, modern diagnosis and patient monitoring.",
  },
  {
    title: "ENT Specialists",
    image: "/medicalcenter/gallery/medical.png",
    description:
      "Ear, nose and throat care for patients with specialist consultation support.",
  },
  {
    title: "Orthopedic",
    image: "/medicalcenter/gallery/orthopedics.png",
    description:
      "Bone, joint and muscle care with proper treatment planning and recovery support.",
  },
  {
    title: "Neurology",
    image: "/medicalcenter/gallery/brainstorm.png",
    description:
      "Neurology consultation for brain, nerves and related medical conditions.",
  },
  {
    title: "Blood Screening",
    image: "/medicalcenter/gallery/red-blood-cells.png",
    description:
      "Quick and organized screening services for safe medical decision making.",
  },
];

const doctors = [
  {
    name: "Alvin Maxwell",
    role: "Medicine Specialist",
    image: "/medicalcenter/gallery/team1.png",
  },
  {
    name: "Maria Smith",
    role: "Cardiology Specialist",
    image: "/medicalcenter/gallery/team2.png",
  },
  {
    name: "Angela Doe",
    role: "Dental Specialist",
    image: "/medicalcenter/gallery/team3.png",
  },
];

const blogs = [
  {
    category: "Health",
    date: "Nov 30, 2026",
    title: "Amazing Places To Visit In Summer",
    image: "/medicalcenter/gallery/blog1.png",
  },
  {
    category: "Checkup",
    date: "Nov 30, 2026",
    title: "Developing Care Without Losing Quality",
    image: "/medicalcenter/gallery/blog2.png",
  },
  {
    category: "Operation",
    date: "Nov 30, 2026",
    title: "Winter Healthcare Tips From Doctors",
    image: "/medicalcenter/gallery/blog3.png",
  },
];

export default function HomePage() {
  return (
    <>
      {/* <Header /> */}

      <Header
        props={{
          page: "Home | Smart HealthCare",
          activePage: "home",
          ctaText: "Appointment",
          ctaHref: "/admin/signup",
        }}
      />

      <main className="min-h-screen bg-white text-slate-900">
        {/* Hero */}
        <section className="relative min-h-[720px] overflow-hidden bg-[#eef7ff]">
          <Image
            src="/medicalcenter/hero/h1_hero.png"
            alt="Medical center hero"
            fill
            priority
            className="object-cover object-center"
          />

          <div className="relative z-10 mx-auto flex min-h-[720px] max-w-7xl items-center px-5 lg:px-8">
            <div className="max-w-3xl">
              <p className="mb-5 text-lg font-semibold text-blue-600">
                Committed to success
              </p>

              <h1 className="text-5xl font-black leading-tight text-slate-900 sm:text-6xl lg:text-7xl">
                We care about your{" "}
                <span className="text-blue-600">health</span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Manage doctors, patients, appointments, departments and
                hospital services from one smart healthcare management system.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/admin/signup"
                  className="rounded bg-blue-600 px-8 py-4 text-center text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700"
                >
                  Appointment →
                </Link>

                <Link
                  href="/admin/login"
                  className="rounded border border-blue-600 px-8 py-4 text-center text-sm font-bold uppercase tracking-wide text-blue-600 transition hover:bg-blue-600 hover:text-white"
                >
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="px-5 py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
            <div>
              <p className="text-lg font-semibold text-blue-600">
                About Our Company
              </p>

              <h2 className="mt-4 max-w-xl text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
                Welcome To Our Hospital
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">
                Smart HealthCare helps hospitals organize daily work such as
                doctor management, patient records, appointments, departments
                and medical services.
              </p>

              <div className="mt-8 grid gap-4">
                <Link
                  href="#doctors"
                  className="inline-flex w-fit rounded bg-blue-600 px-7 py-4 text-sm font-bold uppercase text-white transition hover:bg-blue-700"
                >
                  Find Doctors →
                </Link>

                <Link
                  href="/admin/signup"
                  className="inline-flex w-fit rounded border border-blue-600 px-7 py-4 text-sm font-bold uppercase text-blue-600 transition hover:bg-blue-600 hover:text-white"
                >
                  Appointment →
                </Link>

                <Link
                  href="#contact"
                  className="inline-flex w-fit rounded border border-blue-600 px-7 py-4 text-sm font-bold uppercase text-blue-600 transition hover:bg-blue-600 hover:text-white"
                >
                  Emergency →
                </Link>
              </div>
            </div>

            <div className="relative min-h-[620px]">
              <Image
                src="/medicalcenter/gallery/about1.png"
                alt="Hospital doctor"
                width={360}
                height={617}
                className="absolute bottom-0 right-0 z-20 rounded-lg"
                style={{ width: "auto", height: "auto" }}
              />

              <Image
                src="/medicalcenter/gallery/about2.png"
                alt="Hospital service"
                width={360}
                height={617}
                className="absolute left-0 top-0 z-10 rounded-lg shadow-2xl"
                style={{ width: "auto", height: "auto" }}
              />

              <div className="absolute bottom-8 left-8 z-30 rounded bg-blue-600 px-8 py-6 text-white shadow-xl">
                <p className="text-4xl font-black">24+</p>
                <p className="mt-1 text-sm font-semibold uppercase">
                  Years Experience
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Departments */}
        <section id="departments" className="bg-slate-50 px-5 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-lg font-semibold text-blue-600">
                Our Departments
              </p>

              <h2 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">
                Our Medical Services
              </h2>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {departments.map((department) => (
                <article
                  key={department.title}
                  className="rounded bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 p-5">
                    <Image
                      src={department.image}
                      alt={department.title}
                      width={64}
                      height={64}
                      className="h-14 w-14 object-contain"
                    />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-slate-900">
                    {department.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    {department.description}
                  </p>

                  <Link
                    href="/admin/signup"
                    className="mt-6 inline-flex font-bold text-blue-600 hover:text-blue-700"
                  >
                    Appointment →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Doctors */}
        <section id="doctors" className="px-5 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-lg font-semibold text-blue-600">
                Our Doctors
              </p>

              <h2 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">
                Our Specialist
              </h2>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {doctors.map((doctor) => (
                <article
                  key={doctor.name}
                  className="overflow-hidden rounded bg-white text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    width={360}
                    height={444}
                    className="w-full"
                    style={{ height: "auto" }}
                  />

                  <div className="p-7">
                    <h3 className="text-2xl font-bold">{doctor.name}</h3>
                    <p className="mt-2 text-sm font-semibold text-blue-600">
                      {doctor.role}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Appointment Form */}
        <section id="contact" className="bg-slate-50 px-5 py-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-lg font-semibold text-blue-600">
                Appointment Apply Form
              </p>

              <h2 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">
                Appointment Form
              </h2>

              <form className="mt-10 grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Name"
                    className="rounded border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-600"
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    className="rounded border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <select className="rounded border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-600">
                    <option>Health Law</option>
                    <option>Cardiology</option>
                    <option>Dentistry</option>
                    <option>Neurology</option>
                  </select>

                  <select className="rounded border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-600">
                    <option>Choose Doctor</option>
                    <option>Alvin Maxwell</option>
                    <option>Maria Smith</option>
                    <option>Angela Doe</option>
                  </select>
                </div>

                <textarea
                  placeholder="Message"
                  rows={5}
                  className="rounded border border-slate-200 bg-white px-5 py-4 outline-none focus:border-blue-600"
                />

                <button
                  type="submit"
                  className="w-fit rounded bg-blue-600 px-8 py-4 text-sm font-bold uppercase text-white transition hover:bg-blue-700"
                >
                  Submit Now →
                </button>
              </form>
            </div>

            <div>
              <Image
                src="/medicalcenter/gallery/contact_form.png"
                alt="Appointment contact form"
                width={650}
                height={650}
                className="w-full"
                style={{ height: "auto" }}
              />
            </div>
          </div>
        </section>

        {/* Blog */}
        <section id="blog" className="px-5 py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-lg font-semibold text-blue-600">
                Our Recent News
              </p>

              <h2 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">
                Our News From Blog
              </h2>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {blogs.map((blog) => (
                <article
                  key={blog.title}
                  className="overflow-hidden rounded bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    width={360}
                    height={250}
                    className="h-60 w-full object-cover"
                  />

                  <div className="p-7">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-blue-600">
                        {blog.category}
                      </span>
                      <span className="text-slate-500">{blog.date}</span>
                    </div>

                    <h3 className="mt-5 text-xl font-bold leading-7">
                      {blog.title}
                    </h3>

                    <Link
                      href="/admin/login"
                      className="mt-6 inline-flex font-bold text-blue-600 hover:text-blue-700"
                    >
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer
      props={{
        logoSrc: "/medicalcenter/logo/logo2_footer.png",
        logoAlt: "Smart HealthCare Footer Logo",
        description:
          "Smart HealthCare helps manage hospital services, doctors, patients and appointments from one modern platform.",
        quickLinksTitle: "Quick Links",
        quickLinks: [
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
        ],
        contactTitle: "Contact",
        phone: "+564 7885 3222",
        email: "smarthealthcare@hms.com",
        address: "Dhaka, Bangladesh",
        adminTitle: "Admin",
        loginText: "Login",
        loginHref: "/admin/login",
        registrationText: "Registration",
        registrationHref: "/admin/signup",
        brandName: "Smart HealthCare",
      }}
    />
    </>
  );
}