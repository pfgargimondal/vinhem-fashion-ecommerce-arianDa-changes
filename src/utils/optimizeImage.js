// src/utils/optimizeImage.js

export const optimizeImage = (url) => {

  if (!url) {
    return "/images/no-preview.jpg";
  }

  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  // LOCAL STATIC IMAGES
  if (
    isLocalhost &&
    (
      url.startsWith("/images") ||
      url.startsWith("images")
    )
  ) {

    return url.replace(
      /\.(jpg|jpeg|png)$/i,
      ".webp"
    );
  }

  // SERVER / DYNAMIC IMAGES
  if (url.startsWith("http")) {

    return `https://res.cloudinary.com/dbtjxvwfo/image/fetch/f_webp,q_80/${encodeURIComponent(url)}`;
  }

  // LIVE PUBLIC IMAGES
  const fullURL = `${window.location.origin}${url}`;

  return `https://res.cloudinary.com/dbtjxvwfo/image/fetch/f_webp,q_80/${encodeURIComponent(fullURL)}`;
};