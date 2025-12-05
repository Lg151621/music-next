// src/app/show/[albumId]/page.tsx

import OneAlbum from "@/components/OneAlbum";

// This is a SERVER component (no "use client" here)
export default async function ShowAlbumPage({
  params,
}: {
  params: Promise<{ albumId: string }>;
}) {
  // ✅ unwrap the Promise that Next gives us
  const { albumId } = await params;

  // Pass the plain string down to the client component
  return <OneAlbum albumId={albumId} />;
}
