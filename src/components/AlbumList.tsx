"use client";

import React, { JSX } from "react";
import Card from "./Card";

interface Album {
  id: number;
  title: string;
  description?: string;
  image?: string;
}

interface Props {
  albumList: Album[];
  onClick: (albumId: number) => void;
}

export default function AlbumList({ albumList, onClick }: Props): JSX.Element {
  const handleSelectionOne = (albumId: number) => {
    console.log("Selected ID is", albumId);
    onClick(albumId);
  };

  const albums = albumList.map((album) => (
    <Card
      key={album.id}
      albumId={album.id}
      albumTitle={album.title}
      albumDescription={album.description ?? ""}
      buttonText="OK"
      imgURL={album.image ?? ""}
      onClick={handleSelectionOne}
    />
  ));

  return <div className="album-grid">{albums}</div>;
}
