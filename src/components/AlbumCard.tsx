// This component uses NextAuth session to control which actions are visible.
"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Album } from "@/lib/types";

interface AlbumCardProps {
  album: Album;
}

export default function AlbumCard({ album }: AlbumCardProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="card">
      {/* ===== Album Cover Image ===== */}
      <div className="img-wrapper">
        {album.image ? (
          <Image
            src={album.image}
            alt={album.title}
            fill
            sizes="(max-width: 768px) 100vw, 240px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
            }}
          >
            No Image
          </div>
        )}
      </div>

      {/* ===== Album Title, Artist, and Year ===== */}
      <div className="card-body">
        <h5
          className="card-title"
          style={{ fontSize: "1.1rem", fontWeight: 600 }}
        >
          {album.title}
        </h5>

        <p className="card-text">
          {album.artist}
          <br />
          <span>Released: {album.year ?? ""}</span>
        </p>

        {/* ===== Buttons (only when logged in) ===== */}
        {session && (
          <div className="card-footer-buttons">
            {/* VIEW BUTTON */}
            <Link
              href={`/show/${album.id}`}
              className="Btn-link"
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" className="Btn Btn-view">
                View
              </button>
            </Link>

            {/* EDIT BUTTON (Admins only) */}
            {isAdmin && (
              <Link
                href={`/edit/${album.id}`}
                className="Btn-link"
                onClick={(e) => e.stopPropagation()}
              >
                <button type="button" className="Btn Btn-edit">
                  Edit
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
