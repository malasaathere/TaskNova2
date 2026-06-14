require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { connectDB } = require('./config/database');
const { initWebSocket } = require('./utils/websocket');
const isTest = process.env.NODE_ENV === 'test'; 

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// ── Security middleware ──────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { errorCode: 'RATE_LIMIT', message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

// Auth endpoint stricter limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { errorCode: 'RATE_LIMIT', message: 'Too many login attempts' },
});
app.use('/api/auth/login', authLimiter);

// ── Body parsing ─────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── API Docs ─────────────────────────────────────────────────────────
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Routes ───────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ errorCode: 'NOT_FOUND', message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    errorCode: 'SERVER_ERROR',
    message: 'An unexpected error occurred',
    description: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ── Start server ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

 if (!isTest) {
  initWebSocket(server);
}

if (require.main === module) {
  startServer();
}

async function startServer() {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📖 API Docs: http://localhost:${PORT}/api/docs\n`);
    });
  } catch (err) {
    console.error('Server failed to start:', err.message);
    process.exit(1);
  }
}

module.exports = app;
