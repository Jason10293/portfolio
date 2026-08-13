import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

// Keep local development and the Vercel functions on the same validated token
// refresh path so configuration failures behave consistently.
export { getAccessToken } from "../api/_spotify.js";
