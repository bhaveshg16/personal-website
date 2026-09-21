import { google } from "@ai-sdk/google";

/**
 * Single place the LLM provider is chosen. Swapping providers (e.g. to
 * @ai-sdk/anthropic) is a change to this file only.
 *
 * Requires GOOGLE_GENERATIVE_AI_API_KEY in the environment.
 */
export const chatModel = google("gemini-2.5-flash");
