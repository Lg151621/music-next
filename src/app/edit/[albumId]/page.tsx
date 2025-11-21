// This page uses React hooks (useParams), so it must run in the browser.
// That means it must be a Client Component.
"use client";

import { useParams } from "next/navigation";
import NavBar from "@/components/NavBar";
import EditAlbum from "@/components/EditAlbum";

// This file maps to the dynamic route: /edit/[albumId]
// Example: /edit/3 → albumId = "3"
export default function EditAlbumPage() {
  // Read the dynamic route parameter from the URL.
  // useParams() returns an object containing the folder name: [albumId]
  const { albumId } = useParams() as { albumId: string };

  return (
    <>
      {/* Navigation bar shown across the whole application */}
      <NavBar />

      {/* Main content area for the Edit Album page */}
      <main className="container">
        {/* Render the reusable EditAlbum component and pass in the albumId */}
        <EditAlbum albumId={albumId} />
      </main>
    </>
  );
}
