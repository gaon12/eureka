import type { ApiEnvelope } from "../types/api";

export async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, init);
  const data = await readJson<T>(response);

  if (!response.ok) {
    const envelope = data as ApiEnvelope<unknown>;
    const status = typeof envelope.status === "number" ? envelope.status : response.status;
    throw new Error(`Request failed with status ${status}`);
  }

  return data;
}

export function hasResults<T>(value: ApiEnvelope<T>): value is ApiEnvelope<T> & { results: T } {
  return value.results !== undefined;
}
