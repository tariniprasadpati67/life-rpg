import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import questRoutes from './routes/quests.js';
import progressRoutes from './routes/progress.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.options('*', cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    }
  });
  next();
});

// Serve frontend in production, or redirect to Vite dev server in development
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
} else {
  app.get('/', (req, res) => {
    res.redirect('http://localhost:5173');
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Life RPG Server'
  });
});

// API Routes
app.use('/api/quests', questRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/auth', authRoutes);

// In production, forward non-API GET requests to SPA index.html
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 [Unhandled Server Error]:', err);
  res.status(500).json({
    success: false,
    error: 'An unexpected internal error occurred in the neural network.'
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 [Life RPG Server] Operational on port ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
});

// Convenience redirects to port 5173 for common ports in local dev only
if (process.env.NODE_ENV !== 'production') {
  [3000, 8080, 80].forEach((p) => {
    try {
      const forwarder = http.createServer((req, res) => {
        res.writeHead(302, { Location: `http://localhost:5173${req.url}` });
        res.end();
      });
      forwarder.listen(p, '0.0.0.0', () => {
        console.log(`🔗 [Port ${p} Forwarder] Redirecting http://localhost:${p} -> http://localhost:5173`);
      });
      forwarder.on('error', () => {
        // Port occupied or requires higher privileges, gracefully ignore
      });
    } catch (e) {}
  });
}
