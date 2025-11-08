import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3000"; // fallback for local dev

const dataSource = axios.create({
  baseURL: `${baseURL}/api`,
  headers: { "Content-Type": "application/json" },
});

export default dataSource;
