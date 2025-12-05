// src/components/OneAlbum.tsx
"use client";

import React, { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Album } from "@/lib/types";

type Track = {
  id: number;
  album_id: number;
  title: string;
  number: number;
  video_url: string | null;
  lyrics: string | null;
};

interface Props {
  albumId: string;
}

export default function OneAlbum({ albumId }: Props): JSX.Element {
  const router = useRouter();
  const albumIdNumber = Number(albumId);

  const [album, setAlbum] = useState<Album | null>(null);
  const [albumLoading, setAlbumLoading] = useState(true);
  const [albumError, setAlbumError] = useState<string | null>(null);

  const [tracks, setTracks] = useState<Track[]>([]);
  const [tracksLoading, setTracksLoading] = useState(true);
  const [tracksError, setTracksError] = useState<string | null>(null);

  // -------- Load album by id --------
  useEffect(() => {
    if (Number.isNaN(albumIdNumber)) {
      setAlbum(null);
      setAlbumLoading(false);
      setAlbumError("Invalid album id.");
      return;
    }

    async function loadAlbum() {
      setAlbumLoading(true);
      setAlbumError(null);

      try {
        const base = process.env.NEXT_PUBLIC_API_URL;
        if (!base) throw new Error("NEXT_PUBLIC_API_URL is not set");

        const res = await fetch(`${base}/api/albums/${albumIdNumber}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to load album (${res.status})`);
        }

        const data: Album = await res.json();
        setAlbum(data);
      } catch (err: unknown) {
        setAlbumError(
          err instanceof Error ? err.message : "Error loading album"
        );
        setAlbum(null);
      } finally {
        setAlbumLoading(false);
      }
    }

    void loadAlbum();
  }, [albumIdNumber]);

  // -------- Load tracks for this album --------
  useEffect(() => {
    if (Number.isNaN(albumIdNumber)) {
      setTracks([]);
      setTracksLoading(false);
      setTracksError("Invalid album id.");
      return;
    }

    async function loadTracks() {
      setTracksLoading(true);
      setTracksError(null);

      try {
        const base = process.env.NEXT_PUBLIC_API_URL;
        if (!base) throw new Error("NEXT_PUBLIC_API_URL is not set");

        const res = await fetch(`${base}/api/tracks?albumId=${albumIdNumber}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to load tracks (${res.status})`);
        }

        const data: Track[] = await res.json();
        setTracks(data);
      } catch (err: unknown) {
        setTracksError(
          err instanceof Error ? err.message : "Error loading tracks"
        );
        setTracks([]);
      } finally {
        setTracksLoading(false);
      }
    }

    void loadTracks();
  }, [albumIdNumber]);

  // -------- Render states for album --------
  if (albumLoading) {
    return <div className="container py-4">Loading album…</div>;
  }

  if (albumError || !album) {
    return (
      <div className="container text-center py-5">
        <h3>Album not found.</h3>
        {albumError && (
          <p className="text-danger small mt-2">{albumError}</p>
        )}
        <button
          className="btn btn-primary mt-3"
          onClick={() => router.push("/")}
        >
          Back to Home
        </button>
      </div>
    );
  }

  // -------- Main layout: album card + wide tracks table --------
  return (
    <div className="container py-4">
      <h2 className="mb-4">Album Details for {album.title}</h2>

      <div className="row g-4">
        {/* LEFT: Album card */}
        <div className="col-md-4 col-lg-3">
          <div className="card shadow-sm h-100 border-0">
            <div
              className="rounded-top"
              style={{
                width: "100%",
                height: 260,
                backgroundColor: "#f8f9fa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={
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
                onError={(e) => {
                  e.currentTarget.src = "/assets/placeholder.png";
                }}
              />
            </div>

            <div className="card-body">
              <h4 className="card-title mb-1">{album.title}</h4>
              <p className="text-muted mb-2">
                <strong>{album.artist}</strong> • {album.year}
              </p>

              <p
                className="card-text mb-3"
                style={{ fontSize: "0.95rem", whiteSpace: "pre-wrap" }}
              >
                {album.description}
              </p>

              <button
                className="btn btn-warning w-100"
                onClick={() => router.push(`/edit/${album.id}`)}
              >
                Edit Album
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Tracks table */}
        <div className="col-md-8 col-lg-9">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Tracks</h4>
                <span className="text-muted small">
                  {tracksLoading
                    ? "Loading…"
                    : `${tracks.length} track${
                        tracks.length !== 1 ? "s" : ""
                      }`}
                </span>
              </div>

              {tracksError && (
                <p className="text-danger small mb-2">
                  Failed to load tracks: {tracksError}
                </p>
              )}

              {!tracksLoading && tracks.length === 0 && !tracksError && (
                <p className="text-muted mb-0">
                  No tracks yet for this album.
                </p>
              )}

              {!tracksLoading && tracks.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-hover table-sm align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "4rem" }}>#</th>
                        <th>Title</th>
                        <th style={{ width: "9rem" }} className="text-end">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tracks.map((track) => (
                        <tr
                          key={track.id}
                          style={{ cursor: "pointer" }}
                          onClick={() => router.push(`/tracks/${track.id}`)}
                        >
                          <td className="text-muted">{track.number}</td>
                          <td>{track.title}</td>
                          <td className="text-end">
                            <button
                              type="button"
                              className="btn btn-link btn-sm p-0"
                            >
                              View details &raquo;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p className="text-muted small mt-3 mb-0">
                Tip: Click any track row to view lyrics, video, and ratings for
                that song.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
