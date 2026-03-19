const BASE_URL = '';

interface FetchOptions extends RequestInit {
  json?: unknown;
}

export async function apiFetch<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { json, ...rest } = options;
  const config: RequestInit = {
    ...rest,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...rest.headers,
    },
  };

  if (json !== undefined) {
    config.body = JSON.stringify(json);
  }

  const response = await fetch(`${BASE_URL}${url}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: { message: 'Request failed' } }));
    throw new Error(errorData.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}
