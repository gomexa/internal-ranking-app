# Ranking BFTC

Sistema de ranking interno para competencias de Field Target.

## Tecnologías

- **Next.js 14** - Framework React con App Router
- **Firebase** - Firestore para base de datos, Hosting para despliegue
- **Tailwind CSS** - Estilos
- **TypeScript** - Tipado estático

## Características

- Ranking de deportistas con cálculo ponderado de efectividad
- Gestión de eventos (oficiales e internos)
- Categorías automáticas: Master, Avanzado, Intermedio, Iniciado
- Panel de administración protegido
- Responsive design

## Requisitos

- Node.js 18+
- npm
- Firebase CLI (`npm install -g firebase-tools`)
- Cuenta de Firebase con proyecto configurado

## Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd RankingBFTC

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con las credenciales de Firebase
```

## Variables de entorno

Crear archivo `.env.local` con:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Desarrollo

```bash
# Servidor de desarrollo
npm run dev

# Abrir http://localhost:3000
```

## Despliegue

```bash
# Opción 1: Script automatizado
./deploy.sh

# Opción 2: Manual
npm run build
firebase deploy --only hosting
```

## Estructura del proyecto

```
├── app/                  # Páginas (App Router)
│   ├── page.tsx         # Ranking principal
│   ├── eventos/         # Gestión de eventos
│   ├── deportistas/     # Lista de deportistas
│   └── login/           # Autenticación admin
├── components/          # Componentes React
│   ├── events/          # Componentes de eventos
│   ├── layout/          # Header, Footer, Layout
│   ├── ranking/         # Tabla de ranking, badges
│   ├── shooters/        # Componentes de deportistas
│   └── ui/              # Componentes UI reutilizables
├── hooks/               # Custom hooks
├── lib/                 # Utilidades y servicios
│   ├── firebase.ts      # Configuración Firebase
│   ├── constants.ts     # Constantes del sistema
│   └── services/        # Servicios de datos
├── types/               # Definiciones TypeScript
└── public/              # Assets estáticos
```

## Cálculo del ranking

1. **Efectividad** = (blancos abatidos / blancos totales) × 100
2. **Efectividad ponderada** = efectividad × peso del evento
   - Eventos oficiales: peso 1.0
   - Eventos internos: peso 0.6
3. **Score final** = suma(efectividades ponderadas) / cantidad de eventos

## Categorías

| Categoría    | Rango de efectividad |
|--------------|---------------------|
| Master       | 80% - 100%          |
| Avanzado     | 65% - 79.99%        |
| Intermedio   | 50% - 64.99%        |
| Iniciado     | 0% - 50%            |

## Requisitos para clasificar

- Mínimo 4 eventos totales
- Mínimo 2 eventos oficiales
