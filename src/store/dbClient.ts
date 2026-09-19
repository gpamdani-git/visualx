/**
 * dbClient.ts — thin wrapper around /api/db/* endpoints
 * Replaces all localStorage calls in projectStore and libraryStore
 */

const BASE = '/api/db';

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Projects ─────────────────────────────────────────────────────────────────
export const db = {
  projects: {
    getAll: ()              => req<any[]>('GET',    '/projects'),
    get:    (id: string)    => req<any>  ('GET',    `/projects/${id}`),
    save:   (project: any)  => req<void> ('POST',   '/projects', project),
    delete: (id: string)    => req<void> ('DELETE', `/projects/${id}`),
  },

  folders: {
    getAll: ()              => req<any[]>('GET',    '/folders'),
    save:   (folder: any)   => req<void> ('POST',   '/folders', folder),
    delete: (id: string)    => req<void> ('DELETE', `/folders/${id}`),
  },

  libraries: {
    getAll: ()              => req<any[]>('GET',    '/libraries'),
    saveAll: (libs: any[])  => req<void> ('POST',   '/libraries', libs),
  },
};
