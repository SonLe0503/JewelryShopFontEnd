import type { JSX } from "react";
import Sidebar from "../app/components/sidebar";

interface DefaultLayoutProps {
  children: JSX.Element;
}

const Adminlayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <div className="flex h-screen w-screen">
          <Sidebar/>
        <main className="flex-1 w-full overflow-auto">{children}</main>
      </div>
    </>
  );
};
export default Adminlayout;
