"use client";

import React, { useState, JSX } from "react";

interface Props {
  albumTitle?: string;
  albumDescription?: string;
  albumId: number;
  imgURL?: string;
  buttonText?: string;
  onClick: (albumId: number) => void;
}

export default function Card({
  albumTitle,
  albumDescription,
  albumId,
  imgURL,
  buttonText,
  onClick,
}: Props): JSX.Element {
  const [loaded, setLoaded] = useState<boolean>(false);

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    // Put a real placeholder in /public/assets/placeholder.png or change this path
    e.currentTarget.src = "/assets/placeholder.png";
    setLoaded(true);
  };

  const handleImgLoad = (): void => {
    setLoaded(true);
  };

  return (
    <div className="card album-card">
      <div className="img-wrapper">
        <img
          src={imgURL ?? "/assets/placeholder.png"}
          alt={albumTitle ?? "album cover"}
          className={`card-img-top album-img ${loaded ? "visible" : "hidden"}`}
          onLoad={handleImgLoad}
          onError={handleImgError}
          loading="lazy"
        />
      </div>
      <div className="card-body">
        <h5 className="card-title">{albumTitle ?? "Untitled"}</h5>
        <p className="card-text">{albumDescription ?? ""}</p>
        <button className="btn btn-primary" onClick={() => onClick(albumId)}>
          {buttonText ?? "OK"}
        </button>
      </div>
    </div>
  );
}
