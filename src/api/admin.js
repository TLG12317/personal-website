const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function getBooks() {

    const res = await fetch(`${API}/admin/books`);

    if (!res.ok) {
        const error = await res.json();
        console.log(error);
        throw new Error(JSON.stringify(error));
    }

    return res.json();

}

export async function getAdminBook(id) {

    const res = await fetch(`${API}/admin/books/${id}`);

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
            "Content-Type": "application/json"
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
            "Content-Type": "application/json"
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
        method: "DELETE"
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
                "Content-Type":"application/json"
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