// This is a Client Component because it uses React hooks (useState, useEffect)
// and browser-only features like the Next.js router.
// A prop is a value passed into a component so it can work with information given by its parent.
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/components/App.css";
import type { AlbumResponse } from "@/lib/types";
import { get, put } from "@/lib/apiClient";

// Local shape used for the edit form state.
// We keep everything as strings so it's easy to bind to inputs.
type AlbumState = {
  title: string;
  artist: string;
  year: string;
  image: string;
  description: string;
  tracks?: unknown[];
};

// This component requires an albumId string and optionally accepts an onSaved callback.
// The question mark makes the prop optional. TypeScript props make my components predictable and strongly typed.
interface Props {
  albumId: string;
  onSaved?: () => void;
}

export default function EditAlbum({ albumId, onSaved }: Props) {
  const router = useRouter();

  // React state that holds the current values in the edit form.
  const [album, setAlbum] = useState<AlbumState>({
    title: "",
    artist: "",
    year: "",
    image: "",
    description: "",
  });

  // Holds success or error messages to show above the form.
  const [message, setMessage] = useState<string>("");

  // ------------------------------------------------------------
  // Load the album data from the backend when the component mounts
  // or when the albumId changes.
  // ------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Fetch a single album: GET /api/albums/[id]
        const data = await get<AlbumResponse>(`/albums/${albumId}`);
        if (cancelled) return;

        // Populate the form state with the album data.
        // We convert everything into strings where needed (for inputs).
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
          setMessage(msg);
        }
      }
    })();

    // Cleanup: avoid setting state if this component unmounts.
    return () => {
      cancelled = true;
    };
  }, [albumId]);

  // ------------------------------------------------------------
  // Handle user typing into any input or textarea.
  // This keeps the form inputs "controlled" by React state.
  // ------------------------------------------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    // Update only the changed field while keeping the rest of the album state.
    setAlbum((prev) => ({ ...prev, [name]: value }));
  };

  // ------------------------------------------------------------
  // Handle form submission: send updated data to the backend.
  // ------------------------------------------------------------
  const handleFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault(); // Stop the browser from doing a full page reload.

    try {
      // Convert the form state into the shape expected by the API.
      const updatedAlbum = {
        artist: album.artist,
        title: album.title,
        description: album.description,
        image: album.image || "",
        year: album.year ? parseInt(album.year, 10) : null,
        tracks: album.tracks ?? [],
      };

      // PUT /api/albums/[id] → update album in the database
      await put(`/albums/${albumId}`, updatedAlbum);

      setMessage("✅ Album updated successfully! Redirecting...");

      // After a short delay, run the optional callback and return to home.
      setTimeout(() => {
        onSaved?.();          // Call onSaved if it was provided
        router.push("/");     // Navigate back to the homepage
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

        {/* Show success or error status above the form */}
        {message && (
          <div
            className={`alert ${
              message.includes("✅") ? "alert-success" : "alert-danger"
            } text-center`}
          >
            {message}
          </div>
        )}

        {/* Controlled form bound to the album state */}
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
            {/* Cancel just navigates back without saving */}
            <button
              type="button"
              className="btn btn-light"
              onClick={() => router.push("/")}
            >
              Cancel
            </button>

            {/* Submit button triggers the PUT request to update the album */}
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
