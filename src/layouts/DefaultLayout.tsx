import type { JSX } from "react";
import Header from "../app/components/header";
import Footer from "../app/components/footer";

interface DefaultLayoutProps {
  children: JSX.Element;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <div className="flex flex-col min-h-screen w-screen">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </div>
    </>
  );
};
export default DefaultLayout;
