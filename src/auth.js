/* eslint-disable no-unused-vars */
// src/auth.js
// Simple JWT helpers for the frontend

const TOKEN_KEY = "token";

/**
 * Save JWT to localStorage
 * @param {string} token
 */
export function saveToken(token) {
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Get JWT from localStorage
 * @returns {string|null}
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Remove JWT (logout)
 */
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Convenience: parse JWT payload (not secure, just for UI)
 * @returns {object|null}
 */
export function parseToken() {
  const t = getToken();
  if (!t) return null;
  try {
    const payload = t.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch (e) {
    return null;
  }
}

/**
 * Sample asset URL (uploaded assignment PDF) for testing file previews/downloads in dev.
 * The runtime will convert this local path to a URL.
 */
export const SAMPLE_ASSET_URL = "/mnt/data/Online Lecture Scheduling Module (2) (2) (1).pdf";
