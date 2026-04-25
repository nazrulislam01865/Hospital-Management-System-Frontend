import SiteLayout from "@/components/Layout/SiteLayout";
import type { ReactNode } from "react";


type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return <SiteLayout>{children}</SiteLayout>;
}