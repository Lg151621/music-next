// src/app/show/[albumId]/page.tsx
import NavBar from "@/components/NavBar";
import ShowAlbumClient from "./ShowAlbumClient";

export default async function Page({
  params,
}: {
  params: Promise<{ albumId: string }>;
}) {
  const { albumId } = await params; // ✅ unwrap the promise

  return (
    <>
      <NavBar />
      <main className="container">
        <ShowAlbumClient albumId={albumId} />
      </main>
    </>
  );
}
