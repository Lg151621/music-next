"use client";

import React, { JSX } from "react";
import SearchForm from "./SearchForm";
import AlbumList from "./AlbumList";
import type { Album } from "@/lib/types";

interface Props {
  albumList: Album[];
  updateSearchResults: (phrase: string) => void;
  updateSingleAlbum: (albumId: number) => void;
}

export default function SearchAlbum({
  albumList,
  updateSearchResults,
  updateSingleAlbum,
}: Props): JSX.Element {
  return (
    <div className="container">
      <SearchForm onSubmit={updateSearchResults} />
      <AlbumList albumList={albumList} onClick={updateSingleAlbum} />
    </div>
  );
}
