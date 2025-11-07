"use client";

import { useEffect, useState } from "react";
import OneAlbum from "@/components/OneAlbum";
import dataSource from "@/lib/dataSource";
import type { Album, AlbumResponse } from "@/lib/types";

export default function ShowAlbumClient({ albumId }: { albumId: string }) {
  const [albumList, setAlbumList] = useState<Album[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await dataSource.get("/api/albums");
        const raw = res.data as AlbumResponse[] | { albums?: AlbumResponse[] };
        const source: AlbumResponse[] = Array.isArray(raw) ? raw : raw.albums ?? [];

        const normalized: Album[] = source.map((a) => ({
          id: a.id,
          title: a.title,
          artist: a.artist ?? "",
          year: a.year ?? "",
          image: a.image ?? a.imageUrl ?? "",
          description: a.description ?? "",
          tracks: a.tracks,
        }));

        if (!cancelled) setAlbumList(normalized);
      } catch {
        if (!cancelled) setAlbumList([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return <OneAlbum albumList={albumList} albumId={albumId} />;
}
