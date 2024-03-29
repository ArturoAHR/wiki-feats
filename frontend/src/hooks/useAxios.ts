import Axios from "axios";
import { useMemo } from "react";
import { AXIOS_CONFIG } from "../config/axios";

export const useAxios = () => {
  const axios = useMemo(() => {
    return Axios.create({
      ...AXIOS_CONFIG,
    });
  }, []);

  return { axios };
};
