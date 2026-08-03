// Central data source for every book on the site.
// No React here on purpose — this file is just data.
// Add a new object to this array to publish a new book.

export const books = [
  {
    slug: "winter-memories",
    title: "No books so far sucker",
    subtitle: "SO SAD huehuehuehuehue",
    cover: "../assets/frankenthal.png",
    status: "dead",
    chapters: [
      { number: 1, title: "THERE IS NO BOOK" },
      { number: 2, title: "THERE IS NO BOOK 2: ELECTRIC BOOGALOO" },
    ],
  },
];

// Turns a chapter number into the slug used in its URL: 1 -> "chapter-1"
export function chapterSlug(number) {
  return `chapter-${number}`;
}

export function getBook(slug) {
  return books.find((book) => book.slug === slug);
}

export function getChapter(book, chapterId) {
  if (!book) return undefined;
  return book.chapters.find((c) => chapterSlug(c.number) === chapterId);
}
