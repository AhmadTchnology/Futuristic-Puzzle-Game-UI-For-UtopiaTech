// Centralized API Configuration
// This ensures all components use the same API endpoint

export const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    console.error("VITE_API_URL is not defined in the environment variables.");
}
