# Gold Cargo Smart

Plataforma de cotización y gestión de carga marítima internacional para empresas de freight forwarding. Permite a los clientes solicitar cotizaciones de envíos y a los administradores gestionar tarifas, ingresos y el historial de cotizaciones.

---

## Características principales

### Área pública
- **Formulario de cotización** en múltiples pasos:
  - Selección de tipo de carga: **LCL** (carga consolidada) o **FCL** (contenedor completo)
  - Elección de puertos de origen y destino
  - Cálculo automático de volumen y costos
  - Servicios adicionales: seguro de carga, recogida en origen, entrega en destino
  - **Generación de PDF** con el resumen de la cotización

### Dashboard administrativo (requiere autenticación)
- **Resumen general** — KPIs, estadísticas de cotizaciones y análisis de destinos con gráficos
- **Historial de cotizaciones** — Tabla con todas las cotizaciones enviadas y datos del cliente
- **Gestión de tarifas** — Carga de archivos Excel con tarifas por continente (Asia, América, Europa, Oceanía, África, Antártida)
- **Gestión de ingresos** — Registro de costos operacionales: BL filing, gastos en destino, collect fees, emisión BL destino

---

## Stack tecnológico

### Frontend (`spa/`)
| Tecnología | Versión | Uso |
|---|---|---|
| Vue 3 | latest | Framework principal (Composition API) |
| Vite | latest | Build tool |
| Pinia | latest | Estado global |
| Vue Router | latest | Enrutamiento |
| PrimeVue | 4.5.4 | Componentes UI (tema Aura) |
| Tailwind CSS | 4.2 | Estilos utilitarios |
| Chart.js | latest | Gráficos analíticos |
| jsPDF + AutoTable | latest | Generación de PDFs |
| XLSX | latest | Importación de archivos Excel |
| FontAwesome | latest | Íconos |

### Backend (`services/`)
| Tecnología | Versión | Uso |
|---|---|---|
| Node.js + Express | 5.2 | Servidor y API REST |
| MongoDB + Mongoose | 9.3 | Base de datos |
| JWT | latest | Autenticación |
| bcryptjs | latest | Hash de contraseñas |

### Infraestructura
- **pnpm workspaces** — Monorepo
- **Vercel** — Deploy del frontend (SPA con rewrites)
- **MongoDB Atlas** — Base de datos en la nube

---

## Estructura del proyecto

```
gold-cargo-smart/
├── spa/                        # Aplicación frontend
│   └── src/
│       ├── components/         # Componentes reutilizables
│       ├── views/
│       │   ├── Quote/          # Formulario de cotización (multi-step)
│       │   ├── Dashboard/      # Panel administrativo
│       │   ├── Login.vue
│       │   └── Register.vue
│       ├── stores/             # Estado global con Pinia
│       │   ├── auth.js         # Autenticación y JWT
│       │   ├── quote.js        # Estado del formulario de cotización
│       │   └── quoteHistory.js # Historial de cotizaciones
│       ├── composables/
│       │   └── useQuoteGenerator.js
│       ├── utils/
│       │   ├── api.js          # Wrapper de fetch con manejo de auth
│       │   ├── constants.js    # Países, puertos, tipos de carga
│       │   └── quotePdf.js     # Generación de PDF
│       └── router/
│
├── services/                   # API backend
│   └── src/
│       ├── models/             # Esquemas Mongoose
│       │   ├── User.js
│       │   ├── Quote.js
│       │   ├── Rate.js
│       │   ├── Income.js
│       │   └── QuoteStat.js
│       ├── controllers/
│       ├── routes/
│       ├── middlewares/        # Middleware de autenticación JWT
│       └── app.js
│
├── shared/                     # Utilidades compartidas
├── pnpm-workspace.yaml
└── vercel.json
```

---

## Instalación y desarrollo

### Requisitos previos
- Node.js >= 18
- pnpm >= 8
- MongoDB (local o Atlas)

### 1. Clonar e instalar dependencias

```bash
git clone <repo-url>
cd gold-cargo-smart
pnpm install
```

### 2. Variables de entorno

**`spa/.env`**
```env
VITE_API_URL=http://localhost:3000/api
```

**`services/.env`**
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/gold-cargo
PORT=3000
JWT_SECRET=tu_clave_secreta
```

### 3. Ejecutar en desarrollo

```bash
# Levanta frontend y backend en paralelo
pnpm dev
```

O por separado:

```bash
# Solo frontend (http://localhost:5173)
cd spa && pnpm dev

# Solo backend (http://localhost:3000)
cd services && pnpm dev
```

### 4. Build para producción

```bash
cd spa && pnpm build
```

---

## API — Endpoints principales

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Registro de usuario |
| `POST` | `/api/auth/login` | No | Login (retorna JWT) |
| `GET` | `/api/rates/:continent` | No | Tarifas por continente |
| `POST` | `/api/rates/:continent` | Sí | Actualizar tarifas |
| `GET` | `/api/quotes` | Sí | Historial de cotizaciones |
| `POST` | `/api/quotes` | No | Crear cotización |
| `GET` | `/api/quotes/count` | No | Contador global de cotizaciones |
| `GET` | `/api/income` | Sí | Ingresos operacionales |
| `POST` | `/api/income` | Sí | Registrar ingreso |

---

## Despliegue

### Frontend (Vercel)
El proyecto incluye `vercel.json` configurado con rewrites para SPA. Al conectar el repositorio en Vercel, se despliega automáticamente desde la carpeta `spa/`.

### Backend
Compatible con cualquier plataforma Node.js (Render, Railway, etc.). Requiere configurar las variables de entorno `MONGODB_URI`, `PORT` y `JWT_SECRET`.

---

## Identidad visual

| Token | Valor |
|---|---|
| Color primario | `#2C3D69` (azul marino) |
| Color de acento | `#FFCF25` (dorado) |
| UI Framework | PrimeVue — tema Aura personalizado |

---

## Historial de cambios relevantes

- Generación y exportación de cotizaciones en PDF con logo y cabecera de marca
- Integración de gráficos analíticos en el dashboard (cotizaciones y destinos)
- Gestión de tarifas mediante importación de Excel por continente
- Autenticación JWT con expiración de 2 horas y cierre de sesión automático
- Cabeceras de autorización automáticas en todas las peticiones autenticadas
- Refactorización del estado reactivo del dashboard usando `storeToRefs`
- Actualización de identidad visual: nuevo logo, color dorado `#FFCF25`, estilos responsive
- API de estadísticas de cotizaciones integrada al dashboard

---

## Licencia

Uso privado — Gold Cargo S.A.S.
