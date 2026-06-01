import React from "react";

const AutoWebPImage = ({ src, alt = "", ...props }) => {

  // Convert image path to webp
  const webpSrc = src?.replace(
    /\.(jpg|jpeg|png)$/i,
    ".webp"
  );

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img src={src} alt={alt} {...props} />
    </picture>
  );
};

export default AutoWebPImage;