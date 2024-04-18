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

const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.setTemplateFormats(["md", "img", "png", "jpg", "svg", "gif"]);

  eleventyConfig.addPassthroughCopy("./src/css/");
  eleventyConfig.addWatchTarget("./src/css/");
  eleventyConfig.addJavaScriptFunction("image", imageShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);
  // Copy `img/favicon/` to `_site/`
  eleventyConfig.addPassthroughCopy({ "./src/favicon": "/" });
  eleventyConfig.addPlugin(fortawesomeFreeRegularPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromISO(dateObj).year;
  });

  eleventyConfig.addPassthroughCopy({
    "node_modules/reveal.js/dist": "reveal.js",
  });

  return {
    dir: {
      input: "src",
      output: "docs",
      includes: "_includes",
    },
  };
};
