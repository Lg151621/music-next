"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import AlbumList from "@/components/AlbumList";  // ✅ use AlbumList now
import { get } from "@/lib/apiClient";
import type { Album, AlbumResponse } from "@/lib/types";
import "@/components/App.css";

export default function HomePage() {
  const router = useRouter();
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const [error, setError] = useState<string | null>(null);

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

        if (!cancelled) setAlbumList(normalized);
      } catch (err: unknown) {
        console.error("❌ Failed to load albums:", err);
        const message =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while fetching albums.";
        if (!cancelled) setError(message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <NavBar />
      <main className="container main-content">
       {error ? (
  <div style={{ color: "red", fontWeight: "bold", marginTop: "2rem" }}>
    ⚠️ {error}
  </div>
) : albumList.length > 0 ? (
  <AlbumList albums={albumList} />
) : (
  <p>Loading albums...</p>
)}

      </main>
    </>
  );
}
