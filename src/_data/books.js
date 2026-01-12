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

      // Extract user data from frontmatter
      const bookData = {
        isbn: frontmatter.isbn,
        status: frontmatter.status,
        date: frontmatter.date,
        end_date: frontmatter["end-date"] || frontmatter.end_date,
        rating: frontmatter.rating,
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

    // Separate by status
    const books_read = books.filter((b) => b.status === "read");
    const books_reading = books.filter((b) => b.status === "reading");

    // Sort and index all books
    const books_all = sortAndIndexBooks(books);

    console.log(
      `Processed ${books_all.length} books (${books_read.length} read, ${books_reading.length} reading)`
    );

    return {
      books_read,
      books_reading,
      books_all,
    };
  } catch (e) {
    console.log("Failed to process books:", e);
    return {
      books_read: [],
      books_reading: [],
      books_all: [],
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
 * Sort books by date and assign sequential IDs
 */
function sortAndIndexBooks(books) {
  // Sort by end_date (most recent first)
  // Books without dates sort to the end
  const sorted = books.sort((a, b) => {
    const dateA = a.end_date;
    const dateB = b.end_date;

    // Both have dates, sort chronologically
    if (dateA && dateB) {
      return new Date(dateB) - new Date(dateA);
    }

    // A has no date, it should come last
    if (!dateA) return 1;

    // B has no date, it should come last
    if (!dateB) return -1;

    return 0;
  });

  // Assign sequential IDs
  sorted.forEach((book, index) => {
    book.book_id = index + 1;
  });

  return sorted;
}
