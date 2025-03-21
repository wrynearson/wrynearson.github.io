import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { fortawesomeFreeRegularPlugin } from "@vidhill/fortawesome-free-regular-11ty-shortcode";
import moment from "moment";

export default function (eleventyConfig) {
  eleventyConfig.setTemplateFormats(["md", "liquid"]);

  eleventyConfig.addPlugin(eleventyImageTransformPlugin);

  eleventyConfig.addPassthroughCopy("./src/css/");
  eleventyConfig.addWatchTarget("./src/css/");

  eleventyConfig.addPassthroughCopy({ "./src/favicon": "/" });
  eleventyConfig.addPlugin(fortawesomeFreeRegularPlugin);

  eleventyConfig.addFilter("dateFormat", async function (date) {
    return moment(date).format("MMMM Do, YYYY");
  });

  eleventyConfig.addFilter("secondFormat", async function (seconds) {
    return moment.utc(parseInt(seconds) * 1000).format("m:ss");
  });

  eleventyConfig.addFilter("jsonify", function (value) {
    return JSON.stringify(value, null, 2);
  });

  eleventyConfig.addPassthroughCopy({
    "node_modules/reveal.js/dist": "reveal.js",
  });

  eleventyConfig.addCollection("mostRecent", function (collectionApi) {
    const recentlyFiles = collectionApi.getFilteredByGlob(
      "./src/recently/*.md",
    );

    const mostRecent = recentlyFiles.reduce((latest, current) => {
      const currentDate = new Date(current.data.date);
      const latestDate = latest ? new Date(latest.data.date) : new Date(0);
      return currentDate > latestDate ? current : latest;
    }, null);

    return mostRecent;
  });

  eleventyConfig.setServerOptions({
    showAllHosts: true,
    showVersion: true,
  });

  return {
    dir: {
      input: "src",
      output: "docs",
      includes: "_includes",
      data: "_data",
    },
  };
}
