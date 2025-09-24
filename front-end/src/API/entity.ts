import type { CreateEntityInput, GetEntityInput, UpdateEntityInput } from './DTOs/Entities';

const API_ENDPOINT:string = "http://localhost:3000/entities";

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

export async function getAllEntitiesAPI() {
    const response = await fetch(`${API_ENDPOINT}`, requestOptions("GET"));
    if (!response.ok) {
        throw new Error(`Error fetching entities: ${response.statusText}`);
    }
    return response.json() as Promise<GetEntityInput[]>;
}
export async function getAllEntitiesByBookIDAPI(bookId: string) {
    const response = await fetch(`${API_ENDPOINT}/book/${bookId}`, requestOptions("GET"));
    if (!response.ok) {
        throw new Error(`Error fetching entities: ${response.statusText}`);
    }
    return response.json() as Promise<GetEntityInput[]>;
}
export async function getEntityByIdAPI(entityId: string) {
    const response = await fetch(`${API_ENDPOINT}/${entityId}`, requestOptions("GET"));
    
    if (!response.ok) {
        throw new Error("Failed to fetch entity");
    }
    return await response.json() as Promise<GetEntityInput>
}

export async function deleteEntityByIdAPI(entityId: string) {
    const response = await fetch(`${API_ENDPOINT}/${entityId}`, {
        ...requestOptions("DELETE"),
    });
    
    if (!response.ok) {
        throw new Error("Failed to delete entity");
    }
    return await response.json();
}

export async function createEntityAPI(formData: CreateEntityInput, mediaFiles: File[]) {
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            data.append(key, value as any);
        }
    });
    mediaFiles.forEach((file, idx) => {
        data.append('mediaFiles', file);
    });

    const response = await fetch(`${API_ENDPOINT}`, {
        ...requestOptions("POST"),
        body: data,
    });

    if (!response.ok) {
        throw new Error("Failed to create entity");
    }
    return await response.json();
}

export async function updateEntityAPI(entityId: string, formData: UpdateEntityInput, mediaFiles: File[]) {
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            data.append(key, value as any);
        }
    });
    mediaFiles.forEach((file, idx) => {
        data.append('mediaFiles', file);
    });

    const response = await fetch(`${API_ENDPOINT}/${entityId}`, {
       ...requestOptions("PATCH"),
        body: data,
    });

    if (!response.ok) {
        throw new Error("Failed to update entity");
    }
    return await response.json();
}

export async function deleteEntityAttachmentAPI(entityId: string, attachmentId: number) {
    const response = await fetch(`${API_ENDPOINT}/${entityId}/attachments/${attachmentId}`, {
        ...requestOptions("DELETE"),
    });

    if (!response.ok) {
        throw new Error("Failed to delete attachment");
    }
    return await response.json();
}