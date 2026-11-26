const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/projects.routes');
const competitionsRoutes = require('./routes/competitions.routes')

const app = express();

// Middlewares
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json({ limit: '5mb' }));

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/competitions', competitionsRoutes)

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`CAI Lab Backend server running on port ${PORT}`);
});

const { uploadDir } = require('./middleware/upload');
app.use('/uploads', express.static(uploadDir));
app.use('/api/lab-photos', require('./routes/lab-photos.routes'));

app.use('/api/products', require('./routes/products.routes'));
