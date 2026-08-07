import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../config";

import BookNavbar from "../components/Books/BookNavbar";

import "./Chapter.css";

export default function Chapter() {
    const { slug, chapterId } = useParams();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        fetch(`${API_URL}/books/${slug}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Book not found");
                }
                return res.json();
            })
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

            <div className="ch-page">

                <BookNavbar />

                <div className="ch-shell">

                    <h1 className="ch-title">Loading...</h1>

                </div>

            </div>

        );

    }

    const chapter = book?.chapters?.find(c => c.slug === chapterId);

    if (!book || !chapter) {

        return (

            <div className="ch-page">

                <BookNavbar />

                <div className="ch-shell">

                    {book ? (

                        <Link to={`/books/${book.slug}`} className="ch-back">
                            ← {book.title}
                        </Link>

                    ) : (

                        <Link to="/books" className="ch-back">
                            ← Library
                        </Link>

                    )}

                    <h1 className="ch-title">Not found.</h1>

                    <p className="ch-subtitle">
                        There's no chapter at this address.
                    </p>

                </div>

            </div>

        );

    }

    const index = book.chapters.findIndex(c => c.slug === chapter.slug);
    const prev = book.chapters[index - 1];
    const next = book.chapters[index + 1];

    return (

        <div className="ch-page">

            <BookNavbar />

            <Link
                to={`/books/${book.slug}`}
                className="ch-back"
            >
                ← {book.title}
            </Link>

            <div className="ch-shell">

                <p className="ch-breadcrumb">

                    <Link to="/books">Library</Link>

                    {" "}·{" "}

                    <Link to={`/books/${book.slug}`}>{book.title}</Link>

                </p>

                <p className="ch-eyebrow">

                    Chapter {String(chapter.number).padStart(2, "0")}

                </p>

                <h1 className="ch-title">

                    {chapter.title}

                </h1>

                <div className="ch-body">

                    {chapter.content && chapter.content.length > 0 ? (

                        chapter.content.map((block, i) => {
                            if (block.type === "paragraph") {
                                return <p key={i}>{block.value}</p>;
                            }
                            if (block.type === "image") {
                                return (
                                    <img
                                        key={i}
                                        src={block.src}
                                        alt={block.alt || ""}
                                        className="ch-image"
                                    />
                                );
                            }
                            return null;
                        })

                    ) : (

                        <p className="ch-placeholder">
                            This chapter hasn't been written into the site yet.
                        </p>

                    )}

                </div>

                <div className="ch-nav">

                    <div className="ch-nav-side">

                        {prev ? (

                            <Link
                                className="ch-nav-link"
                                to={`/books/${book.slug}/${prev.slug}`}
                            >

                                <span className="ch-nav-label">← Previous</span>

                                <span className="ch-nav-chapter-title">{prev.title}</span>

                            </Link>

                        ) : (

                            <span />

                        )}

                    </div>

                    <div className="ch-nav-side ch-nav-side--right">

                        {next ? (

                            <Link
                                className="ch-nav-link"
                                to={`/books/${book.slug}/${next.slug}`}
                            >

                                <span className="ch-nav-label">Next →</span>

                                <span className="ch-nav-chapter-title">{next.title}</span>

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
