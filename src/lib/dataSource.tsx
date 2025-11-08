import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const dataSource = axios.create({
  baseURL: baseURL, 
  headers: { "Content-Type": "application/json" },
});

export default dataSource;
