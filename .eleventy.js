import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { fortawesomeFreeRegularPlugin } from "@vidhill/fortawesome-free-regular-11ty-shortcode";
import moment from "moment";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginRss from "@11ty/eleventy-plugin-rss";
import markdownIt from "markdown-it";

const siteUrl = "https://willwill.blog";
const md = markdownIt({ html: true });

function convertHtmlToAbsoluteUrls(content, base) {
  return (content || "").replace(
    /\s(href|src|srcset)=("([^"]*)"|'([^']*)')/gi,
    (fullMatch, attribute, quotedValue, doubleQuotedValue, singleQuotedValue) => {
      const quote = quotedValue[0];
      const value = doubleQuotedValue ?? singleQuotedValue ?? "";
      const nextValue =
        attribute === "srcset"
          ? value
              .split(",")
              .map((source) => convertSrcsetSourceToAbsoluteUrl(source, base))
              .join(", ")
          : convertUrlToAbsolute(value, base);

      return ` ${attribute}=${quote}${nextValue}${quote}`;
    }
  );
}

function convertSrcsetSourceToAbsoluteUrl(source, base) {
  const [url, ...descriptors] = source.trim().split(/\s+/);

  if (!url) {
    return source.trim();
  }

  return [convertUrlToAbsolute(url, base), ...descriptors].join(" ");
}

function convertUrlToAbsolute(url, base) {
  const trimmedUrl = url.trim();

  if (
    !trimmedUrl ||
    /^(?:[a-z]+:|#)/i.test(trimmedUrl) ||
    trimmedUrl.startsWith("//")
  ) {
    return trimmedUrl.startsWith("//")
      ? new URL(trimmedUrl, base).toString()
      : trimmedUrl;
  }

  try {
    return new URL(trimmedUrl, base).toString();
  } catch {
    return trimmedUrl;
  }
}

export default function (eleventyConfig) {
  eleventyConfig.setTemplateFormats(["md", "liquid"]);

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    // optional, output image formats
    formats: ["avif", "jpg"],
    // optional, output image widths
    widths: [1200],
    // optional, attributes assigned on <img> override these values.
    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
      sharpOptions: {
        animated: true,
      },
    },
  });

  eleventyConfig.addWatchTarget("./src/css/");

  eleventyConfig.addPassthroughCopy("./src/css/");
  eleventyConfig.addPassthroughCopy({ "./src/assets/favicon": "/" });
  eleventyConfig.addPassthroughCopy({ "./src/assets/img": "/assets/img" });

  eleventyConfig.addPlugin(fortawesomeFreeRegularPlugin);

  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addFilter("absoluteUrl", (url, base) => new URL(url, base).toString());
  eleventyConfig.addFilter("dateToRfc822", (date) => new Date(date).toUTCString());
  eleventyConfig.addFilter(
    "getNewestCollectionItemDate",
    (collection) =>
      collection?.length
        ? new Date(Math.max(...collection.map((i) => i.date)))
        : new Date()
  );

  eleventyConfig.addFilter("dateFormat", async function (date) {
    return moment(date).format("MMMM Do, YYYY");
  });

  eleventyConfig.addFilter("secondFormat", async function (seconds) {
    return moment.utc(parseInt(seconds) * 1000).format("m:ss");
  });

  eleventyConfig.addFilter("jsonify", function (value) {
    return JSON.stringify(value, null, 2);
  });

  eleventyConfig.addFilter("markdownify", function (content) {
    return md.render(content || "");
  });

  eleventyConfig.addFilter("rssHtmlToAbsoluteUrls", function (content) {
    return convertHtmlToAbsoluteUrls(content || "", siteUrl);
  });

  eleventyConfig.addPassthroughCopy({
    "node_modules/reveal.js/dist": "reveal.js",
  });

  eleventyConfig.addCollection("mostRecent", function (collectionApi) {
    const recentlyFiles = collectionApi.getFilteredByGlob(
      "./src/recently/*.md"
    );

    const mostRecent = recentlyFiles.reduce((latest, current) => {
      const currentDate = new Date(current.data.date);
      const latestDate = latest ? new Date(latest.data.date) : new Date(0);
      return currentDate > latestDate ? current : latest;
    }, null);

    return mostRecent;
  });

  eleventyConfig.addCollection("rss", function (collectionApi) {
    return [
      ...collectionApi.getFilteredByGlob("./src/posts/*.md"),
      ...collectionApi.getFilteredByGlob("./src/recently/*.md"),
    ]
      .filter(
        (item) =>
          !(item.data.draft && process.env.ELEVENTY_RUN_MODE === "build")
      )
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.setServerOptions({
    showAllHosts: true,
    showVersion: true,
  });

  eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
    if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
      return false;
    }
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
