import express from 'express';
import authRoutes from './src/routes/auth.routes.js';
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ligado na porta ${PORT}`);
});