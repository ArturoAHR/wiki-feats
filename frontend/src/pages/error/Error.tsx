import { CloseCircleOutlined } from "@ant-design/icons";
import { State } from "../../components/state-provider/state/State";

export const Error = () => {
  return (
    <State
      icon={<CloseCircleOutlined />}
      message="Oops! Something went wrong."
    />
  );
};
