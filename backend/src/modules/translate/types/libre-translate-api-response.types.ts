export type GetAvailableLanguagesResponse = AvailableTranslation[];

export type GetTranslatedTextRequest = {
  q: string;
  source: string;
  target: string;
  format: "text" | "html";
};

export type GetTranslatedTextResponse = {
  translatedText: string;
};

export type AvailableTranslation = {
  code: string;
  name: string;
  targets: string[];
};
