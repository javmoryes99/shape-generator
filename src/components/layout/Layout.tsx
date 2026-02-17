import type { ReactNode } from "react";
import Header from "./Header";

type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-1 w-full p-4 md:p-8 lg:p-16">{children}</main>
    </div>
  );
}

export default Layout;
