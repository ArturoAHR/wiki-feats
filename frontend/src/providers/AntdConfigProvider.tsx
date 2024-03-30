import { ConfigProvider } from "antd";
import { ReactNode } from "react";

export type AntdConfigProviderProps = {
  children: ReactNode;
};

export const AntdConfigProvider = ({ children }: AntdConfigProviderProps) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#8d6e63",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
