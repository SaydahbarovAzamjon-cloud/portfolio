# Development Progress

## Phase 01 — Backend

- [x] Project initialization (NestJS `apps/api`, pnpm workspace)
- [x] Database configuration (Mongoose, env validation)
- [x] GraphQL configuration (Apollo 5, code-first, `health` query)
- [x] Data model (`docs/DATA_MODEL.md`, 15 Mongoose schemas + tests)
- [x] Restructure API to nestar conventions (`components/`, `schemas/`, `libs/`)
- [x] Authentication (login, refresh rotation, logout, guards, rate limit; admin via `pnpm seed:admin`)
- [ ] Visitor tracking
- [ ] Analytics
- [ ] Contact
- [ ] Telegram notifications
- [ ] Email integration
- [x] Profile (About, singleton) & Education — getProfile, updateProfileByAdmin, getEducations, create/update/removeEducationByAdmin
- [x] Skills & skill categories — getSkills, create/update/remove SkillCategory|Skill ByAdmin
- [x] Experience — getExperiences (with skills), create/update/removeExperienceByAdmin
- [ ] Projects
- [ ] Journal
- [ ] Comments
- [ ] Testing — removed at the user's request (2026-11-22); verify manually via GraphiQL

## Phase 02 — Frontend

- [ ] Not started (blocked until Phase 01 complete)

## Phase 03 — Deployment

- [ ] Not started
