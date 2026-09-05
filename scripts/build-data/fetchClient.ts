import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import pLimit from "p-limit";

const CACHE_DIR = path.resolve(import.meta.dirname, "../../data/cache");
const POKEAPI_BASE = "https://pokeapi.co/api/v2";
const limit = pLimit(6);

function cacheKeyFor(url: string): string {
  return createHash("sha1").update(url).digest("hex");
}

async function readCache(url: string): Promise<unknown | null> {
  const file = path.join(CACHE_DIR, `${cacheKeyFor(url)}.json`);
  try {
    const raw = await readFile(file, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeCache(url: string, data: unknown): Promise<void> {
  await mkdir(CACHE_DIR, { recursive: true });
  const file = path.join(CACHE_DIR, `${cacheKeyFor(url)}.json`);
  await writeFile(file, JSON.stringify(data), "utf-8");
}

async function fetchWithRetry(url: string, attempt = 1): Promise<unknown> {
  const res = await fetch(url);
  if (res.status === 429 && attempt <= 5) {
    const backoffMs = attempt * 1000;
    await new Promise((resolve) => setTimeout(resolve, backoffMs));
    return fetchWithRetry(url, attempt + 1);
  }
  if (!res.ok) {
    throw new Error(`PokeAPI request failed (${res.status}): ${url}`);
  }
  return res.json();
}

let requestCount = 0;
let cacheHitCount = 0;

/** Fetches a PokeAPI path (e.g. "/pokemon-species/25") with on-disk caching + bounded concurrency. */
export async function pokeApiFetch<T = unknown>(pathOrUrl: string): Promise<T> {
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `${POKEAPI_BASE}${pathOrUrl}`;
  const cached = await readCache(url);
  if (cached !== null) {
    cacheHitCount++;
    return cached as T;
  }
  return limit(async () => {
    const cachedAfterWait = await readCache(url);
    if (cachedAfterWait !== null) {
      cacheHitCount++;
      return cachedAfterWait as T;
    }
    requestCount++;
    const data = await fetchWithRetry(url);
    await writeCache(url, data);
    return data as T;
  });
}

export function getFetchStats() {
  return { requestCount, cacheHitCount };
}
