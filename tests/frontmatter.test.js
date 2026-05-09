import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { type } from "arktype";
import eleventyConfig from "../.eleventy.js";

// __dirname equivalent for ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, "..", "src");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns an array of absolute paths to all .md files in a directory (one
 * level deep — no recursion needed since each content type is flat).
 */
function getMarkdownFiles(relativeDir) {
  const dir = path.join(SRC_DIR, relativeDir);
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(dir, f));
}

/**
 * Reads a markdown file and returns its parsed frontmatter data object.
 * gray-matter automatically converts bare YAML dates into JS Date objects.
 */
function parseFrontmatter(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  return matter(raw).data;
}

/**
 * Validates parsed frontmatter against an ArkType schema.
 * If validation fails, calls assert.fail with the file name and ArkType's
 * human-readable error summary so the test output pinpoints the problem.
 */
function validateFile(filePath, schema) {
  const data = parseFrontmatter(filePath);
  const result = schema(data);
  if (result instanceof type.errors) {
    assert.fail(`${path.basename(filePath)}:\n${result.summary}`);
  }
}

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

// Posts — draft posts can omit date/description; published posts cannot.
const PostBase = type({
  title: "string > 0",
  "date?": "Date",
  "description?": "string > 0",
  draft: "boolean",
  "tags?": "string[]",
  "author?": "string",
});

const PostSchema = PostBase.narrow((data, ctx) => {
  if (!data.draft && (!data.date || !data.description)) {
    return ctx.reject({
      expected: "date and description when draft is false",
    });
  }
  return true;
});

// Pages (project portfolio entries)
const PageSchema = type({
  title: "string > 0",
  date: "Date",
  "end-date?": "Date | '' | null",
  "url?": "string",
  description: "string > 0",
  type: "'personal' | 'professional' | 'academic'",
  "client?": "string",
  "role?": "string",
  draft: "boolean",
  "problem?": "string",
  "outcome?": "string",
  "repo?": "string",
});

// Books
const BookSchema = type({
  isbn: "string | number",
  "title?": "string",
  "author?": "string",
  "status?": "'to-read' | 'reading' | 'read' | 'abandoned'",
  "date?": "Date",
  "end-date?": "Date",
  "rating?": "1 <= number.integer <= 10",
  "draft?": "boolean",
});

// Recently updates
const RecentlySchema = type({
  title: "string > 0",
  date: "Date",
  draft: "boolean",
  description: "string > 0",
  "tags?": "string[]",
});

// Presentations (Reveal.js slide decks)
const PresentationSchema = type({
  title: "string > 0",
  draft: "boolean",
  "date?": "Date",
  "description?": "string",
  "layout?": "string",
});

// ---------------------------------------------------------------------------
// Tests — one describe() per content type, one it() per .md file
// ---------------------------------------------------------------------------

describe("Posts frontmatter", () => {
  for (const file of getMarkdownFiles("posts")) {
    it(path.basename(file), () => {
      validateFile(file, PostSchema);
    });
  }
});

describe("Pages frontmatter", () => {
  for (const file of getMarkdownFiles("pages")) {
    it(path.basename(file), () => {
      validateFile(file, PageSchema);
    });
  }
});

describe("Books frontmatter", () => {
  for (const file of getMarkdownFiles("books")) {
    it(path.basename(file), () => {
      validateFile(file, BookSchema);
    });
  }
});

describe("Recently frontmatter", () => {
  for (const file of getMarkdownFiles("recently")) {
    it(path.basename(file), () => {
      validateFile(file, RecentlySchema);
    });
  }
});

describe("Presentations frontmatter", () => {
  for (const file of getMarkdownFiles("presentations")) {
    it(path.basename(file), () => {
      validateFile(file, PresentationSchema);
    });
  }
});

describe("RSS collection", () => {
  it("includes posts/pages/recently, excludes drafts on build, and sorts by date desc", () => {
    const previousRunMode = process.env.ELEVENTY_RUN_MODE;
    process.env.ELEVENTY_RUN_MODE = "build";

    const collectionCallbacks = {};
    eleventyConfig({
      setTemplateFormats() {},
      addPlugin() {},
      addWatchTarget() {},
      addPassthroughCopy() {},
      addFilter() {},
      addAsyncFilter() {},
      addCollection(name, callback) {
        collectionCallbacks[name] = callback;
      },
      setServerOptions() {},
      addPreprocessor() {},
    });

    const rssItems = collectionCallbacks.rss({
      getFilteredByGlob(globPattern) {
        if (globPattern === "./src/posts/*.md") {
          return [{ date: new Date("2026-01-01"), data: { draft: false } }];
        }
        if (globPattern === "./src/recently/*.md") {
          return [{ date: new Date("2026-02-01"), data: { draft: true } }];
        }
        return [];
      },
    });

    try {
      assert.deepEqual(
        rssItems.map((item) => item.date.toISOString().slice(0, 10)),
        ["2026-01-01"]
      );
    } finally {
      process.env.ELEVENTY_RUN_MODE = previousRunMode;
    }
  });

  it("registers feed compatibility helpers for original assets and absolute URLs", async () => {
    const passthroughCopies = [];
    const asyncFilters = {};

    eleventyConfig({
      setTemplateFormats() {},
      addPlugin() {},
      addWatchTarget() {},
      addPassthroughCopy(copy) {
        passthroughCopies.push(copy);
      },
      addFilter() {},
      addAsyncFilter(name, callback) {
        asyncFilters[name] = callback;
      },
      addCollection() {},
      setServerOptions() {},
      addPreprocessor() {},
    });

    assert.ok(
      passthroughCopies.some(
        (copy) => copy?.["./src/assets/favicon"] === "/"
      )
    );
    assert.ok(
      passthroughCopies.some(
        (copy) => copy?.["./src/assets/img"] === "/assets/img"
      )
    );

    const html = await asyncFilters.rssHtmlToAbsoluteUrls(
      '<img src="../assets/img/example.jpg"><a href="/feed.xml">Feed</a>'
    );

    assert.match(html, /https:\/\/willwill\.blog\/assets\/img\/example\.jpg/);
    assert.match(html, /https:\/\/willwill\.blog\/feed\.xml/);
  });
});
