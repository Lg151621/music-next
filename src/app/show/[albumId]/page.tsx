// src/app/show/[albumId]/page.tsx

import NavBar from "@/components/NavBar";
import ShowAlbumClient from "./ShowAlbumClient";

// This file becomes the dynamic route: /show/[albumId]
// Example: /show/3 → params.albumId = "3"
export default async function Page({
  params,
}: {
  params: Promise<{ albumId: string }>;
}) {
  // In Next.js 15 (App Router), dynamic params arrive as a Promise.
  // We must await them to get the actual albumId string.
  const { albumId } = await params;

  return (
    <>
      {/* Global navigation displayed across all pages */}
      <NavBar />

      <main className="container">
        {/* Pass the albumId to a Client Component that handles fetching + rendering */}
        <ShowAlbumClient albumId={albumId} />
      </main>
    </>
  );
}
