import cors from 'cors';
import express, { Application } from 'express';
import morgan from 'morgan';
import path from 'node:path';
import authRoutes from './routes/auth.routes';
import reportesRoutes from './routes/reporte.routes';
import statisticsRoutes from './routes/statistics.routes';
import usuarioRoutes from './routes/usuario.routes';

const app: Application = express();

app.use('/uploads', express.static(path.resolve('./uploads')));

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
  }),
);

app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/auth', authRoutes);
app.use('/reports', reportesRoutes);
app.use('/users', usuarioRoutes);
app.use('/statistics', statisticsRoutes);

export default app;
