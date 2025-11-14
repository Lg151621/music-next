"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import SearchAlbum from "@/components/SearchAlbum"; // ✅ Use SearchAlbum here
import { get } from "@/lib/apiClient";
import type { Album, AlbumResponse } from "@/lib/types";
import "@/components/App.css";

export default function HomePage() {
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        console.log("Fetching albums from internal API...");
        const data = await get<AlbumResponse[]>("/albums");

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

        if (!cancelled) {
          setError(message);
          setAlbumList([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // 🔍 Filter albums using search phrase
  const filtered = albumList.filter((album) => {
    const q = searchPhrase.toLowerCase().trim();
    if (!q) return true; // show all

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
      <NavBar />

      <main className="container main-content">
        {error ? (
          <div style={{ color: "red", fontWeight: "bold", marginTop: "2rem" }}>
            ⚠️ {error}
          </div>
        ) : (
          <SearchAlbum
            albums={filtered}
            updateSearchResults={setSearchPhrase}
          />
        )}
      </main>
    </>
  );
}
