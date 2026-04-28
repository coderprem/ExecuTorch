/**
 * Filled at bundle time from repo-root `.env`. First match wins:
 * `HF_INFERENCE_API_KEY`, `HF_API_KEY`, or `HF_TOKEN` (same Hub token).
 * See `babel-plugins/inline-env-from-dotenv.js`.
 */
const a = process.env.HF_INFERENCE_API_KEY ?? '';
const b = process.env.HF_API_KEY ?? '';
const c = process.env.HF_TOKEN ?? '';
export const HF_INFERENCE_API_KEY = (a || b || c).trim();
