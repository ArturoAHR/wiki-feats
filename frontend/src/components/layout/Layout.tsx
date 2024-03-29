import { ReactNode } from "react";
import "./Layout.css";

export type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return <div className="layout">{children}</div>;
};
