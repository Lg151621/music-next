// This component renders a list/grid of albums on the browser,
// and it uses AlbumCard (a Client Component), so it must also be a Client Component.
"use client";

import React from "react";
import AlbumCard from "@/components/AlbumCard";
import type { Album } from "@/lib/types";

// TypeScript interface describing what props this component expects.
// The parent component must pass an array of Album objects.
interface AlbumListProps {
  albums: Album[];
}

// Reusable component responsible for displaying a grid of AlbumCard components.
export default function AlbumList({ albums }: AlbumListProps) {
  // If no albums match the search or the API returned an empty list:
  if (!albums || albums.length === 0) {
    return <p>No albums found.</p>;
  }

  return (
    // Responsive CSS grid that automatically adjusts album layout
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
      {/* Map through all albums and render an AlbumCard for each one.
          album.id is used as the unique React key. */}
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  );
}
