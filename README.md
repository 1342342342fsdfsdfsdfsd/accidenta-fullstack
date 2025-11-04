# Accidenta - App Móvil de Reporte Y Alerta de Emergencias

Aplicación móvil enfocada en reducir drásticamente los tiempos de respuesta ante situaciones de emergencia.

### Funcionalidades principales
- Boton anti-panico para el envío instantáneo de notificaciones de urgencia a contactos de confianza.
- Geolocalización en tiempo real para una respuesta de ayuda inmediata y efectiva.
- Creación y visualización de reportes de emergencia con soporte de imágenes.
- Acceso a ficha médica con información vital al alcance de los servicios de emergencia.
- Visualización de estadisticas y tendencias de accidentes por zona, tipo y fecha.

### Tecnologías utilizadas
- Backend: Node.js, Express.js, TypeScript, PostgreSQL
- Frontend: React Native, Expo, Typescript
- Testing: Jest, Supertest, React Native Testing Library

### Habilidades principales
- Gestión de proyectos / Agile: Scrum con JIRA
- Testing QA: diseño de casos de prueba y ejecución de pruebas (unitarias, integración, humo y regresión).
- CI/CD: pipelines en GitHub Actions

### ¿Cómo descargar y ejecutar el proyecto?

#### Prerrequisitos:
- Tener instalado **Node.js** y **PostgreSQL**.

#### Instalación

#### 1. Backend

```bash
cd backend
npm install
```

Crear un archivo ".env" con:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=accidenta
PORT=3000
RESEND_API_KEY=<api_key>
```

```bash
npm run dev
```

#### 2. Frontend

```bash
cd frontend
npm install
```

Crear un archivo `.env` con:
```env
API_BASE_URL=http://<TU-IP-LOCAL>:3000/
```

```bash
npx expo start
```

Escaneá el QR con la app Expo Go en tu celular.

### Más información

Este proyecto fue desarrollado en grupo junto a 3 compañeros para la materia Elementos de Ingenieria de Software. Decidí crear este repositorio ya que no me fue posible hacer un fork del original.
