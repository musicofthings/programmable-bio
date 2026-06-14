module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy(".nojekyll");

  eleventyConfig.addCollection("sitemap", (collectionApi) => {
    return collectionApi
      .getAll()
      .filter(
        (item) =>
          item.url &&
          item.url !== "/404.html/" &&
          !item.url.endsWith(".txt") &&
          !item.url.endsWith(".xml")
      );
  });

  return {
    dir: {
      input: "src",
      includes: "../_includes",
      data: "../_data",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    pathPrefix: "/",
  };
};
