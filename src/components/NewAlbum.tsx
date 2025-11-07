"use client";

import React, { useState, JSX } from "react";
import { useRouter } from "next/navigation";
import "@/components/App.css";

interface Track {
  title: string;
  duration: string;
}

interface Props {
  onNewAlbum?: (navigateBack?: () => void) => void;
}

export default function NewAlbum({ onNewAlbum }: Props): JSX.Element {
  const [albumTitle, setAlbumTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [tracks, setTracks] = useState<Track[]>([{ title: "", duration: "" }]);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const addTrack = (): void =>
    setTracks([...tracks, { title: "", duration: "" }]);

  const updateTrack = (index: number, field: keyof Track, value: string): void => {
    const updated = [...tracks];
    updated[index][field] = value;
    setTracks(updated);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
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
      const albumData = await albumRes.json();

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
      setTimeout(() => {
        if (onNewAlbum) {
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
      <div className="card shadow-sm p-4" style={{ maxWidth: "700px", margin: "0 auto" }}>
        <h2 className="text-center mb-4">🎵 Create a New Album</h2>

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
          {/* Album Info */}
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

          {/* Tracks */}
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

          <div className="d-flex justify-content-end mb-3">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={addTrack}
            >
              + Add Track
            </button>
          </div>

          {/* Actions */}
          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-light"
              onClick={() => router.push("/")}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
