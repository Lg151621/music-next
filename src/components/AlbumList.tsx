"use client";

import React from "react";
import AlbumCard from "@/components/AlbumCard";
import type { Album } from "@/lib/types";

interface AlbumListProps {
  albums: Album[];
}

export default function AlbumList({ albums }: AlbumListProps) {
  if (!albums || albums.length === 0) {
    return <p>No albums found.</p>;
  }

  return (
    <div
      className="album-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "1.5rem",
        justifyItems: "center",
        padding: "1.5rem",
      }}
    >
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  );
}