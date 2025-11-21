"use client"; 
// This must be a Client Component because it uses React hooks (useState, useEffect)
// and performs data fetching on the client side.

import { useEffect, useState } from "react";
import OneAlbum from "@/components/OneAlbum";
import { get } from "@/lib/apiClient";
import type { Album, AlbumResponse } from "@/lib/types";

// Receives the albumId from the dynamic route: /show/[albumId]
export default function ShowAlbumClient({ albumId }: { albumId: string }) {
  // Holds the list of all albums fetched from the backend
  const [albumList, setAlbumList] = useState<Album[]>([]);

  // ------------------------------------------------------------
  // Fetch all albums when the component first mounts
  // ------------------------------------------------------------
  useEffect(() => {
    let cancelled = false; 
    // Prevents updating state if the component unmounts mid-fetch

    (async () => {
      try {
        // Call the backend: GET /api/albums
        const data = await get<AlbumResponse[]>("/albums");

        // Normalize the response so the UI never receives undefined values
        const normalized: Album[] = data.map((a) => ({
          id: a.id,
          title: a.title,
          artist: a.artist ?? "",
          year: a.year ?? "",
          image: a.image ?? a.imageUrl,
          description: a.description ?? "",
          tracks: a.tracks,
        }));

        // Only update state if component is still mounted
        if (!cancelled) setAlbumList(normalized);
      } catch (err) {
        console.error("❌ Error loading albums:", err);

        // If an error occurs, clear the album list to avoid rendering broken data
        if (!cancelled) setAlbumList([]);
      }
    })();

    // Cleanup function to avoid state updates after unmounting
    return () => {
      cancelled = true;
    };
  }, []); // Empty dependency array → only run once when component mounts

  // Pass the data + albumId down to the reusable OneAlbum component
  return <OneAlbum albumList={albumList} albumId={albumId} />;
}
