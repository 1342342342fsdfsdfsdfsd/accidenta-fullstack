import { DataSource } from 'typeorm';
import { DB } from '../src/config/db';
import { clearDatabase } from './routes/utils';

let connection: DataSource;

beforeAll(async () => {
  connection = await DB.initialize();
});

afterEach(async () => {
  await clearDatabase(connection);
});

afterAll(async () => {
  if (connection && connection.isInitialized) {
    await connection.destroy();
  }
});

// Exportar si lo necesitás en tests
export { connection };
