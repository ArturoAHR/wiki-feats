import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { AntdConfigProvider } from "./AntdConfigProvider";
import { ErrorBoundary } from "./ErrorBoundary";

export type ProvidersProps = {
  children: ReactNode;
};

const queryClient = new QueryClient();

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AntdConfigProvider>{children}</AntdConfigProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};
