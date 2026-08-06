const API =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

console.log("API =", API);

export async function getBooks() {
    const res = await fetch(`${API}/books`);

    if (!res.ok) {
        throw new Error("Failed to load books");
    }

    return res.json();
}

export async function getBook(slug) {
    const res = await fetch(`${API}/books/${slug}`);

    if (!res.ok) {
        throw new Error("Book not found");
    }

    return res.json();
}

export async function getChapter(bookSlug, chapterSlug) {
    const res = await fetch(
        `${API}/books/${bookSlug}/${chapterSlug}`
    );

    if (!res.ok) {
        throw new Error("Chapter not found");
    }

    return res.json();
}