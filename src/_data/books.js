import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import EleventyFetch from "@11ty/eleventy-fetch/eleventy-fetch.js";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function () {
  console.log("Fetching book data from markdown files");

  try {
    // Read all markdown files from src/books directory
    const booksDir = path.join(__dirname, "../books");
    const bookFiles = fs
      .readdirSync(booksDir)
      .filter((file) => file.endsWith(".md"));

    console.log(`Found ${bookFiles.length} book files`);

    const books = [];

    // Process each book file
    for (const filename of bookFiles) {
      const filepath = path.join(booksDir, filename);
      const fileContent = fs.readFileSync(filepath, "utf8");

      // Parse frontmatter
      const { data: frontmatter, content } = matter(fileContent);

      console.log(`Processing: ${frontmatter.title || filename}`);

      // Skip draft books during production builds
      if (frontmatter.draft && process.env.ELEVENTY_RUN_MODE === "build") {
        console.log(`Skipping draft: ${frontmatter.title || filename}`);
        continue;
      }

      // Extract user data from frontmatter
      const bookData = {
        isbn: frontmatter.isbn,
        status: frontmatter.status,
        date: frontmatter.date,
        end_date: frontmatter["end-date"] || frontmatter.end_date,
        rating: frontmatter.rating,
        draft: frontmatter.draft || false,
        notes: content.trim(),
        filename: filename,
        // Store frontmatter metadata as fallback
        frontmatter_title: frontmatter.title,
        frontmatter_author: frontmatter.author,
      };

      // Only fetch from API if ISBN exists
      if (bookData.isbn) {
        const apiData = await fetchBookFromOpenLibrary(bookData.isbn);
        if (apiData && !apiData.api_error) {
          // Merge API data (source of truth for metadata) with user data
          Object.assign(bookData, apiData);
        } else {
          // API failed, use frontmatter as fallback
          bookData.title = bookData.frontmatter_title;
          bookData.authors = bookData.frontmatter_author
            ? [bookData.frontmatter_author]
            : [];
          bookData.api_error = apiData ? apiData.api_error : true;
          bookData.api_error_message = apiData
            ? apiData.api_error_message
            : "Failed to fetch from API";
        }
      } else {
        console.warn(`No ISBN found for ${filename}`);
        bookData.title = bookData.frontmatter_title;
        bookData.authors = bookData.frontmatter_author
          ? [bookData.frontmatter_author]
          : [];
        bookData.api_error = true;
        bookData.api_error_message = "No ISBN provided";
      }

      books.push(bookData);
    }

    // Only include read books
    const books_read = books.filter((b) => b.status === "read");

    // Count books read this year
    const currentYear = new Date().getFullYear();
    const books_read_this_year = books_read.filter((b) => {
      if (!b.end_date) return false;
      return new Date(b.end_date).getFullYear() === currentYear;
    }).length;

    // Sort and index read books
    const books_all = sortAndIndexBooks(books_read);

    console.log(
      `Processed ${books_all.length} books (${books_read_this_year} this year)`
    );

    return {
      books_read,
      books_all,
      books_read_this_year,
    };
  } catch (e) {
    console.log("Failed to process books:", e);
    return {
      books_read: [],
      books_all: [],
      books_read_this_year: 0,
    };
  }
}

/**
 * Fetch book metadata from Open Library API
 */
async function fetchBookFromOpenLibrary(isbn) {
  try {
    // Clean ISBN (remove hyphens)
    const cleanIsbn = isbn.replace(/-/g, "");

    console.log(`Fetching Open Library data for ISBN: ${cleanIsbn}`);

    // Fetch book data from Open Library
    const bookData = await EleventyFetch(
      `https://openlibrary.org/isbn/${cleanIsbn}.json`,
      {
        duration: "*", // Cache permanently
        type: "json",
      }
    );

    // Extract and clean up book metadata
    const result = {
      title: bookData.title,
      isbn_clean: cleanIsbn,
      cover_url: `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`,
      publication_year: bookData.publish_date,
      publisher: Array.isArray(bookData.publishers)
        ? bookData.publishers[0]
        : bookData.publishers,
      pages: bookData.number_of_pages,
      api_error: false,
    };

    // Handle description (can be string or object)
    if (bookData.description) {
      let desc =
        typeof bookData.description === "string"
          ? bookData.description
          : bookData.description.value;
      // Remove surrounding quotes and quote marks before attribution
      desc = desc.replace(/^["']|["']--/g, "").replace(/["']$/g, "");
      result.description = desc;
    }

    // Fetch author names (requires separate API calls)
    if (bookData.authors && bookData.authors.length > 0) {
      const authorNames = await fetchAuthorNames(bookData.authors);
      // Remove duplicates
      result.authors = [...new Set(authorNames)];
    }

    // Extract all genres/subjects (no filtering)
    if (bookData.subjects && bookData.subjects.length > 0) {
      result.genres = bookData.subjects;
    }

    return result;
  } catch (e) {
    console.log(`Failed to fetch book data for ISBN ${isbn}:`, e.message);
    return {
      api_error: true,
      api_error_message: `Failed to fetch from Open Library: ${e.message}`,
    };
  }
}

/**
 * Fetch author names from Open Library API
 */
async function fetchAuthorNames(authorKeys) {
  const authors = [];

  for (const author of authorKeys) {
    try {
      const authorKey = author.key;
      const authorData = await EleventyFetch(
        `https://openlibrary.org${authorKey}.json`,
        {
          duration: "*", // Cache permanently
          type: "json",
        }
      );

      if (authorData.name) {
        authors.push(authorData.name);
      }
    } catch (e) {
      console.log(`Failed to fetch author ${author.key}:`, e.message);
    }
  }

  return authors;
}

/**
 * Sort books by metadata:
 * 1. Read with end_date (sorted by end date, most recent first)
 * 2. Undated but rated
 * 3. Undated and unrated (oldest/least tracked)
 */
function sortAndIndexBooks(books) {
  const sorted = books.sort((a, b) => {
    const getPriority = (book) => {
      if (book.end_date) return 0;
      if (book.rating) return 1;
      return 2;
    };

    const priorityA = getPriority(a);
    const priorityB = getPriority(b);

    if (priorityA !== priorityB) return priorityA - priorityB;

    // Same group: sort by end date (most recent first)
    if (priorityA === 0) {
      return new Date(b.end_date) - new Date(a.end_date);
    }

    return 0;
  });

  // Assign sequential IDs
  sorted.forEach((book, index) => {
    book.book_id = index + 1;
  });

  return sorted;
}
