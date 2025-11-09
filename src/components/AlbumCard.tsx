"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Album } from "@/lib/types";

interface AlbumCardProps {
  album: Album;
}

export default function AlbumCard({ album }: AlbumCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/show/${album.id}`);
  };

  return (
    <div
      className="album-card shadow-sm rounded-lg border p-3 hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={handleClick}
      style={{
        width: "260px",
        margin: "1rem auto",
        backgroundColor: "#fff",
      }}
    >
      {album.image ? (
        <Image
          src={album.image}
          alt={album.title}
          width={250}
          height={250}
          className="rounded-lg object-cover"
        />
      ) : (
        <div
          style={{
            width: "250px",
            height: "250px",
            backgroundColor: "#eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
            borderRadius: "8px",
          }}
        >
          No Image
        </div>
      )}

      <div style={{ marginTop: "0.75rem", textAlign: "center" }}>
        <h5 style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{album.title}</h5>
        <p style={{ color: "#666", margin: "0.25rem 0" }}>{album.artist}</p>
        <p style={{ fontSize: "0.9rem", color: "#888" }}>{album.year ?? ""}</p>
      </div>
    </div>
  );
}
