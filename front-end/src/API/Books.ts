import type { GetBookDto, CreateBookDto, UpdateBookDto } from './DTOs/Books';

const API_ENDPOINT = "http://localhost:3000/books";

const requestOptions = (method: string): RequestInit => ({
    method,
    headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    credentials: "include",
});

const checkResponse = async (res: Response) => {
    if (res.status === 401) {
        throw new Error("Unauthorized");
    }
    if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.message || res.statusText || "API request failed");
    }
    return res;
};

export async function getBooksAPI(params?: URLSearchParams): Promise<GetBookDto[]> {
    const url = params && [...params].length
        ? `${API_ENDPOINT}?${params.toString()}`
        : API_ENDPOINT;

    const res = await fetch(url, requestOptions("GET"));
    await checkResponse(res);
    return res.json();
}

export async function getBookByIdAPI(bookId: string): Promise<GetBookDto> {
    const res = await fetch(`${API_ENDPOINT}/${bookId}`, requestOptions("GET"));
    await checkResponse(res);
    return res.json();
}

export async function deleteBookByIdAPI(bookId: number, sec_password: string) {
    const res = await fetch(`${API_ENDPOINT}/${bookId}`, {
        ...requestOptions("DELETE"),
        body: JSON.stringify({ sec_password }),
    });
    await checkResponse(res);
    return res.json();
}

export async function createBookAPI(formData: CreateBookDto) {
    const res = await fetch(API_ENDPOINT, {
        ...requestOptions("POST"),
        body: JSON.stringify(formData),
    });
    await checkResponse(res);
    return res.json();
}

export async function updateBookByIdAPI(bookId: string, formData: UpdateBookDto) {
    const res = await fetch(`${API_ENDPOINT}/${bookId}`, {
        ...requestOptions("PUT"),
        body: JSON.stringify(formData),
    });
    await checkResponse(res);
    return res.json();
}