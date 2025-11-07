// src/lib/types.ts

export interface Track {
  id: number;
  title: string;
  lengthSec?: number;
}

export interface Album {
  id: number;                 // DB id (or albumId normalized to id)
  title: string;
  artist: string;
  year: number | string;      // number in DB, string in forms
  image?: string;
  imageUrl?: string;          // sometimes backend sends this instead
  description?: string;
  tracks?: Track[];
}

/**
 * When fetching from APIs that may return either `image` or `imageUrl`,
 * and year could be number or string, this is a safe type to use.
 * (It’s basically Album with relaxed image field.)
 */
export type AlbumResponse = Album & {
  imageUrl?: string;
};
