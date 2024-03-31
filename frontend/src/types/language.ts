import { BaseEntity } from "./entity";

export type Language = BaseEntity & {
  code: string;
  name: string;
};

export type GetAvailableFeedLanguagesResponse = Language[];
