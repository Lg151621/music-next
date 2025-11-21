// lib/apiClient.ts
// ---------------------------------------------------------------------
// Centralized, typed API client for your Next.js app.
//
// Instead of calling fetch() all over your components, you call:
//   get("/albums")      → GET http://localhost:3000/api/albums
//   post("/albums", {}) → POST http://localhost:3000/api/albums
//
// This keeps your code cleaner, consistent, and easier to maintain.
// ---------------------------------------------------------------------

// Base URL for your Backend API (port 3000 by default)
// NOTE: We include `/api` here so paths stay like "/albums", "/tracks", etc.
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api";

// Allowed HTTP verbs
type Verb = "GET" | "POST" | "PUT" | "DELETE";

// Generic request helper that every exported function uses.
// T = expected return type
// B = request body type (when used)
async function request<T>(
  path: string,
  method: Verb = "GET",
  body?: unknown
): Promise<T> {
  // Call BACKEND API: e.g. BASE_URL="/api" + path="/albums" -> /api/albums
  const url = `${BASE_URL}${path}`;

  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    // Only send a body for non-GET requests
    body: method !== "GET" ? JSON.stringify(body) : undefined,
  });

  // Handle non-200 responses cleanly so components can show an error message
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  // Read the response as raw text first
  const text = await response.text();

  // Try to parse JSON safely; catch invalid or empty responses
  try {
    return text ? (JSON.parse(text) as T) : ({} as T);
  } catch {
    throw new Error("Invalid JSON response");
  }
}

// ---------------------------------------------------------------------
// Exported API helpers
// These wrap the main request() function with correct HTTP verbs.
// They support TypeScript generics so each API call returns the correct shape.
// ---------------------------------------------------------------------

export const get = async <T>(path: string): Promise<T> =>
  request<T>(path, "GET");

export const post = async <T, B = unknown>(path: string, body: B): Promise<T> =>
  request<T>(path, "POST", body);

export const put = async <T, B = unknown>(path: string, body: B): Promise<T> =>
  request<T>(path, "PUT", body);

export const del = async <T>(path: string): Promise<T> =>
  request<T>(path, "DELETE");
