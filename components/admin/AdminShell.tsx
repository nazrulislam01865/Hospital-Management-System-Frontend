"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BedDouble,
  Building2,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  ReceiptText,
  ShieldCheck,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  clearAuthStorage,
  getStoredAdminName,
  getStoredToken,
  isTokenExpired,
} from "@/lib/auth-storage";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Patients",
    href: "/admin/dashboard/patients",
    icon: UsersRound,
  },
  {
    label: "Appointments",
    href: "/admin/dashboard/appointments",
    icon: CalendarDays,
  },
  {
    label: "Rooms",
    href: "/admin/dashboard/rooms",
    icon: BedDouble,
  },
  {
    label: "Billing",
    href: "/admin/dashboard/billing",
    icon: ReceiptText,
  },
  {
    label: "Admins",
    href: "/admin/dashboard/admins",
    icon: ShieldCheck,
  },
  {
    label: "Departments",
    href: "/admin/dashboard/departments",
    icon: Building2,
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = getStoredToken();

    if (!token || isTokenExpired(token)) {
      clearAuthStorage();
      router.replace("/admin/login?expired=1");
      return;
    }

    const storedAdminName = getStoredAdminName();

    if (storedAdminName) {
      setAdminName(storedAdminName);
    }

    setCheckingAuth(false);
  }, [router]);

  const handleLogout = () => {
    clearAuthStorage();
    router.push("/admin/login");
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="text-sm font-semibold text-base-content/70">
            Checking session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Top Navbar */}
      <header className="navbar fixed left-0 right-0 top-0 z-40 h-16 border-b border-base-300 bg-base-100 px-4 shadow-sm lg:px-8">
        <div className="flex-1 gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="btn btn-ghost btn-square lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>

          <Link
            href="/admin/dashboard"
            className="text-xl font-bold tracking-tight text-base-content"
          >
            HMS<span className="text-primary">Admin</span>
          </Link>
        </div>

        <div className="flex-none gap-3">
          <div className="hidden items-center gap-3 rounded-box border border-base-300 bg-base-100 px-3 py-2 sm:flex">
            <div className="avatar placeholder">
              <div className="w-9 rounded-full bg-primary text-primary-content">
                <UserRound size={18} />
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold leading-none text-base-content">
                {adminName}
              </p>
              <p className="mt-1 text-xs text-base-content/60">
                Hospital Management
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-outline btn-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed bottom-0 left-0 top-16 z-30 w-72 border-r border-base-300 bg-base-100 transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-base-300 px-5 py-4 lg:hidden">
          <p className="font-semibold text-base-content">Navigation</p>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="btn btn-ghost btn-sm btn-square"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-5">
          <ul className="menu gap-1 rounded-box bg-base-100 p-0">
            {navItems.map((item) => {
              const Icon = item.icon;

              const active =
                item.href === "/admin/dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "font-semibold",
                      active
                        ? "active bg-primary text-primary-content"
                        : "text-base-content/75"
                    )}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-base-300 p-4">
          <div className="rounded-box bg-base-200 p-4">
            <p className="text-sm font-bold text-base-content">
              Hospital Admin
            </p>
            <p className="mt-1 text-xs text-base-content/60">
              Manage patients, appointments, rooms, billing, and departments.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
        />
      ) : null}

      {/* Main Content */}
      <main className="pt-16 lg:pl-72">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}

// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import {
//   BedDouble,
//   Building2,
//   CalendarDays,
//   LayoutDashboard,
//   LogOut,
//   Menu,
//   ReceiptText,
//   ShieldCheck,
//   UserRound,
//   UsersRound,
//   X,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { cn } from "@/lib/utils";
// import {
//   clearAuthStorage,
//   getStoredAdminName,
//   getStoredToken,
//   isTokenExpired,
// } from "@/lib/auth-storage";

// const navItems = [
//   {
//     label: "Dashboard",
//     href: "/admin/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     label: "Patients",
//     href: "/admin/dashboard/patients",
//     icon: UsersRound,
//   },
//   {
//     label: "Appointments",
//     href: "/admin/dashboard/appointments",
//     icon: CalendarDays,
//   },
//   {
//     label: "Rooms",
//     href: "/admin/dashboard/rooms",
//     icon: BedDouble,
//   },
//   {
//     label: "Billing",
//     href: "/admin/dashboard/billing",
//     icon: ReceiptText,
//   },
//   {
//     label: "Admins",
//     href: "/admin/dashboard/admins",
//     icon: ShieldCheck,
//   },
//   {
//     label: "Departments",
//     href: "/admin/dashboard/departments",
//     icon: Building2,
//   },
// ];

// export function AdminShell({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
//   const router = useRouter();

//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [adminName, setAdminName] = useState("Admin");
//   const [checkingAuth, setCheckingAuth] = useState(true);

//   useEffect(() => {
//     const token = getStoredToken();

//     if (!token || isTokenExpired(token)) {
//       clearAuthStorage();
//       router.replace("/admin/login?expired=1");
//       return;
//     }

//     const storedAdminName = getStoredAdminName();

//     if (storedAdminName) {
//       setAdminName(storedAdminName);
//     }

//     setCheckingAuth(false);
//   }, [router]);

//   const handleLogout = () => {
//     clearAuthStorage();
//     router.push("/admin/login");
//   };

//   if (checkingAuth) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-slate-100">
//         <p className="text-sm font-semibold text-slate-600">
//           Checking session...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-100">
//       <header className="fixed left-0 right-0 top-0 z-40 h-16 border-b border-slate-200 bg-white">
//         <div className="flex h-full items-center justify-between px-4 lg:px-8">
//           <div className="flex items-center gap-3">
//             <button
//               type="button"
//               onClick={() => setSidebarOpen(true)}
//               className="rounded-xl border border-slate-200 p-2 text-slate-700 lg:hidden"
//               aria-label="Open sidebar"
//             >
//               <Menu size={20} />
//             </button>

//             <Link
//               href="/admin/dashboard"
//               className="text-xl font-bold tracking-tight text-slate-950"
//             >
//               HMS<span className="text-blue-600">Admin</span>
//             </Link>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="hidden items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 sm:flex">
//               <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-700">
//                 <UserRound size={17} />
//               </div>

//               <div>
//                 <p className="text-sm font-semibold leading-none text-slate-900">
//                   {adminName}
//                 </p>
//                 <p className="mt-1 text-xs text-slate-500">
//                   Hospital Management
//                 </p>
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={handleLogout}
//               className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//             >
//               <LogOut size={16} />
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       <aside
//         className={cn(
//           "fixed bottom-0 left-0 top-16 z-30 w-72 border-r border-slate-200 bg-white transition-transform lg:translate-x-0",
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         )}
//       >
//         <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 lg:hidden">
//           <p className="font-semibold text-slate-900">Navigation</p>

//           <button
//             type="button"
//             onClick={() => setSidebarOpen(false)}
//             className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
//             aria-label="Close sidebar"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <nav className="space-y-1 px-4 py-5">
//           {navItems.map((item) => {
//             const Icon = item.icon;

//             const active =
//               item.href === "/admin/dashboard"
//                 ? pathname === item.href
//                 : pathname.startsWith(item.href);

//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 onClick={() => setSidebarOpen(false)}
//                 className={cn(
//                   "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
//                   active
//                     ? "bg-blue-600 text-white shadow-sm"
//                     : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
//                 )}
//               >
//                 <Icon size={18} />
//                 {item.label}
//               </Link>
//             );
//           })}
//         </nav>
//       </aside>

//       {sidebarOpen ? (
//         <button
//           type="button"
//           aria-label="Close sidebar overlay"
//           onClick={() => setSidebarOpen(false)}
//           className="fixed inset-0 z-20 bg-slate-900/40 lg:hidden"
//         />
//       ) : null}

//       <main className="pt-16 lg:pl-72">
//         <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// }