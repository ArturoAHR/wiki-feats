import { QuestionCircleOutlined } from "@ant-design/icons";
import { State } from "../../components/state-provider/state/State";

export const NotFound = () => {
  return <State icon={<QuestionCircleOutlined />} message="Page not found" />;
};
