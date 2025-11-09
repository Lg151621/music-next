"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/components/App.css";
import type { AlbumResponse } from "@/lib/types";
import { get, put } from "@/lib/apiClient";

type AlbumState = {
  title: string;
  artist: string;
  year: string;
  image: string;
  description: string;
  tracks?: unknown[];
};

interface Props {
  albumId: string;
  onSaved?: () => void;
}

export default function EditAlbum({ albumId, onSaved }: Props) {
  const router = useRouter();

  const [album, setAlbum] = useState<AlbumState>({
    title: "",
    artist: "",
    year: "",
    image: "",
    description: "",
  });

  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await get<AlbumResponse>(`/albums/${albumId}`);
        if (cancelled) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAlbum({
          title: data.title ?? "",
          artist: data.artist ?? "",
          year: (data.year ?? "").toString(),
          image: data.image ?? data.imageUrl ?? "",
          description: data.description ?? "",
          tracks: data.tracks ?? [],
        });
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "❌ Error loading album from server.";
        if (!cancelled) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setMessage(msg);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [albumId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setAlbum((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      const updatedAlbum = {
        artist: album.artist,
        title: album.title,
        description: album.description,
        image: album.image || "",
        year: album.year ? parseInt(album.year, 10) : null,
        tracks: album.tracks ?? [],
      };

      await put(`/albums/${albumId}`, updatedAlbum);

      setMessage("✅ Album updated successfully! Redirecting...");
      setTimeout(() => {
        onSaved?.();
        router.push("/");
      }, 1200);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? `❌ ${err.message}` : "❌ Error updating album.";
      setMessage(msg);
    }
  };

  return (
    <div className="container py-4">
      <div
        className="card shadow-sm p-4"
        style={{ maxWidth: "700px", margin: "0 auto" }}
      >
        <h2 className="text-center mb-4">✏️ Edit Album</h2>

        {message && (
          <div
            className={`alert ${
              message.includes("✅") ? "alert-success" : "alert-danger"
            } text-center`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleFormSubmit}>
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Album Title</label>
              <input
                name="title"
                type="text"
                className="form-control"
                value={album.title}
                onChange={handleChange}
                placeholder="Enter album title"
              />
            </div>

            <div className="col">
              <label className="form-label">Artist</label>
              <input
                name="artist"
                type="text"
                className="form-control"
                value={album.artist}
                onChange={handleChange}
                placeholder="Enter artist name"
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">Year</label>
              <input
                name="year"
                type="text"
                className="form-control"
                value={album.year}
                onChange={handleChange}
                placeholder="e.g. 2002"
              />
            </div>

            <div className="col-md-8">
              <label className="form-label">Image URL</label>
              <input
                name="image"
                type="text"
                className="form-control"
                value={album.image}
                onChange={handleChange}
                placeholder="Paste album cover URL"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows={3}
              value={album.description}
              onChange={handleChange}
              placeholder="Write a short album description..."
            />
          </div>

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-light"
              onClick={() => router.push("/")}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
