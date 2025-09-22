import { GetBookDto, type CreateBookDto, type UpdateBookDto } from './DTOs/Books'

const API_ENDPOINT:string = "http://localhost:3000/books";

const requestOptions = (method: string): RequestInit => {
    return {
        method,
        headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer " + localStorage.getItem("token"),
        },
        credentials: "include" as RequestCredentials,
    };
};

export async function getBooksAPI(params?: URLSearchParams) {
      const url = params && [...params].length
      ? `${API_ENDPOINT}?${params.toString()}`
      : API_ENDPOINT;
    const response = await fetch(url, requestOptions("GET"));
 if (!response.ok) {
        // try to pick up error message from JSON, else fallback
        const errPayload = await response.json().catch(() => null);
        const msg = errPayload?.message || response.statusText || "Failed to fetch books";
        console.error("getBooksAPI error:", errPayload || response);
        throw new Error(msg);
    }
    // console.log("response", await response.json());
    return response.json() as Promise<GetBookDto[]>;
}

export async function getBookByIdAPI(bookId: string) {
    const response = await fetch(`${API_ENDPOINT}/${bookId}`, requestOptions("GET"));

    if (!response.ok) {
        throw new Error("Failed to fetch book");
    }
    return await response.json() as Promise<GetBookDto>
}

export async function deleteBookByIdAPI(bookId: string, sec_password: string) {
    const response = await fetch(`${API_ENDPOINT}/${bookId}`, {
        ...requestOptions("DELETE"),
        body: JSON.stringify({ sec_password }),
    });

    if (!response.ok) {
        throw new Error("Failed to delete book");
    }
    return await response.json();
}

export async function createBookAPI(formData: CreateBookDto) {
    const response = await fetch(`${API_ENDPOINT}`, {
        ...requestOptions("POST"),
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        throw new Error("Failed to create book");
    }
    return await response.json();
}

export async function updateBookByIdAPI(bookId: string, formData: UpdateBookDto) {
    const response = await fetch(`${API_ENDPOINT}/${bookId}`, {
        ...requestOptions("PUT"),
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        throw new Error("Failed to update book");
    }
    return await response.json();
}
