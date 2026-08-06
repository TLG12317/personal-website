import { useMemo, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import BookNavbar from "../components/Books/BookNavbar";
import { getBooks } from "../api/books";

import "./Books.css";

function Snowfall({ count = 40 }) {
  const flakes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      duration: 15 + Math.random() * 18,
      delay: -(Math.random() * 20),
      opacity: 0.08 + Math.random() * 0.25,
      drift: `${(Math.random() - 0.5) * 80}px`,
    }));
  }, [count]);



  return (
    <div className="books-snow" aria-hidden="true">
      {flakes.map((f) => (
        <span
          key={f.id}
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            "--drift": f.drift,
          }}
        />
      ))}
    </div>
  );
}

function BookCard({ book, index }) {
  return (
    <Link
      to={`/books/${book.slug}`}
      className="book-slide"
      style={{
        backgroundImage: `
            linear-gradient(
                to top,
                rgba(0,0,0,.88) 0%,
                rgba(0,0,0,.55) 45%,
                rgba(0,0,0,.20) 100%
            ),
            url(${book.cover || "/covers/default.jpg"})
        `,
      }}
    >
      <div className="book-content">

        <div className="book-number">
          {(index + 1).toString().padStart(2, "0")}
        </div>

        <div className="book-text">

        <p className="book-small">
            {book.chapter_count} Chapters •{" "}
            {book.story_status.charAt(0).toUpperCase() +
                book.story_status.slice(1)}
        </p>

          <h2>{book.title}</h2>

          <p className="book-subtitle">
            {book.subtitle}
          </p>

          <div className="book-bottom">

            <span className="book-read">
              Read Story →
            </span>

          </div>

        </div>

      </div>
    </Link>
  );
}

export default function Books() {
  const [books, setBooks] = useState([]);
  const [activeBook, setActiveBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const wrapperRef = useRef(null);

  const publishedBooks = books.filter(
    (book) => book.publish_status === "published"
);

  const scrollToBook = (slug) => {
    const wrapper = wrapperRef.current;
    const section = document.getElementById(`book-${slug}`);

    if (!wrapper || !section) return;

    wrapper.scrollTo({
        top: section.offsetTop,
        behavior: "smooth",
    });
  };  
  
  useEffect(() => {
      getBooks()
          .then((data) => setBooks(data))
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
  }, []);

  useEffect(() => {

        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const observer = new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        setActiveBook(
                            entry.target.id.replace("book-", "")
                        );

                    }

                });

            },

            {
                root: wrapper,
                threshold: 0.6,
            }

        );

        const sections = wrapper.querySelectorAll(".book-section");

        sections.forEach(section => observer.observe(section));

        return () => observer.disconnect();

    }, [publishedBooks]);


  if (loading) {
    return (
        <div className="books-page books-loading">
            <BookNavbar />
            <Snowfall />

            <div className="books-loading-text">
                Loading library...
            </div>
        </div>
    );
  } 

  return (
    <div className="books-page">

      <BookNavbar />

      <Snowfall />

      <section
          className="books-wrapper"
          ref={wrapperRef}
      >

        <div className="books-intro">

          <p className="books-eyebrow">
            LIBRARY
          </p>

          <h1>
            Books here
            <br />
          </h1>

          <p>
            Scroll to read
          </p>

        </div>

        {publishedBooks.length === 0 ? (

            <div className="books-empty">
                <h2>No books yet</h2>
                <p>Stories will appear here soon.</p>
            </div>

        ) : (

            publishedBooks.map((book, index) => (
          <section
            key={book.slug}
            id={`book-${book.slug}`}
            className="book-section"
          >
            <BookCard
              book={book}
              index={index}
            />
          </section>
            ))
      )}

      </section>

      {/* Floating Library Navigator */}
      <nav className="library-nav">

        <div className="library-title">
          Library
        </div>

        {publishedBooks.map((book, index) => (
        <button
            key={book.slug}
            onClick={() => scrollToBook(book.slug)}
            className={
                activeBook === book.slug
                    ? "library-link active"
                    : "library-link"
            }
        >
            <span className="library-number">
              {(index + 1).toString().padStart(2, "0")}
            </span>

            <span className="library-name">
              {book.title}
            </span>
          </button>
        ))}

      </nav>

    </div>
  );

  
}