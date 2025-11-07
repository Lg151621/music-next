"use client";

import { useParams } from "next/navigation";
import NavBar from "@/components/NavBar";
import EditAlbum from "@/components/EditAlbum";

export default function EditAlbumPage() {
  const { albumId } = useParams() as { albumId: string };

  return (
    <>
      <NavBar />
      <main className="container">
        <EditAlbum albumId={albumId} />
      </main>
    </>
  );
}
