// src/lib/dataSource.ts
import axios from "axios";

export default axios.create({
  // call "/api/..." and let Next.js rewrite to your backend
  baseURL: "",
  headers: { "Content-Type": "application/json" },
});
