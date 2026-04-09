const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const detail =
      typeof data === "object" && data !== null
        ? data.detail ?? data.message ?? JSON.stringify(data)
        : data;

    throw new Error(detail || "Ocurrio un error al comunicarse con la API.");
  }

  return data;
};

export const apiClient = {
  baseUrl: API_BASE_URL,

  async get(path) {
    const response = await fetch(buildUrl(path));
    return parseResponse(response);
  },

  async post(path, body) {
    const response = await fetch(buildUrl(path), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return parseResponse(response);
  },

  async put(path, body) {
    const response = await fetch(buildUrl(path), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return parseResponse(response);
  },

  async delete(path) {
    const response = await fetch(buildUrl(path), {
      method: "DELETE",
    });

    return parseResponse(response);
  },
};
