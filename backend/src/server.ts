import app from './app';
import { DB } from './config/db';

const PORT = process.env.PORT || 3000;

DB.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar la base de datos', error);
    process.exit(1);
  });
