// Falls back to your local backend during development.
// In production, set VITE_API_URL in your .env.production (or your
// hosting provider's environment variables) to your Render URL.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
