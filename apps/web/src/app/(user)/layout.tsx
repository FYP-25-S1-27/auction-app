import Footer from "@/libs/components/Footer";
import { Fragment } from "react";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Fragment>
      {children}
      <Footer />
    </Fragment>
  );
}
