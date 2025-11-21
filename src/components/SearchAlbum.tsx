// This is a Client Component because it uses interactive child components
// and reacts immediately to user input (search form updates).
"use client";

import React, { JSX } from "react";
import SearchForm from "./SearchForm";
import AlbumList from "./AlbumList";
import type { Album } from "@/lib/types";

// Props expected from the parent:
// - albums: the filtered list of albums to display
// - updateSearchResults: a function that updates the search phrase in the parent component
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
      {/* Search bar component — whenever the user submits a phrase,
          SearchForm calls updateSearchResults() to tell the parent page
          what the new search phrase is. */}
      <SearchForm onSubmit={updateSearchResults} />

      {/* If albums are available, show them in a grid.
          Otherwise show a friendly message. */}
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
