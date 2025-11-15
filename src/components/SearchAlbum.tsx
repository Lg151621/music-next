// src/components/SearchAlbum.tsx
"use client";

import React, { JSX } from "react";
import SearchForm from "./SearchForm";
import AlbumList from "./AlbumList";
import type { Album } from "@/lib/types";

interface Props {
  albums: Album[];
  updateSearchResults: (phrase: string) => void;
}

export default function SearchAlbum({
  albums,
  updateSearchResults,
}: Props): JSX.Element {
  return (
    <div className="container">
      <SearchForm onSubmit={updateSearchResults} />

      {albums.length > 0 ? (
        <AlbumList albums={albums} />
      ) : (
        <p className="mt-3 text-muted">
          No albums match your search yet. Try a different phrase.
        </p>
      )}
    </div>
  );
}