export type WikipediaApiResponse = {
  tfa: WikipediaApiResponseArticle;
  mostread?: {
    date: string;
    articles: WikipediaApiResponseArticle[];
  };
  image?: WikipediaApiResponseFeaturedImage;
  news?: WikipediaApiResponseNews[];
  onthisday?: WikipediaApiResponseOnThisDay[];
};

export type WikipediaApiResponseNews = {
  story: string;
  links: WikipediaApiResponseArticle[];
};

export type WikipediaApiResponseOnThisDay = {
  text: string;
  pages: WikipediaApiResponseArticle[];
  year: number;
};

export type WikipediaApiResponseArticle = {
  type: "standard" | "disambiguation" | "no-extract" | "mainpage";
  titles: {
    canonical: string;
    normalized: string;
    display: string;
  };
  namespace: {
    id: number;
    text: string;
  };
  wikibase_item: string;
  pageid: number;
  thumbnail: WikipediaApiResponseImage;
  originalimage: WikipediaApiResponseImage;
  lang: string;
  dir: string;
  revision: string;
  tid: string;
  timestamp: string;
  description: string;
  description_source: string;
  extract: string;
  extract_html: string;
  content_urls: {
    desktop: {
      page: string;
    };
    mobile: {
      page: string;
    };
  };
};

export type WikipediaApiResponseFeaturedImage = {
  title: string;
  thumbnail: WikipediaApiResponseImage;
  image: WikipediaApiResponseImage;
  file_page: string;
  artist: {
    html: string;
    text: string;
    name: string;
    user_page: string;
  };
  credit: {
    html: string;
    text: string;
  };
  license: {
    type: string;
    code: string;
    url: string;
  };
  description: {
    html: string;
    text: string;
    lang: string;
  };
  wb_entity_id: string;
  structured: {
    captions: {
      LANGUAGE_CODE?: string;
    };
  };
};

export type WikipediaApiResponseImage = {
  source: string;
  width: number;
  height: number;
};
