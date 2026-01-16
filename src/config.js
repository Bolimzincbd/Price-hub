// src/config.js
const config = {
  // If we are in production (Vercel), use the Render URL.
  // If we are in development (Localhost), use localhost:5000.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000"
};

export default config;