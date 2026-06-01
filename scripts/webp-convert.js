const imagemin = require("imagemin");
const webp = require("imagemin-webp");

(async () => {

  await imagemin(
    ["src/**/*.{jpg,jpeg,png}"],
    {
      destination: "src",
      plugins: [
        webp({ quality: 80 })
      ]
    }
  );

  console.log("WebP images generated");

})();