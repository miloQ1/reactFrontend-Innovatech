# EduTech — Frontend MVP

Maqueta frontend de la plataforma **EduTech**, una SPA para gestión de proyectos colaborativos académicos. Construida con datos mock para poder navegar y probar todos los flujos sin backend real.

---

## 🚀 Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| **Vite** | ^6.x | Build tool y dev server |
| **React** | ^19.x | UI framework |
| **TypeScript** | ~5.x | Tipado estático |
| **React Router DOM** | ^7.x | Enrutamiento SPA |
| **CSS Modules** | — | Estilos locales por componente |

> Sin Tailwind · Sin Redux · Sin librerías de UI externas

---

## 📦 Qué contiene el frontend

### Páginas

| Página | Ruta | Descripción |
|---|---|---|
| `LoginPage` | `/login` | Formulario de inicio de sesión |
| `RegisterPage` | `/register` | Formulario de registro de usuario |
| `DashboardPage` | `/dashboard` | Resumen de actividad del usuario |
| `MyProjectsPage` | `/projects` | Lista de proyectos del usuario |
| `CreateProjectPage` | `/projects/create` | Formulario de creación de proyecto |
| `ProjectDetailPage` | `/projects/:id` | Detalle del proyecto, miembros e invitaciones |
| `InvitationsPage` | `/invitations` | Invitaciones pendientes con aceptar/rechazar |

### Componentes

**Auth**
- `AuthFormContainer` — Contenedor visual para formularios de autenticación
- `LoginForm` — Campos de email y password
- `RegisterForm` — Campos de userName, nombre, email y password

**Proyectos**
- `ProjectCard` — Tarjeta individual con nombre, descripción y rol (MASTER/MEMBER)
- `ProjectList` — Grilla de ProjectCards
- `CreateProjectForm` — Formulario de nombre y descripción
- `MemberList` — Lista de miembros del proyecto con rol y fecha
- `InviteUserForm` — Formulario para invitar por userName

**Invitaciones**
- `InvitationList` — Lista de invitaciones con acciones aceptar/rechazar o badge de estado

**Shared**
- `Navbar` — Barra superior con logo, usuario y logout
- `Sidebar` — Navegación lateral con badge de invitaciones pendientes
- `EmptyState` — Estado vacío reutilizable con icono y acción
- `ProtectedRoute` — Wrapper que redirige a `/login` si no hay sesión

### Layouts

| Layout | Descripción |
|---|---|
| `AuthLayout` | Fondo degradado centrado para Login/Register. Redirige al dashboard si ya hay sesión |
| `AppLayout` | Navbar fijo + Sidebar lateral + área de contenido. Solo accesible autenticado |

### Estructura de carpetas

```
src/
├── api/           # Servicios (mocks hoy, APIs reales mañana)
├── components/    # Componentes reutilizables por dominio
│   ├── auth/
│   ├── invitations/
│   ├── projects/
│   └── shared/
├── context/       # AuthContext (Provider de sesión)
├── hooks/         # useAuth
├── layouts/       # AuthLayout, AppLayout
├── mocks/         # Datos simulados (users, projects, invitations)
├── pages/         # Una página por ruta
├── routes/        # AppRouter (rutas públicas y privadas)
├── styles/        # globals.css con design tokens
└── types/         # Interfaces TypeScript (auth, project, invitation)
```

### Tipos TypeScript

- `User`, `LoginRequest`, `RegisterRequest`, `AuthResponse`
- `Project`, `ProjectMember`, `CreateProjectRequest`, `MemberRole`
- `Invitation`, `InviteUserRequest`, `InvitationStatus`

### Servicios Mock

| Servicio | Flujos simulados |
|---|---|
| `authService` | `login`, `register`, `me`, `logout` |
| `projectService` | `getMyProjects`, `getProjectById`, `createProject`, `getProjectMembers` |
| `invitationService` | `getMyInvitations`, `getSentInvitations`, `inviteUser`, `acceptInvitation`, `rejectInvitation` |

---

## 🧪 Usuarios de prueba

| Email | Password | userName | Rol |
|---|---|---|---|
| `john@edutech.com` | `123456` | `jdoe` | MASTER del proyecto "EduTech Platform" |
| `alice@edutech.com` | `123456` | `asmith` | MEMBER del proyecto |
| `bob@edutech.com` | `123456` | `bwilson` | Invitación PENDING |
| `carol@edutech.com` | `123456` | `cmartinez` | Invitación ACCEPTED |

---

## ▶️ Cómo correr el proyecto

```bash
npm install
npm run dev
```

La app estará disponible en `http://localhost:5173`

---

## 🔌 Conectar con el backend real

Cuando los microservicios estén listos, solo hay que:

1. Crear `src/api/httpClient.ts` con `fetch` o `axios` configurado con la `baseURL` y el token Bearer.
2. Reemplazar las implementaciones en `authService.ts`, `projectService.ts` e `invitationService.ts` para que llamen a los endpoints reales.
3. Agregar `.env.local` con `VITE_API_URL=http://localhost:8080`.

Los componentes y páginas **no requieren cambios** — solo consumen los servicios a través de la misma interfaz.
