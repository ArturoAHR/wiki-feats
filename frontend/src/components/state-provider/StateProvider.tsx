import { CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import classNames from "classnames";
import { ReactNode } from "react";
import { State } from "./state/State";

export type StateProviderProps = {
  children: ReactNode;
  isLoading: boolean;
  isError: boolean;
  className?: string;
};

export const StateProvider = ({
  children,
  isLoading,
  isError,
  className,
}: StateProviderProps) => {
  const stateClassName = classNames("state-provider", className, {
    "state-provider-loading": isLoading,
    "state-provider-error": isError,
  });

  if (isError)
    return (
      <State
        className={stateClassName}
        icon={<CloseCircleOutlined data-testid="error-state-icon" />}
        message="Error"
      />
    );

  if (isLoading)
    return (
      <State icon={<LoadingOutlined data-testid="loading-state-icon" />} />
    );

  return <div className={stateClassName}>{children}</div>;
};
