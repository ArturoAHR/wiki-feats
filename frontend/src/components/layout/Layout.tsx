import { ReactNode } from "react";
import { Header } from "../header/Header";
import "./Layout.css";

export type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <Header />
      <div className="content-container">
        <div className="content">{children}</div>
      </div>
    </div>
  );
};
