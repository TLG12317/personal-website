import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAdminBook, updateAdminBook } from "../../api/admin";
import "./AdminBook.css";

export default function AdminBook() {
    const { id } = useParams();

    const [book, setBook] = useState(null);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getAdminBook(id)
            .then((data) => {
                setBook(data);

                setTitle(data.title || "");
                setSlug(data.slug || "");

                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [id]);


    async function handleSave() {
        setSaving(true);

        try {
            const updated = await updateAdminBook(id, {
                title,
                slug
            });

            setBook(updated);
            alert("Book saved!");
        } 
        catch (error) {
            console.error(error);
            alert("Failed to save book");
        }

        setSaving(false);
    }


    if (loading) {
        return <h1>Loading...</h1>;
    }


    if (!book) {
        return <h1>Book not found.</h1>;
    }


    return (
        <div className="admin-book">

            <Link to="/admin">
                ← Back to Dashboard
            </Link>


            <h1>Edit Book</h1>


            <div className="book-form">

                <label>
                    Title
                </label>

                <input
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                />


                <label>
                    Slug
                </label>

                <input
                    value={slug}
                    onChange={(e)=>setSlug(e.target.value)}
                />


                <button
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>

            </div>


            <hr />


            <h2>Book Preview</h2>

            <h3>{title}</h3>

            <p>
                {slug}
            </p>


            <h2>
                Chapters
            </h2>

            <p>
                Chapter editor coming next...
            </p>

        </div>
    );
}