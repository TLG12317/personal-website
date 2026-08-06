import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getBooks,
    createBook,
    updateBook,
    deleteBook
} from "../api/admin";
import "./Admin.css";

function createSlug(text) {

    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

}

export default function Admin() {

    const [books, setBooks] = useState([]);

    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [message, setMessage] = useState("");

    const [newBook, setNewBook] = useState({
        title: "",
        slug: "",
        subtitle: "",
        description: "",
        cover: "",
        publish_status: "draft",
        story_status: "ongoing",
    });

    useEffect(() => {
        getBooks().then(setBooks);
    }, []);

    function showMessage(text) {

        setMessage(text);

        setTimeout(() => {
            setMessage("");
        }, 3000);

}

    async function handleSaveBook() {

        try {

            if (editingBook) {

                const updated = await updateBook(editingBook.id, {
                    ...newBook,
                    slug: createSlug(newBook.title)
                });

                setBooks(current =>
                    current.map(book =>
                        book.id === updated.id ? updated : book
                    )
                );

            } else {

                const created = await createBook({
                    ...newBook,
                    slug: createSlug(newBook.title)
                });

                setBooks(current => [...current, created]);

            }

            setNewBook({
                title: "",
                slug: "",
                subtitle: "",
                description: "",
                cover: "",
                publish_status: "draft",
                story_status: "ongoing",
            });

                setEditingBook(null);
                setShowModal(false);

                showMessage(
                    editingBook
                        ? "Book updated successfully"
                        : "Book created successfully"
                );

        } catch (err) {

            showMessage(err.message);

        }

    }


    async function handleDeleteBook(id) {

        const confirmed = window.confirm(
            "Delete this book?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteBook(id);

            setBooks(current =>
                current.filter(book => book.id !== id)
            );
            
            showMessage("Book deleted successfully");

        } catch (err) {

            showMessage(err.message);

        }

    }

    return (

        <div className="admin-page">

            {message && (
                <div className="toast">
                    {message}
                </div>
            )}

            <div className="admin-shell">

                <div className="admin-header">

                    <div>

                        <h1 className="admin-title">
                            Admin Dashboard
                        </h1>

                        <p className="admin-subtitle">
                            Manage your books and chapters.
                        </p>

                    </div>

                    <button
                        className="admin-create"
                        onClick={() => {

                            setEditingBook(null);

                            setNewBook({
                                title: "",
                                slug: "",
                                subtitle: "",
                                description: "",
                                cover: "",
                                publish_status: "draft",
                                story_status: "ongoing",
                            });

                            setShowModal(true);

                        }}
                    >
                        + New Book
                    </button>

                </div>

                <div className="admin-books">

                    {books.length === 0 && (
                        <p>No books yet.</p>
                    )}

                    {books.map(book => (

                        <div
                            key={book.id}
                            className="admin-book"
                        >

                            <div className="admin-book-top">

                                <div>

                                    <h2>
                                        {book.title}
                                    </h2>

                                    <p className="admin-slug">
                                        {book.slug}
                                    </p>

                                </div>

                                <div className="admin-statuses">

                                    <span className="status publish">
                                        {book.publish_status}
                                    </span>

                                    <span className="status story">
                                        {book.story_status}
                                    </span>

                                </div>

                            </div>

                            <p className="admin-description">
                                {book.description}
                            </p>

                            <div className="admin-actions">

                            <button
                                className="admin-btn"
                                onClick={() => navigate(`/admin/books/${book.id}`)}
                            >
                                Edit
                            </button>


                                <button
                                    className="admin-btn admin-delete"
                                    onClick={() => handleDeleteBook(book.id)}
                                >
                                    Delete
                                </button>
                            </div>

                        </div>

                    ))}

                </div>

            </div>

            {showModal && (

                <div className="admin-modal">

                    <div className="admin-modal-card">

                        <h2>
                            
                            {editingBook ? "Edit Book" : "Create Book"}

                        </h2>

                        <input
                            placeholder="Title"
                            value={newBook.title}
                            onChange={(e) => {

                                const title = e.target.value;

                                setNewBook({
                                    ...newBook,
                                    title,
                                    slug: createSlug(title),
                                });

                            }}
                        />

                        <input
                            placeholder="Subtitle"
                            value={newBook.subtitle}
                            onChange={(e) =>
                                setNewBook({
                                    ...newBook,
                                    subtitle: e.target.value,
                                })
                            }
                        />

                        <textarea
                            rows={5}
                            placeholder="Description"
                            value={newBook.description}
                            onChange={(e) =>
                                setNewBook({
                                    ...newBook,
                                    description: e.target.value,
                                })
                            }
                        />

                        <input
                            placeholder="Cover Image URL"
                            value={newBook.cover}
                            onChange={(e) =>
                                setNewBook({
                                    ...newBook,
                                    cover: e.target.value,
                                })
                            }
                        />

                        <label>Publication</label>

                        <select
                            value={newBook.publish_status}
                            onChange={(e) =>
                                setNewBook({
                                    ...newBook,
                                    publish_status: e.target.value,
                                })
                            }
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                        <label>Story Status</label>

                        <select
                            value={newBook.story_status}
                            onChange={(e) =>
                                setNewBook({
                                    ...newBook,
                                    story_status: e.target.value,
                                })
                            }
                        >
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                            <option value="hiatus">Hiatus</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        <div className="admin-modal-buttons">

                            <button
                                className="admin-btn"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="admin-create"
                                onClick={handleSaveBook}
                            >
                                {editingBook ? "Save Changes" : "Create"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}