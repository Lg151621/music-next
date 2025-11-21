// This is a Client Component because it uses React state, event handlers,
// and the Next.js router for navigation.
"use client";

import React, { useState, JSX } from "react";
import { useRouter } from "next/navigation";
import "@/components/App.css";

// Shape of a single track in the "tracks" list for this new album.
interface Track {
  title: string;
  duration: string;
}

// Optional callback prop that lets a parent component respond
// when a new album has been successfully created.
interface Props {
  onNewAlbum?: (navigateBack?: () => void) => void;
}

export default function NewAlbum({ onNewAlbum }: Props): JSX.Element {
  // --------------------- Album form state ---------------------
  const [albumTitle, setAlbumTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  // Tracks for this album (title + duration).
  // Start with one empty track by default.
  const [tracks, setTracks] = useState<Track[]>([{ title: "", duration: "" }]);

  // Holds success or error messages shown above the form.
  const [message, setMessage] = useState("");

  const router = useRouter();

  // Add a new empty track row to the form.
  const addTrack = (): void =>
    setTracks([...tracks, { title: "", duration: "" }]);

  // Update a specific field (title or duration) for a specific track.
  const updateTrack = (index: number, field: keyof Track, value: string): void => {
    const updated = [...tracks];
    updated[index][field] = value;
    setTracks(updated);
  };

  // --------------------- Form submit handler ---------------------
  const handleFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault(); // Prevent the default full page reload.

    try {
      // 1) Create the album itself
      const albumRes = await fetch("/api/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: albumTitle,
          artist,
          year,
          image,
          description,
        }),
      });

      if (!albumRes.ok) throw new Error("Album creation failed");
      const albumData = await albumRes.json(); // should contain the new album's id

      // 2) Create each track for this album (if it has a title)
      for (const track of tracks) {
        if (track.title.trim()) {
          await fetch("/api/tracks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...track, album_id: albumData.id }),
          });
        }
      }

      setMessage("✅ Album and tracks created successfully! Redirecting...");

      // After a delay, either let parent handle navigation or go back home.
      setTimeout(() => {
        if (onNewAlbum) {
          // Parent can optionally control what happens next.
          onNewAlbum(() => router.push("/"));
        } else {
          router.push("/");
        }
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error creating album.");
    }
  };

  return (
    <div className="container py-4">
      <div
        className="card shadow-sm p-4"
        style={{ maxWidth: "700px", margin: "0 auto" }}
      >
        <h2 className="text-center mb-4">🎵 Create a New Album</h2>

        {/* Show success or error messages above the form */}
        {message && (
          <div
            className={`alert ${
              message.includes("✅") ? "alert-success" : "alert-danger"
            } text-center`}
          >
            {message}
          </div>
        )}

        {/* --------------------- Album form --------------------- */}
        <form onSubmit={handleFormSubmit}>
          {/* Album title + artist */}
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Album Title</label>
              <input
                type="text"
                className="form-control"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                placeholder="Enter album title"
              />
            </div>

            <div className="col">
              <label className="form-label">Artist</label>
              <input
                type="text"
                className="form-control"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Enter artist name"
              />
            </div>
          </div>

          {/* Year + image URL */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">Year</label>
              <input
                type="text"
                className="form-control"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2002"
              />
            </div>

            <div className="col-md-8">
              <label className="form-label">Image URL</label>
              <input
                type="text"
                className="form-control"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Paste album cover URL"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short album description..."
            />
          </div>

          {/* --------------------- Tracks section --------------------- */}
          <h4 className="mt-4 mb-3 text-primary">🎶 Tracks</h4>
          {tracks.map((track, i) => (
            <div className="row mb-2" key={i}>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Track title"
                  value={track.title}
                  onChange={(e) => updateTrack(i, "title", e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Duration (e.g. 3:45)"
                  value={track.duration}
                  onChange={(e) => updateTrack(i, "duration", e.target.value)}
                />
              </div>
            </div>
          ))}

          {/* Button to add another blank track row */}
          <div className="d-flex justify-content-end mb-3">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={addTrack}
            >
              + Add Track
            </button>
          </div>

          {/* --------------------- Form actions --------------------- */}
          <div className="d-flex justify-content-between">
            {/* Cancel: just go back to the homepage without saving */}
            <button
              type="button"
              className="btn btn-light"
              onClick={() => router.push("/")}
            >
              Cancel
            </button>

            {/* Submit: triggers album + tracks creation */}
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
