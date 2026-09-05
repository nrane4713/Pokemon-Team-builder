import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

const GENERATED_DIR = path.join(process.cwd(), "data", "generated");

/** Reads and JSON-parses a file under data/generated/, memoized per request via React's cache(). */
export const readGeneratedJson = cache(async <T>(relativePath: string): Promise<T> => {
  const raw = await readFile(path.join(GENERATED_DIR, relativePath), "utf-8");
  return JSON.parse(raw) as T;
});
