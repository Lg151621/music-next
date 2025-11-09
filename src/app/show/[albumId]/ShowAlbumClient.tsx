"use client";

import { useEffect, useState } from "react";
import OneAlbum from "@/components/OneAlbum";
import { get } from "@/lib/apiClient";
import type { Album, AlbumResponse } from "@/lib/types";

export default function ShowAlbumClient({ albumId }: { albumId: string }) {
  const [albumList, setAlbumList] = useState<Album[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
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
      } catch (err) {
        console.error("❌ Error loading albums:", err);
        if (!cancelled) setAlbumList([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return <OneAlbum albumList={albumList} albumId={albumId} />;
}
