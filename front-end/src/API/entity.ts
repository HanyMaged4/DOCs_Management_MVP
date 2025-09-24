import type {
  CreateEntityInput,
  GetEntityInput,
  UpdateEntityInput,
} from './DTOs/Entities';

const API_ENDPOINT = 'http://localhost:3000/entities';

/**
 * Options for JSON‐only requests
 */
function jsonOptions(method: string): RequestInit {
  return {
    method,
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    credentials: 'include',
  };
}

/**
 * Options for multipart/form-data requests (no Content-Type header)
 */
function formOptions(method: string): RequestInit {
  return {
    method,
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    credentials: 'include',
  };
}

/**
 * Throws on non-ok responses, preserving any JSON error message
 */
async function checkResponse(res: Response) {
  if (!res.ok) {
    const errPayload = await res.json().catch(() => null);
    const msg = errPayload?.message || res.statusText || 'API request failed';
    throw new Error(msg);
  }
  return res;
}

export async function getAllEntitiesAPI(): Promise<GetEntityInput[]> {
  const res = await fetch(API_ENDPOINT, jsonOptions('GET'));
  await checkResponse(res);
  return res.json();
}

export async function getAllEntitiesByBookIDAPI(
  bookId: string
): Promise<GetEntityInput[]> {
  const res = await fetch(
    `${API_ENDPOINT}/book/${bookId}`,
    jsonOptions('GET')
  );
  await checkResponse(res);
  return res.json();
}

export async function getEntityByIdAPI(
  entityId: string
): Promise<GetEntityInput> {
  const res = await fetch(
    `${API_ENDPOINT}/${entityId}`,
    jsonOptions('GET')
  );
  await checkResponse(res);
  return res.json();
}

export async function deleteEntityByIdAPI(entityId: string): Promise<void> {
  const res = await fetch(
    `${API_ENDPOINT}/${entityId}`,
    jsonOptions('DELETE')
  );
  await checkResponse(res);
}

/**
 * Creates an entity, optionally uploading attachments.
 */
export async function createEntityAPI(
  formData: CreateEntityInput,
  mediaFiles?: File[]
): Promise<GetEntityInput> {
  const data = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      data.append(key, String(value));
    }
  });
  mediaFiles?.forEach((file) => data.append('attachments', file));

  const res = await fetch(API_ENDPOINT, {
    ...formOptions('POST'),
    body: data,
  });
  await checkResponse(res);
  return res.json();
}

/**
 * Updates an entity, optionally uploading new attachments.
 */
export async function updateEntityAPI(
  entityId: string,
  formData: UpdateEntityInput,
  mediaFiles?: File[]
): Promise<GetEntityInput> {
  const data = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      data.append(key, String(value));
    }
  });
  mediaFiles?.forEach((file) => data.append('attachments', file));

  const res = await fetch(`${API_ENDPOINT}/${entityId}`, {
    ...formOptions('PATCH'),
    body: data,
  });
  await checkResponse(res);
  return res.json();
}

/**
 * Deletes a single attachment from an entity.
 */
export async function deleteEntityAttachmentAPI(
  entityId: string,
  attachmentId: number
): Promise<void> {
  const res = await fetch(
    `${API_ENDPOINT}/${entityId}/attachments/${attachmentId}`,
    jsonOptions('DELETE')
  );
  await checkResponse(res);
}