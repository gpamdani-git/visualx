import { createClient } from '@libsql/client';
const db = createClient({ url: 'file:canvas.db' });
try {
  let project = { id: 'test', name: 'Test' };
  const { id, name, thumbnail, createdAt, updatedAt, ...rest } = project;
  const now = updatedAt || Date.now();
  console.log("Args:", [
    id ?? null,
    name ?? 'Untitled',
    thumbnail ?? null,
    createdAt || now,
    now,
    JSON.stringify(rest) ?? '{}'
  ]);
  await db.execute({
    sql: `INSERT INTO projects (id, name, thumbnail, created_at, updated_at, data)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      id ?? null,
      name ?? 'Untitled',
      thumbnail ?? null,
      createdAt || now,
      now,
      JSON.stringify(rest) ?? '{}'
    ],
  });
  console.log("Success");
} catch (e) {
  console.error("Error:", e.message);
}
