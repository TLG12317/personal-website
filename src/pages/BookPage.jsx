import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBook } from "../api/books";

import BookNavbar from "../components/Books/BookNavbar";

import "./BookPage.css";

export default function BookPage() {
    const { slug } = useParams();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getBook(slug)
            .then((data) => {
                setBook(data);
                setLoading(false);
            })
            .catch(() => {
                setBook(null);
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return (
            <div className="bp-page">
                <BookNavbar />
                <div className="bp-not-found">
                    <h1>Loading...</h1>
                </div>
            </div>
        );
    }

    if (!book) {

        return (

            <div className="bp-page">

                <BookNavbar />

                <div className="bp-not-found">

                    <h1>Book not found.</h1>

                    <Link to="/books">
                        Return to Library
                    </Link>

                </div>

            </div>

        );

    }

    return (

        <div className="bp-page">

            <BookNavbar />

            {/* HERO */}

            <section
                className="bp-hero"
                style={{
                    backgroundImage: `
                    linear-gradient(
                        rgba(0,0,0,.45),
                        rgba(0,0,0,.88)
                    ),
                    url(${book.cover})
                `
                }}
            >

                <div className="bp-overlay">

                    <Link
                        className="bp-back"
                        to="/books"
                    >
                        ← Library
                    </Link>

                    <div className="bp-hero-content">

                        <p className="bp-status">

                            {book.status === "upcoming"
                                ? "Upcoming"
                                : "Ongoing"}

                        </p>

                        <h1>

                            {book.title}

                        </h1>

                        <p className="bp-quote">

                            "{book.subtitle}"

                        </p>

                        <div className="bp-meta">

                            <span>
                                {book.chapters.length} Chapters
                            </span>

                            <span>•</span>

                            <span>
                                {book.status}
                            </span>

                        </div>

                        <div className="bp-scroll">

                            Scroll

                        </div>

                    </div>

                </div>

            </section>

            {/* INFO */}

            <section className="bp-info">

                <div className="bp-description">

                    <h2>About</h2>

                    <p>

                        {book.description ??
                            "No description has been written for this story yet."}

                    </p>

                </div>

            </section>

            {/* CHAPTERS */}

            <section className="bp-chapters">

                <h2>Contents</h2>

                {book.chapters.length === 0 ? (

                    <div className="bp-empty">

                        The story has not yet begun.

                    </div>

                ) : (

                    book.chapters.map(chapter => (

                        <Link

                            key={chapter.number}

                            className="bp-chapter"
                            
                            to={`/books/${book.slug}/${chapter.slug}`}
                        >

                            <span className="bp-number">

                                {String(chapter.number).padStart(2, "0")}

                            </span>

                            <span className="bp-title">

                                {chapter.title}

                            </span>

                            <span className="bp-arrow">

                                →

                            </span>

                        </Link>

                    ))

                )}

            </section>

        </div>

    );

}