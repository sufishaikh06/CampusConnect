require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/locations',   require('./routes/locations'));
app.use('/api/buildings',   require('./routes/buildings'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/faculty',     require('./routes/faculty'));
app.use('/api/navigation',  require('./routes/navigation'));
app.use('/api/panoramas',   require('./routes/panoramas'));
app.use('/api/chat',        require('./routes/chat'));
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/admin',       require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CampusConnect AI backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`CampusConnect AI backend running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
