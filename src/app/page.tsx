// This file is a Client Component because it uses React hooks (useState, useEffect).
// Client Components run in the browser and allow interactivity.
"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import SearchAlbum from "@/components/SearchAlbum";       // Reusable component for search + album grid
import { get } from "@/lib/apiClient";                    // Helper for calling our internal API routes
import type { Album, AlbumResponse } from "@/lib/types";
import "@/components/App.css";

// app/page.tsx → This is the homepage route: "/"
export default function HomePage() {
  // Stores the list of albums returned by the backend API.
  const [albumList, setAlbumList] = useState<Album[]>([]);

  // Stores any error message if the API request fails.
  const [error, setError] = useState<string | null>(null);

  // Tracks what the user types into the search field.
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  // ------------------------------------------------------------
  // Fetch album data when the page loads.
  // useEffect runs after the component mounts (client-side only).
  // ------------------------------------------------------------
  useEffect(() => {
    let cancelled = false; 
    // This prevents updating state if the component unmounts
    // before the API call finishes.

    (async () => {
      try {
        console.log("Fetching albums from internal API...");

        // Call the backend: GET /api/albums
        const data = await get<AlbumResponse[]>("/albums");

        // Normalize the API response.
        // This ensures every album has clean, predictable fields.
        const normalized: Album[] = data.map((a) => ({
          id: a.id,
          title: a.title,
          artist: a.artist ?? "",
          year: a.year ?? "",
          image: a.image ?? a.imageUrl,
          description: a.description ?? "",
          tracks: a.tracks,
        }));

        if (!cancelled) {
          setAlbumList(normalized);
          setError(null);
        }
      } catch (err: unknown) {
        console.error("❌ Failed to load albums:", err);

        const message =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while fetching albums.";

        // If something goes wrong, show the error + clear the list.
        if (!cancelled) {
          setError(message);
          setAlbumList([]);
        }
      }
    })();

    // Cleanup function: prevents memory leaks + invalid state updates.
    return () => {
      cancelled = true;
    };
  }, []); 
  // [] means this effect runs only once on page load.

  // ------------------------------------------------------------
  // Live search filtering:
  // As the user types, we filter by title, artist, or description.
  // ------------------------------------------------------------
  const filtered = albumList.filter((album) => {
    const q = searchPhrase.toLowerCase().trim();
    if (!q) return true; // If search box is empty, show all albums

    // Combine searchable fields into one string
    const haystack = (
      (album.title ?? "") +
      " " +
      (album.artist ?? "") +
      " " +
      (album.description ?? "")
    ).toLowerCase();

    return haystack.includes(q);
  });

  return (
    <>
      {/* Global navigation bar reused across pages */}
      <NavBar />

      <main className="container main-content">
        {/* Error state: show if the API call fails */}
        {error ? (
          <div style={{ color: "red", fontWeight: "bold", marginTop: "2rem" }}>
            ⚠️ {error}
          </div>
        ) : (
          // Normal state: show the search + album results UI.
          <SearchAlbum
            albums={filtered}
            updateSearchResults={setSearchPhrase} // Allows SearchAlbum to update the search phrase
          />
        )}
      </main>
    </>
  );
}
