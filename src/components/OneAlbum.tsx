// This is a Client Component because it uses React hooks and the Next.js router.
"use client";

import React, { JSX } from "react";
import { useRouter } from "next/navigation";
import type { Album } from "@/lib/types";

// Props this component expects from its parent:
// - albumList: all albums already fetched
// - albumId: the ID in the URL (from /show/[albumId])
interface Props {
  albumList: Album[];
  albumId: string;
}

export default function OneAlbum({ albumList, albumId }: Props): JSX.Element {
  const router = useRouter();

  // Convert albumId from a string into a number (IDs in DB are numeric)
  const album = albumList.find((a) => a.id === Number(albumId));

  // If the album doesn't exist, show a friendly message instead of crashing
  if (!album) {
    return (
      <div className="container text-center py-5">
        <h3>Album not found.</h3>
        <button className="btn btn-primary mt-3" onClick={() => router.push("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="mb-4">Album Details for {album.title}</h2>

      <div className="row">
        {/* ---------------- LEFT SIDE — Album card ---------------- */}
        <div className="col col-sm-3">
          <div className="card shadow-sm">
            {/* Album cover area */}
            <div
              style={{
                width: "100%",
                height: "280px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f8f9fa",
                overflow: "hidden",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <img
                src={
                  // Use a placeholder when image field is empty or invalid
                  album.image && album.image.startsWith("http")
                    ? album.image
                    : "/assets/placeholder.png"
                }
                alt={album.title}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
                // When image fails to load, swap to placeholder
                onError={(e) => (e.currentTarget.src = "/assets/placeholder.png")}
              />
            </div>

            {/* Album info section */}
            <div className="card-body">
              <h5 className="card-title">{album.title}</h5>
              <p className="card-text">{album.description}</p>

              <ul className="list-group list-group-flush mb-3">
                <li className="list-group-item">
                  Artist: <strong>{album.artist}</strong>
                </li>
                <li className="list-group-item">
                  Year: <strong>{album.year}</strong>
                </li>
                <li className="list-group-item">
                  Tracks: <em>Show the album&apos;s tracks here</em>
                </li>
              </ul>

              {/* Button to navigate to the edit page */}
              <button
                className="btn btn-warning w-100"
                onClick={() => router.push(`/edit/${album.id}`)}
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT SIDE — Lyrics + Video ---------------- */}
        <div className="col col-sm-9">
          <div className="row g-3">
            {/* Track lyrics section */}
            <div className="col-md-6">
              <div className="card p-3 h-100">
                <p>Show the lyrics of the selected track here</p>
              </div>
            </div>

            {/* YouTube / Video section */}
            <div className="col-md-6">
              <div className="card p-3 h-100">
                <p>Show the YouTube video of the selected track here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
