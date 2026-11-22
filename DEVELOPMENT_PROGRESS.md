# Development Progress

## Phase 01 — Backend

- [x] Project initialization (NestJS `apps/api`, pnpm workspace)
- [x] Database configuration (Mongoose, env validation)
- [x] GraphQL configuration (Apollo 5, code-first, `health` query)
- [x] Data model (`docs/DATA_MODEL.md`, 15 Mongoose schemas + tests)
- [x] Restructure API to nestar conventions (`components/`, `schemas/`, `libs/`)
- [x] Authentication (login, refresh rotation, logout, guards, rate limit; admin via `pnpm seed:admin`)
- [x] Visitor tracking — trackVisit (anonymous cookie, 30 min visits, page views, device; skips bots and the admin)
- [x] Analytics — getDashboardByAdmin(days): visitors, new visitors, visits, page views, daily chart (Seoul), top pages, sources, languages, devices, top articles, new messages, pending comments
- [x] Contact — sendContactMessage (honeypot, rate limited, Telegram + email via Resend), admin: getContactMessages/getContactMessage (NEW→READ), updateContactMessageStatus/removeContactMessageByAdmin
- [x] Telegram notifications — instant: new visit, like, comment, contact message
- [x] Email integration — contact message → owner inbox via Resend (reply-to = sender)
- [x] Profile (About, singleton) & Education — getProfile, updateProfileByAdmin, getEducations, create/update/removeEducationByAdmin
- [x] Skills & skill categories — getSkills, create/update/remove SkillCategory|Skill ByAdmin
- [x] Experience — getExperiences (with skills), create/update/removeExperienceByAdmin
- [x] Projects — getProjects (filter), getProject(slug), getAllProjectsByAdmin, create/update/removeProjectByAdmin
- [x] Journal — getArticles (category/tag/search/sort/paging), getJournalStats (header + tab counts), getArticle(slug, 1 view per visitor per 24h), likeArticle (toggle), shareArticle, admin: getAll/getArticleByAdmin, create/update/removeArticleByAdmin
- [x] Comments — getComments (nested), createComment (pending, rate limited, Telegram alert), admin: getCommentsByAdmin, updateCommentStatus/replyComment/removeCommentByAdmin
- [x] Uploads — POST /upload (admin, multipart: file + folder; images → WebP max 2400px + blur preview, PDF for resume, 10 MB limit, real content check), getUploadsByAdmin, removeUploadByAdmin; served at APP_URL/uploads
- [ ] Testing — removed at the user's request (2026-11-22); verify manually via GraphiQL

## Phase 02 — Frontend

- [ ] Not started (blocked until Phase 01 complete)

## Phase 03 — Deployment

- [ ] Not started
