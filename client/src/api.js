const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8083";

async function request(path, { method = "GET", body, token, params } = {}) {
  const url = new URL(path, API_BASE);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.append(k, v);
    });
  }

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message = data?.message || res.statusText;
    throw new Error(message);
  }
  return data;
}

export const api = {
  auth: {
    login: (email, password) => request("/api/auth/login", { method: "POST", body: { email, password } }),
    register: (firstName, lastName, email, password, confirmPassword) =>
      request("/api/auth/register", { method: "POST", body: { firstName, lastName, email, password, confirmPassword } }),
    me: (token) => request("/api/auth/me", { token }),
  },
  books: {
    list: (token) => request("/books", { token }),
    create: (token, payload) => request("/books", { method: "POST", token, body: payload }),
    update: (token, id, payload) => request(`/books/${id}`, { method: "PUT", token, body: payload }),
    remove: (token, id) => request(`/books/${id}`, { method: "DELETE", token }),
  },
  lending: {
    list: (token) => request("/lending", { token }),
    forUser: (token, userId) => request(`/lending/user/${userId}`, { token }),
    lend: (token, body) => request("/lending/lend", { method: "POST", token, body }),
    returnBook: (token, lendingId) => request(`/lending/return/${lendingId}`, { method: "POST", token }),
  },
  logs: {
    search: (token, params) => request("/api/logs", { token, params }),
  },
};
