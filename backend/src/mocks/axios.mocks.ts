import { AxiosResponse } from "axios";

export const createAxiosResponseMock = <T>(
  data: T,
): Partial<AxiosResponse<T>> => {
  return {
    data,
    status: 200,
  };
};
