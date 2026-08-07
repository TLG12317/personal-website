import { supabase } from "../supabase";

const API = "http://localhost:5000";

async function authHeaders() {

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    return token
        ? { Authorization: `Bearer ${token}` }
        : {};

}

export async function getBooks() {

    const res = await fetch(`${API}/admin/books`, {
        headers: await authHeaders()
    });

    if (!res.ok) {
        const error = await res.json();
        console.log(error);
        throw new Error(JSON.stringify(error));
    }

    return res.json();

}

export async function getAdminBook(id) {

    const res = await fetch(`${API}/admin/books/${id}`, {
        headers: await authHeaders()
    });

    if (!res.ok) {
        const error = await res.json();
        console.log(error);
        throw new Error(error.message || JSON.stringify(error));
    }

    return res.json();

}

export async function createBook(book) {

    const res = await fetch(`${API}/books`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            ...(await authHeaders())
        },

        body: JSON.stringify(book)

    });

    const data = await res.json();

    if (!res.ok) {
        console.log(data);
        throw new Error(data.message || JSON.stringify(data));
    }

    return data;

}

export async function updateBook(id, book) {

    const res = await fetch(`${API}/books/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json",
            ...(await authHeaders())
        },

        body: JSON.stringify(book)

    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || JSON.stringify(data));
    }

    return data;

}

export async function deleteBook(id) {

    const res = await fetch(`${API}/books/${id}`, {
        method: "DELETE",
        headers: await authHeaders()
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || JSON.stringify(data));
    }

    return data;

}

export async function updateAdminBook(id, book){

    const res = await fetch(
        `${API}/admin/books/${id}`,
        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                ...(await authHeaders())
            },
            body:JSON.stringify(book)
        }
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || JSON.stringify(data));
    }

    return data;
}

export async function getBookChapters(bookId) {

    const res = await fetch(`${API}/admin/books/${bookId}/chapters`, {
        headers: await authHeaders()
    });

    if (!res.ok) {
        const error = await res.json();
        console.log(error);
        throw new Error(error.message || JSON.stringify(error));
    }

    return res.json();

}

export async function createChapter(bookId, chapter) {

    const res = await fetch(`${API}/admin/books/${bookId}/chapters`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            ...(await authHeaders())
        },

        body: JSON.stringify(chapter)

    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || JSON.stringify(data));
    }

    return data;

}

export async function getAdminChapter(id) {

    const res = await fetch(`${API}/admin/chapters/${id}`, {
        headers: await authHeaders()
    });

    if (!res.ok) {
        const error = await res.json();
        console.log(error);
        throw new Error(error.message || JSON.stringify(error));
    }

    return res.json();

}

export async function updateChapter(id, chapter) {

    const res = await fetch(`${API}/admin/chapters/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json",
            ...(await authHeaders())
        },

        body: JSON.stringify(chapter)

    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || JSON.stringify(data));
    }

    return data;

}
