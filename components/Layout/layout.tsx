import { JSX, ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {children}
    </main>
  );
}