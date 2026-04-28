import Link from "next/link";

type NavigationItem = {
  label: string;
  href: string;
  key: string;
};

type NavigationProps = {
  props?: {
    activePage?: string;
    items?: NavigationItem[];
    showLogin?: boolean;
  };
};

const defaultNavigationItems: NavigationItem[] = [
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

export default function Navigation({ props }: NavigationProps) {
  const activePage = props?.activePage || "home";
  const items = props?.items || defaultNavigationItems;
  const showLogin = props?.showLogin ?? true;

  return (
    <div className="hidden items-center gap-8 text-sm font-semibold text-slate-700 lg:flex">
      {items.map((item) => (
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

      {showLogin && (
        <Link
          href="/admin/login"
          className={`transition hover:text-blue-600 ${
            activePage === "login" ? "text-blue-600" : "text-slate-700"
          }`}
        >
          Login
        </Link>
      )}
    </div>
  );
}