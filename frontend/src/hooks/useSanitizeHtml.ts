import sanitizeHtml from "sanitize-html";

export const useSanitizeHtml = () => {
  const defaultOptions = {
    allowedTags: ["b", "i", "em", "strong"],
    allowedAttributes: {
      a: ["href"],
    },
  };

  const sanitize = (dirty: string, options?: sanitizeHtml.IOptions) => ({
    __html: sanitizeHtml(dirty, { ...defaultOptions, ...options }),
  });

  return { sanitize };
};
