# CLAUDE.md - Project Guide for CBD-FE (order-tracker-fe)

## Project Overview
Order tracking and management SPA for a business called CBD. Built with React 18 + TypeScript + Vite. Deployed on Vercel.

## Commands
- `npm run dev` — Start dev server (Vite, port 5173)
- `npm run build` — TypeScript check + Vite production build (`tsc -b && vite build`)
- `npm run lint` — ESLint (flat config, ESLint 9)
- `npm run preview` — Preview production build locally
- No test framework is configured.

## Architecture

### Tech Stack
- **React 18** with TypeScript (strict mode)
- **Vite 5** as build tool
- **React Router v6** (`createBrowserRouter`) for routing
- **Styled-Components** for styling (with MUI components)
- **React Context API** for state management (no Redux/Zustand)
- **Axios** for HTTP requests
- **Formik + Yup** for form handling/validation
- **react-i18next** for internationalization (fallback language: Serbian `rs`)
- **Day.js** for date handling

### Project Structure
```
src/
├── api/                  # Axios clients + service layer
│   ├── client.tsx        # Public API client
│   ├── privateClient.tsx # Authenticated client (Bearer token, 498 interceptor)
│   └── services/         # API services (auth, orders, profile, banner)
├── components/           # Reusable UI components
├── pages/                # Page-level components (dashboard, login, home, etc.)
├── store/                # Context providers (Auth, Orders, Banner, Snackbar, Router)
├── hooks/                # Custom hooks (useHasPrivilege, usePagination, etc.)
├── services/             # Utilities (localStorage, event bus)
├── types/                # TypeScript type definitions
├── util/                 # Constants, breakpoints, status mappings
├── styles/               # Theme definition + styled.d.ts
├── i18n.js               # i18next config
└── main.tsx              # Entry point
```

### File Naming Conventions
- Components: `ComponentName.component.tsx`
- Styles: `ComponentName.styles.tsx` (some files have typo `.styes.tsx`)
- Context: `Entity.context.ts`
- Provider: `Entity.provider.tsx`
- Types: `PascalCase.ts` in `/types`

### Component Pattern
Each component is a folder containing its `.component.tsx` and `.styles.tsx` files. Styled-components are defined in the styles file and imported into the component.

### State Management
Five Context providers wrap the app in `App.tsx`:
- **AuthProvider** — login/logout, token management, listens to auth bus for token expiry
- **OrdersProvider** — orders CRUD, pagination, status history, payments
- **BannerProvider** — active banner management
- **SnackbarProvider** — toast notifications via MUI Snackbar
- **CBDRouter** — route definitions with public/private layout split

### Routing
- Public routes: `/`, `/track`, `/order-extension`, `/login`
- Private routes: `/dashboard`, `/createOrder`, `/profile` (protected by privilege checks)
- `PrivateRouteWrapper` guards authenticated routes
- `ProtectedRoute` checks specific user privileges

### API Layer
- Public client: `src/api/client.tsx` (base URL from `VITE_API_URL`)
- Private client: `src/api/privateClient.tsx` (adds Authorization header, handles 498 token expiry)
- Services in `src/api/services/` call the clients and return typed responses

### Styling
- **Theme**: dark background `#2F2F2F`, accent lime `#D4FF00` (defined in `src/styles/theme.ts`)
- Styled-components with `DefaultTheme` extension in `src/styles/styled.d.ts`
- Global styles in `src/globalStyles.ts` (scrollbar, MUI overrides, layout)
- Responsive breakpoints in `src/util/breakpoints.ts`
- BEM class naming used alongside styled-components

### Environment
- `VITE_API_URL` — backend API base URL (accessed via `import.meta.env.VITE_API_URL`)
- Translations loaded from external GitHub Pages: `ljubicjanko.github.io/CBD-Locales`

## Code Style
- **Prettier**: single quotes, 4-space tabs, trailing commas (es5), semicolons
- **ESLint**: flat config with typescript-eslint recommended + react-hooks + react-refresh
- **TypeScript**: strict mode, no unused locals/parameters, no fallthrough cases
- **Imports**: ES module style, barrel exports via `index.ts` in components
