import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import {
  initDb,
  dbGetAllProjects,
  dbGetProject,
  dbUpsertProject,
  dbDeleteProject,
  dbGetAllFolders,
  dbUpsertFolder,
  dbDeleteFolder,
  dbGetCustomLibraries,
  dbSaveCustomLibraries,
} from './database.js';
dotenv.config();

async function startServer() {
  // Initialize SQLite database first
  await initDb();

  const app = express();
  const PORT = 3001;

  app.use(express.json({ limit: '50mb' }));

  // API health check route FIRST
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // ── Database API: Projects ────────────────────────────────────────────────

  app.get('/api/db/projects', async (req, res) => {
    try {
      const projects = await dbGetAllProjects();
      res.json(projects);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/db/projects/:id', async (req, res) => {
    try {
      const project = await dbGetProject(req.params.id);
      if (!project) return res.status(404).json({ error: 'Not found' });
      res.json(project);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/db/projects', async (req, res) => {
    try {
      await dbUpsertProject(req.body);
      res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/db/projects/:id', async (req, res) => {
    try {
      await dbUpsertProject({ ...req.body, id: req.params.id });
      res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/db/projects/:id', async (req, res) => {
    try {
      await dbDeleteProject(req.params.id);
      res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── Database API: Folders ─────────────────────────────────────────────────

  app.get('/api/db/folders', async (req, res) => {
    try {
      const folders = await dbGetAllFolders();
      res.json(folders);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/db/folders', async (req, res) => {
    try {
      await dbUpsertFolder(req.body);
      res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/db/folders/:id', async (req, res) => {
    try {
      await dbDeleteFolder(req.params.id);
      res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── Database API: Custom Libraries ────────────────────────────────────────

  app.get('/api/db/libraries', async (req, res) => {
    try {
      const libs = await dbGetCustomLibraries();
      res.json(libs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/db/libraries', async (req, res) => {
    try {
      await dbSaveCustomLibraries(req.body);
      res.json({ ok: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── OpenRouter Proxy ──────────────────────────────────────────────────────

  app.get('/api/openrouter/models', async (req, res) => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models');
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/openrouter/chat', async (req, res) => {
    try {
      const { model, messages, apiKey } = req.body;
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`,
          'HTTP-Referer': 'https://aistudio.google.com',
          'X-Title': 'AI Studio Applet'
        },
        body: JSON.stringify({ model, messages, stream: true })
      });
      
      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: errText });
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      if (!response.body) {
         return res.end();
      }

      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } catch (err: any) {
      console.error('OpenRouter proxy error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: { systemInstruction }
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // ── Database API: Live Sync / Export to Hudbird UI ───────────────────────
  
  app.post('/api/export', async (req, res) => {
    try {
      const { code, filename, folder } = req.body;
      
      if (!code || !filename) {
        return res.status(400).json({ error: 'Code and filename are required' });
      }
      
      // Default export path for BlankUI- project
      const fs = await import('fs/promises');
      const baseExportPath = path.resolve('/Users/daniakbar/Documents/AISTUDIO APP/BlankUI-');
      
      // We will place the files inside src/app/(pages) if it's a Next.js app,
      // but since it's a Vite app, let's put them in src/pages/ (or similar configurable path).
      // According to typical Vite structures, we can put it in src/pages or src/components/generated.
      // We'll write to apps/docs/src/pages/ or src/components based on what's available.
      // Since it's an export, let's just write to BlankUI-/src/pages/ for now, creating it if it doesn't exist.
      
      const targetDir = path.join(baseExportPath, 'src', folder || 'pages');
      await fs.mkdir(targetDir, { recursive: true });
      
      const filePath = path.join(targetDir, filename.endsWith('.tsx') ? filename : `${filename}.tsx`);
      await fs.writeFile(filePath, code, 'utf-8');
      
      res.json({ ok: true, path: filePath });
    } catch (err: any) {
      console.error('Export error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      // Express owns the HTTP server in development, so Vite cannot accept
      // the preview's HMR WebSocket upgrade on its own.
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  const shutdown = () => {
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

