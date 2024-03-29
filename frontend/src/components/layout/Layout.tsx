import { ReactNode } from "react";
import { Header } from "../Header/Header";
import "./Layout.css";

export type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <Header />
      {children}
    </div>
  );
};
