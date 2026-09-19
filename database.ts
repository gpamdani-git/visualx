import { createClient, type Client } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'canvas.db');

let db: Client;

export function getDb(): Client {
  if (!db) {
    db = createClient({ url: `file:${DB_PATH}` });
  }
  return db;
}

export async function initDb(): Promise<void> {
  const client = getDb();

  await client.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      thumbnail TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      data TEXT NOT NULL
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS folders (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      data TEXT NOT NULL
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS custom_libraries (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

  console.log('[DB] SQLite initialized at ' + DB_PATH);
}

// Projects
export async function dbGetAllProjects() {
  const client = getDb();
  const result = await client.execute('SELECT * FROM projects ORDER BY updated_at DESC');
  return result.rows.map((r: any) => ({
    ...(JSON.parse(r.data as string)),
    id: r.id,
    name: r.name,
    thumbnail: r.thumbnail,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

export async function dbGetProject(id: string) {
  const client = getDb();
  const result = await client.execute({ sql: 'SELECT * FROM projects WHERE id = ?', args: [id === undefined ? null : id] });
  if (result.rows.length === 0) return null;
  const r = result.rows[0] as any;
  return { ...(JSON.parse(r.data as string)), id: r.id, name: r.name, thumbnail: r.thumbnail };
}

export async function dbUpsertProject(project: any) {
  const client = getDb();
  const { id, name, thumbnail, createdAt, updatedAt, ...rest } = project;
  const now = updatedAt || Date.now();
  
  const args = [
    id ?? null,
    name ?? 'Untitled',
    thumbnail ?? null,
    createdAt || now,
    now,
    JSON.stringify(rest) ?? '{}'
  ].map(v => v === undefined ? null : v);

  await client.execute({
    sql: `INSERT INTO projects (id, name, thumbnail, created_at, updated_at, data)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            thumbnail = excluded.thumbnail,
            updated_at = excluded.updated_at,
            data = excluded.data`,
    args,
  });
}

export async function dbDeleteProject(id: string) {
  const client = getDb();
  await client.execute({ sql: 'DELETE FROM projects WHERE id = ?', args: [id === undefined ? null : (id ?? null)] });
}

// Folders
export async function dbGetAllFolders() {
  const client = getDb();
  const result = await client.execute('SELECT * FROM folders ORDER BY created_at ASC');
  return result.rows.map((r: any) => ({
    ...(JSON.parse(r.data as string)),
    id: r.id,
    name: r.name,
  }));
}

export async function dbUpsertFolder(folder: any) {
  const client = getDb();
  const { id, name, createdAt, ...rest } = folder;
  const now = createdAt || Date.now();
  
  const args = [
    id ?? null,
    name ?? 'Untitled Folder',
    now,
    JSON.stringify(rest) ?? '{}'
  ].map(v => v === undefined ? null : v);

  await client.execute({
    sql: `INSERT INTO folders (id, name, created_at, data)
          VALUES (?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET name = excluded.name, data = excluded.data`,
    args,
  });
}

export async function dbDeleteFolder(id: string) {
  const client = getDb();
  await client.execute({ sql: 'DELETE FROM folders WHERE id = ?', args: [id === undefined ? null : (id ?? null)] });
}

// Custom Libraries
export async function dbGetCustomLibraries() {
  const client = getDb();
  const result = await client.execute('SELECT data FROM custom_libraries LIMIT 1');
  if (result.rows.length === 0) return [];
  return JSON.parse((result.rows[0] as any).data as string);
}

export async function dbSaveCustomLibraries(libs: any[]) {
  const client = getDb();
  const strLibs = JSON.stringify(libs);
  const args = [strLibs === undefined ? null : strLibs, Date.now()];
  await client.execute({
    sql: `INSERT INTO custom_libraries (id, data, updated_at) VALUES ('main', ?, ?)
          ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
    args,
  });
}
