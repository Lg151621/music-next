import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "https://cst-391-music-app.vercel.app";

const dataSource = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export default dataSource;
