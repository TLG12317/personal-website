import { supabase } from "../supabase";
import { API_URL as API } from "../config";

async function authHeaders() {

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    return token
        ? { Authorization: `Bearer ${token}` }
        : {};

}

async function handleResponse(res) {
    if (res.status === 401) {
        await supabase.auth.signOut();
        window.location.replace("/admin/login");
        return;
    }

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || JSON.stringify(data));
    }

    return data;
}

export async function getBooks() {

    const res = await fetch(`${API}/admin/books`, {
        headers: await authHeaders()
    });

    return handleResponse(res);

}

export async function getAdminBook(id) {

    const res = await fetch(`${API}/admin/books/${id}`, {
        headers: await authHeaders()
    });

    return handleResponse(res);

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

    return handleResponse(res);

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

    return handleResponse(res);

}

export async function deleteBook(id) {

    const res = await fetch(`${API}/books/${id}`, {
        method: "DELETE",
        headers: await authHeaders()
    });

    return handleResponse(res);

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

    return handleResponse(res);

}

export async function getBookChapters(bookId) {

    const res = await fetch(`${API}/admin/books/${bookId}/chapters`, {
        headers: await authHeaders()
    });

    return handleResponse(res);

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

    return handleResponse(res);

}

export async function getAdminChapter(id) {

    const res = await fetch(`${API}/admin/chapters/${id}`, {
        headers: await authHeaders()
    });

    return handleResponse(res);

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

    return handleResponse(res);

}
