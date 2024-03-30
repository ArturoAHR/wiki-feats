import { ReactNode } from "react";

import classNames from "classnames";
import "./State.css";

export type StateProps = {
  icon: ReactNode;
  message?: string;
  className?: string;
};

export const State = ({ icon, message, className }: StateProps) => {
  const stateClassName = classNames("state", className);

  return (
    <div className={stateClassName}>
      <div className="state-icon">{icon}</div>
      {message && <div className="state-message">{message}</div>}
    </div>
  );
};
