import { Component, ReactNode } from "react";
import { Error } from "../pages/error/Error";

interface Props {
  children: ReactNode;
}

interface State {
  error: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      error: false,
    };
  }

  public static getDerivedStateFromError(): State {
    return { error: true };
  }

  public render() {
    const { error: error } = this.state;

    const { children } = this.props;

    return error ? <Error /> : children;
  }
}
