// Central data source for every book on the site.
// No React here on purpose — this file is just data.
// Add a new object to this array to publish a new book.

export const books = [
  {
    slug: "winter-memories",
    title: "Winter Memories",
    subtitle: "A story beneath the snow.",
    cover: "../assets/frankenthal.png",
    status: "ongoing",
    chapters: [
      { number: 1, title: "The First Snow" },
      { number: 2, title: "Library" },
    ],
  },
  {
    slug: "white-sky",
    title: "White Sky",
    subtitle: "Coming soon.",
    status: "upcoming",
    chapters: [],
  },
  {
    slug: "another-book",
    title: "Another Book",
    subtitle: "A quiet place to begin.",
    status: "ongoing",
    chapters: [
      { number: 1, title: "Prologue" },
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
