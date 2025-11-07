"use client";

import NavBar from "@/components/NavBar";
import NewAlbum from "@/components/NewAlbum";

export default function NewAlbumPage() {
  return (
    <>
      <NavBar />
      <main className="container">
        <NewAlbum />
      </main>
    </>
  );
}
