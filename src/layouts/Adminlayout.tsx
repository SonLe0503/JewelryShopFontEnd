import type { JSX } from "react";
import Sidebar from "../app/components/sidebar";

interface DefaultLayoutProps {
  children: JSX.Element;
}

const Adminlayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <div className="flex min-h-screen w-screen">
        <Sidebar />
        <main className="flex-1 w-full">{children}</main>
      </div>
    </>
  );
};
export default Adminlayout;
