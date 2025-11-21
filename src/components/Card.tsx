// This is a Client Component because it uses React state and event handlers.
"use client";

import React, { useState, JSX } from "react";

interface Props {
  albumTitle?: string;                 // Optional: title text
  albumDescription?: string;           // Optional: description text
  albumId: number;                     // Required: used in the click handler
  imgURL?: string;                     // Optional: image URL (can fallback)
  buttonText?: string;                 // Optional: label for the button
  onClick: (albumId: number) => void;  // Required callback function
}

// Reusable card component used to display album info with a button.
// This works across the app anywhere we want a clickable album UI element.
export default function Card({
  albumTitle,
  albumDescription,
  albumId,
  imgURL,
  buttonText,
  onClick,
}: Props): JSX.Element {
  
  // Tracks whether the image has finished loading (controls CSS visibility)
  const [loaded, setLoaded] = useState<boolean>(false);

  // Called if the image fails to load:
  // Switch the image source to a placeholder
  const handleImgError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ): void => {
    e.currentTarget.src = "/assets/placeholder.png";
    setLoaded(true);
  };

  // Called once the image successfully loads
  const handleImgLoad = (): void => {
    setLoaded(true);
  };

  return (
    <div className="card album-card">
      <div className="img-wrapper">
        <img
          src={imgURL ?? "/assets/placeholder.png"}        // Default image if missing
          alt={albumTitle ?? "album cover"}                // Accessible image alt text
          className={`card-img-top album-img ${loaded ? "visible" : "hidden"}`}
          onLoad={handleImgLoad}                           // When the image loads
          onError={handleImgError}                         // If the image fails
          loading="lazy"                                   // Improves performance
        />
      </div>

      <div className="card-body">
        <h5 className="card-title">{albumTitle ?? "Untitled"}</h5>
        <p className="card-text">{albumDescription ?? ""}</p>

        {/* Button that triggers the callback from parent component */}
        <button className="btn btn-primary" onClick={() => onClick(albumId)}>
          {buttonText ?? "OK"}
        </button>
      </div>
    </div>
  );
}
