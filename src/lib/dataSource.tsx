// src/lib/dataSource.ts
import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://cst-391-music-app.vercel.app"; // 👈 point directly to your backend

export default axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});
