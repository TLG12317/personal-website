import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
    getAdminBook, 
    updateAdminBook, 
    getBookChapters,
    createChapter 
} from "../../api/admin";

import "./AdminBook.css";

function createSlug(text) {

    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

}

export default function AdminBook() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState(null);

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");

    const [chapters, setChapters] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [showChapterModal, setShowChapterModal] = useState(false);

    const [newChapter, setNewChapter] = useState({
        number: "",
        title: "",
        slug: "",
        content: "",
        publish_status: "draft",
    });

    useEffect(() => {

        Promise.all([
            getAdminBook(id),
            getBookChapters(id)
        ])
        .then(([bookData, chapterData]) => {

            setBook(bookData);

            setTitle(bookData.title || "");
            setSlug(bookData.slug || "");

            setChapters(chapterData);

            setLoading(false);

        })
        .catch((error) => {

            console.error(error);

            setLoading(false);

        });

    }, [id]);


    function showMessage(text) {

        setMessage(text);

        setTimeout(() => {
            setMessage("");
        }, 3000);

    }

    async function handleCreateChapter(){

        try {

            const created = await createChapter(id, {
                number: Number(newChapter.number),
                title: newChapter.title,
                slug: newChapter.slug,
                content: newChapter.content,
                publish_status: newChapter.publish_status
            });


            setChapters(current => [
                ...current,
                created
            ]);


            setNewChapter({
                number:"",
                title:"",
                slug:"",
                content:"",
                publish_status:"draft",
            });


            setShowChapterModal(false);

            showMessage("Chapter created successfully");


        } catch(error){

            console.error(error);

            showMessage(
                "Failed to create chapter"
            );

        }

    }

    async function handleSave() {

        setSaving(true);

        try {

            const updated = await updateAdminBook(id, {
                title,
                slug
            });

            setBook(updated);

            showMessage("Book saved successfully");

        } 
        catch (error) {

            console.error(error);

            showMessage("Failed to save book");

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

            {message && (
                <div className="toast">
                    {message}
                </div>
            )}


            <Link to="/admin">
                ← Back to Dashboard
            </Link>



            <h1>
                Edit Book
            </h1>



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



            <h2>
                Book Preview
            </h2>


            <h3>
                {title}
            </h3>


            <p>
                {slug}
            </p>





            <hr />


                <div className="chapter-header">

                    <h2>
                        Chapters
                    </h2>


                    <button
                        className="admin-create"
                        onClick={() => setShowChapterModal(true)}
                    >
                        + New Chapter
                    </button>

                </div>



            <div className="chapter-list">


                {chapters.length === 0 ? (

                    <p>
                        No chapters yet.
                    </p>

                ) : (


                    chapters.map((chapter) => (

                        <div
                            key={chapter.id}
                            className="chapter-row"
                        >

                            <div>

                                <h3>
                                    {chapter.number}. {chapter.title}
                                </h3>


                                <p>
                                    Status: {chapter.publish_status}
                                </p>


                            </div>



                            <button
                                onClick={() =>
                                    navigate(`/admin/chapters/${chapter.id}`)
                                }
                            >
                                Edit
                            </button>


                        </div>

                    ))


                )}


            </div>

            {showChapterModal && (

                <div className="admin-modal">

                    <div className="admin-modal-card">

                        <h2>
                            New Chapter
                        </h2>


                        <input
                            placeholder="Chapter Number"
                            value={newChapter.number}
                            onChange={(e) =>
                                setNewChapter({
                                    ...newChapter,
                                    number: e.target.value
                                })
                            }
                        />


                        <input
                            placeholder="Chapter Title"
                            value={newChapter.title}
                            onChange={(e) => {

                                const title = e.target.value;

                                setNewChapter({
                                    ...newChapter,
                                    title,
                                    slug: createSlug(title)
                                });

                            }}
                        />


                        <input
                            placeholder="Slug"
                            value={newChapter.slug}
                            onChange={(e) =>
                                setNewChapter({
                                    ...newChapter,
                                    slug: e.target.value
                                })
                            }
                        />


                        <textarea
                            rows={10}
                            placeholder="Chapter content..."
                            value={newChapter.content}
                            onChange={(e) =>
                                setNewChapter({
                                    ...newChapter,
                                    content: e.target.value
                                })
                            }
                        />


                        <label>
                            Publication
                        </label>


                        <select
                            value={newChapter.publish_status}
                            onChange={(e) =>
                                setNewChapter({
                                    ...newChapter,
                                    publish_status: e.target.value
                                })
                            }
                        >

                            <option value="draft">
                                Draft
                            </option>

                            <option value="published">
                                Published
                            </option>

                        </select>


                        <div className="admin-modal-buttons">

                            <button
                                className="admin-btn"
                                onClick={() => setShowChapterModal(false)}
                            >
                                Cancel
                            </button>


                            <button
                                className="admin-create"
                                onClick={handleCreateChapter}
                            >
                                Create
                            </button>

                        </div>


                    </div>

                </div>

            )}


        </div>

    );

}