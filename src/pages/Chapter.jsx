import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getChapter } from "../api/books";

import BookNavbar from "../components/Books/BookNavbar";

import "./Chapter.css";

export default function Chapter() {
    const { slug, chapterId } = useParams();

    const [chapterData, setChapterData] = useState(null);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
      setLoading(true);

      getChapter(slug, chapterId)
          .then((data) => {
              setChapterData(data);
              setLoading(false);
          })
          .catch(() => {
              setChapterData(null);
              setLoading(false);
          });
  }, [slug, chapterId]);

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

    if (!chapterData) {
        return (
            <div className="ch-page">

                <BookNavbar />

                <div className="ch-shell">

                    <Link to="/books" className="ch-back">
                        ← Library
                    </Link>

                    <h1 className="ch-title">Not found.</h1>

                    <p className="ch-subtitle">
                        There's no chapter at this address.
                    </p>

                </div>

            </div>
        );
    }

    const {
        chapter,
        book,
        previous,
        next
    } = chapterData;

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

                {chapter.cover && (
                  <img
                    className="ch-cover"
                    src={chapter.cover}
                    alt={chapter.title}
                  />
                )}

                <div className="ch-body">

                    {chapter.content?.length ? (

                        chapter.content.map((item, i) => {

                            if (item.type === "paragraph") {

                                return (
                                    <p key={i}>
                                        {item.value}
                                    </p>
                                );

                            }

                            if (item.type === "image") {

                                return (
                                    <img
                                        key={i}
                                        className="ch-image"
                                        src={item.src}
                                        alt=""
                                    />
                                );

                            }

                            return null;

                        })

                    ) : (

                        <p className="ch-placeholder">
                            This chapter hasn't been written yet.
                        </p>

                    )}

                </div>

                <div className="ch-nav">

                    <div className="ch-nav-side">

                        {previous ? (

                            <Link
                                className="ch-nav-link"
                                to={`/books/${book.slug}/${previous.slug}`}
                            >

                                <span className="ch-nav-label">← Previous</span>

                                <span className="ch-nav-chapter-title">{previous.title}</span>

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
