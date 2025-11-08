"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import SearchAlbum from "@/components/SearchAlbum";
import dataSource from "@/lib/dataSource";
import type { Album, AlbumResponse } from "@/lib/types";
import "@/components/App.css";

export default function HomePage() {
  const router = useRouter();
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [albumList, setAlbumList] = useState<Album[]>([]);

  const updateSearchResults = (phrase: string) => setSearchPhrase(phrase);
  const updateSingleAlbum = (id: number) => router.push(`/show/${id}`);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // 🧩 Add this line to confirm your API base URL
        console.log("Fetching albums from:", dataSource.defaults.baseURL + "/api/albums");

        const res = await dataSource.get("/api/albums");

        // backend may return array or { albums: [...] }
        const raw = res.data as AlbumResponse[] | { albums?: AlbumResponse[] };
        const source: AlbumResponse[] = Array.isArray(raw) ? raw : raw.albums ?? [];

        const normalized: Album[] = source.map((a) => ({
          id: a.id,
          title: a.title,
          artist: a.artist ?? "",
          year: a.year ?? "",
          image: a.image ?? a.imageUrl,
          description: a.description ?? "",
          tracks: a.tracks,
        }));

        if (!cancelled) setAlbumList(normalized);
      } catch (err) {
        console.error("Failed to load albums:", err);
        if (!cancelled) setAlbumList([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const renderedList = albumList.filter((album) => {
    const q = (searchPhrase ?? "").toLowerCase();
    const desc = (album?.description ?? "").toLowerCase();
    return q === "" || desc.includes(q);
  });

  return (
    <>
      <NavBar />
      <main className="container main-content">
        <SearchAlbum
          updateSearchResults={updateSearchResults}
          albumList={renderedList}
          updateSingleAlbum={updateSingleAlbum}
        />
      </main>
    </>
  );
}
