// This page uses Client Components inside of it (NewAlbum and NavBar),
// and may include hooks inside those components, so we mark it as a Client Component.
"use client";

import NavBar from "@/components/NavBar";
import NewAlbum from "@/components/NewAlbum";

// This file corresponds to the route: /new
// In the Next.js App Router, app/new/page.tsx automatically maps to "/new".
export default function NewAlbumPage() {
  return (
    <>
      {/* Global navigation bar, reused across multiple pages */}
      <NavBar />

      <main className="container">
        {/* Reusable component that displays the "Create New Album" form */}
        <NewAlbum />
      </main>
    </>
  );
}
