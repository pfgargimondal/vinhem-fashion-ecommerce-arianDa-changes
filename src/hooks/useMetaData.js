import { useEffect } from "react";

export const useMetaData = ({ meta_title, meta_description, meta_keyword }) => {
  useEffect(() => {
    if (meta_title) {
      document.title = meta_title;
    }

    if (meta_description) {
      let descTag = document.querySelector("meta[name='description']");

      if (!descTag) {
        descTag = document.createElement("meta");
        descTag.setAttribute("name", "description");
        document.head.appendChild(descTag);
      }

      descTag.setAttribute("content", meta_description);
    }

    if (meta_keyword) {
      let keywordTag = document.querySelector("meta[name='keywords']");

      if (!keywordTag) {
        keywordTag = document.createElement("meta");
        keywordTag.setAttribute("name", "keywords");
        document.head.appendChild(keywordTag);
      }

      let cleanedKeywords = meta_keyword;

      try {
        cleanedKeywords = cleanedKeywords.replace(/&quot;/g, '"');

        const parsed = JSON.parse(cleanedKeywords);

        cleanedKeywords = parsed.map((word) => word.trim()).join(", ");
      } catch (err) {
        console.log("Keyword parsing failed:", err);
      }

      keywordTag.setAttribute("content", cleanedKeywords);
    }
  }, [meta_title, meta_description, meta_keyword]);

  return null;
};