import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { AntdConfigProvider } from "./AntdConfigProvider";

export type ProvidersProps = {
  children: ReactNode;
};

const queryClient = new QueryClient();

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AntdConfigProvider>{children}</AntdConfigProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};
