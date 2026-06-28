const RAW_API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL?.toString()?.trim() || "";

const API_BASE = RAW_API_BASE.replace(/\/+$/, "");

export class ApiRequestError extends Error {
  readonly status: number;

  constructor(path: string, status: number, details = "") {
    super(`API ${path} failed: ${status}${details ? ` ${details}` : ""}`);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

export function apiUrl(path: string) {
  if (!path.startsWith("/")) path = "/" + path;
  return API_BASE ? `${API_BASE}${path}` : path;
}

export async function postJson<T>(path: string, body: any): Promise<T> {
  const controller = new AbortController();
  const timeoutMs = Number((import.meta as any).env?.VITE_API_TIMEOUT_MS || 30000);
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  const res = await fetch(apiUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
    signal: controller.signal,
  });

  window.clearTimeout(timer);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const msg = text?.slice(0, 500) || "";
    throw new ApiRequestError(path, res.status, msg);
  }

  return res.json() as Promise<T>;
}
