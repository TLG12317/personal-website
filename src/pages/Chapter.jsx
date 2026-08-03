import { Link, useParams } from "react-router-dom";
import { getBook, getChapter, chapterSlug } from "../data/books";
import "./Books.css";

export default function Chapter() {
  const { slug, chapterId } = useParams();
  const book = getBook(slug);
  const chapter = getChapter(book, chapterId);

  if (!book || !chapter) {
    return (
      <div className="wa2">
        <div className="wa2-shell">
          <Link to="/books" className="wa2-back">
            ← Library
          </Link>
          <h1 className="wa2-title">Not found.</h1>
          <p className="wa2-subtitle">There's no chapter at this address.</p>
        </div>
      </div>
    );
  }

  const index = book.chapters.findIndex((c) => c.number === chapter.number);
  const prev = book.chapters[index - 1];
  const next = book.chapters[index + 1];

  return (
    <div className="wa2">
      <div className="wa2-shell">
        <p className="wa2-breadcrumb">
          <Link to="/books">Library</Link> ·{" "}
          <Link to={`/books/${book.slug}`}>{book.title}</Link>
        </p>

        <p className="wa2-eyebrow">
          Chapter {String(chapter.number).padStart(2, "0")}
        </p>
        <h1 className="wa2-title">{chapter.title}</h1>

        <div className="wa2-chapter-body">
          <p>This chapter hasn't been written into the site yet.</p>
        </div>

        <div className="wa2-chapter-nav">
          <div>
            {prev ? (
              <Link to={`/books/${book.slug}/${chapterSlug(prev.number)}`}>
                <span className="wa2-chapter-nav-label">← Previous</span>
                {prev.title}
              </Link>
            ) : (
              <span />
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            {next ? (
              <Link to={`/books/${book.slug}/${chapterSlug(next.number)}`}>
                <span className="wa2-chapter-nav-label">Next →</span>
                {next.title}
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
