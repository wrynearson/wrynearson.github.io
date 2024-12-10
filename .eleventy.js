const {
  fortawesomeFreeRegularPlugin,
} = require("@vidhill/fortawesome-free-regular-11ty-shortcode");

const Image = require("@11ty/eleventy-img");

const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

async function imageShortcode(src, alt, sizes) {
  let metadata = await Image(src, {
    widths: [600, 1100],
    formats: ["webp", "svg"],
    outputDir: "./docs/img/",
    /* change the quality of the webp and jpeg images */
    sharpWebpOptions: {
      quality: 85,
      smartSubsample: true,
    },
    sharpJpegOptions: {
      quality: 85,
      smartSubsample: true,
    },
    /* allows for animated GIFs, from https://www.11ty.dev/docs/plugins/image/#output-animated-gif-or-webp-with-sharp */
    sharpOptions: {
      animated: true,
    },
    /* use to rename output files 
      filenameFormat: function (id, src, width, format, options) {
        const extension = path.extname(src);
        const name = path.basename(src, extension);
    
        return `${name}-${width}w.${format}`;
      }
      */
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes, {
    whitespaceMode: "inline",
  });
}

const moment = require("moment");

module.exports = function (eleventyConfig) {
  eleventyConfig.setTemplateFormats([
    "md",
    "img",
    "png",
    "jpg",
    "svg",
    "gif",
    "liquid",
  ]);

  eleventyConfig.addPassthroughCopy("./src/css/");
  eleventyConfig.addWatchTarget("./src/css/");
  eleventyConfig.addJavaScriptFunction("image", imageShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);
  // Copy `img/favicon/` to `_site/`
  eleventyConfig.addPassthroughCopy({ "./src/favicon": "/" });
  eleventyConfig.addPlugin(fortawesomeFreeRegularPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addFilter("dateFormat", async function (date) {
    return moment(date).format("MMMM Do, YYYY");
  });

  eleventyConfig.addFilter("secondFormat", async function (seconds) {
    return moment.utc(parseInt(seconds) * 1000).format("m:ss");
  });

  eleventyConfig.addFilter("jsonify", function (value) {
    return JSON.stringify(value, null, 2); // Indent with 2 spaces for readability
  });

  eleventyConfig.addPassthroughCopy({
    "node_modules/reveal.js/dist": "reveal.js",
  });

  // This gets the most recent "recently" post.
  eleventyConfig.addCollection("mostRecent", function (collectionApi) {
    // Filter .md files in the "recently" folder
    const recentlyFiles = collectionApi.getFilteredByGlob(
      "./src/recently/*.md"
    );

    // Find the most recent file
    const mostRecent = recentlyFiles.reduce((latest, current) => {
      const currentDate = new Date(current.data.date); // Parse date from front matter
      const latestDate = latest ? new Date(latest.data.date) : new Date(0); // Default to epoch
      return currentDate > latestDate ? current : latest;
    }, null);

    return mostRecent; // Return the most recent item
  });

  eleventyConfig.setServerOptions({
    // Show local network IP addresses for device testing
    showAllHosts: true,

    // Show the dev server version number on the command line
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
};
