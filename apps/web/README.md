# Web

Portfolio frontend: Next.js (Pages Router), Apollo Client, MUI + SCSS, next-i18next (en, ko), Motion, Lenis.

```bash
cp .env.example .env.local   # API address
pnpm dev:web                 # from the repo root → http://localhost:3000
```

Structure: `pages/` (routes, `_admin/` later), `apollo/` (client, store, `user|admin/query|mutation.ts`),
`libs/` (components, types, enums, hooks, config), `scss/` (`pc/`, `mobile/`), `public/locales/` (en, ko).
Motion rules: `docs/MOTION_REFERENCE.md`.
