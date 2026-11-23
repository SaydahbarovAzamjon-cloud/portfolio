# Data Model — Phase 01 (Backend)

Status: **APPROVED 2026-11-22.** Implemented nestar-style as plain `new Schema({...})` + `export default` in `apps/api/src/schemas/*.model.ts` (enums in `apps/api/src/libs/enums/`). Reference fields end in `Id` / `Ids`.

Source of truth for fields: the project brief and the design mockups in `images for portfolio/`.
Database: MongoDB (`portfolio`), ODM: Mongoose. All collections have `createdAt` / `updatedAt`.

---

## 0. Shared types (embedded, not collections)

| Type | Shape | Used for |
|---|---|---|
| `LocalizedText` | `{ en: string, ko?: string }` | Every human-readable text. `en` is required; `ko` is optional and the frontend falls back to `en`. Korean (`ko`) is written by the admin. |
| `Media` | `{ url, alt: LocalizedText, width, height, blurDataUrl? }` | Images (covers, portraits, mockups) |
| `Link` | `{ label: LocalizedText, url, icon? }` | Buttons / external links |
| `IconCard` | `{ icon, title: LocalizedText, description: LocalizedText }` | Feature tiles, philosophy cards, contributions |
| `Stat` | `{ value: string, label: LocalizedText }` | Manual numbers that cannot be computed |

`icon` is always a string key (e.g. `code`, `brain`, `layers`, or a Simple Icons slug like `nextdotjs`). The frontend maps keys to SVGs.

---

## 1. `users` — admin account (auth)

| Field | Type | Notes |
|---|---|---|
| `email` | string | unique, lowercase |
| `passwordHash` | string | argon2; never returned by the API |
| `role` | enum `ADMIN` | single admin, no public sign-up |
| `lastLoginAt` | Date? | |

## 2. `auth_sessions` — refresh tokens

| Field | Type | Notes |
|---|---|---|
| `userId` | ref `users` | |
| `refreshTokenHash` | string | token itself only lives in an httpOnly cookie |
| `userAgent`, `ipHash` | string | for "active sessions" view |
| `expiresAt` | Date | **TTL index** — Mongo deletes expired sessions |
| `revokedAt` | Date? | set on logout / rotation |

---

## 3. `profile` — singleton (one document)

Everything about the owner that appears on Home, About, Contact and Footer.

| Field | Type | Design source |
|---|---|---|
| `name` | string | "AZAMJON" |
| `fullName` | LocalizedText | "Azamjon Saydahbarov" |
| `headline` | LocalizedText | "FULL-STACK DEVELOPER · AI ENGINEER" |
| `tagline` | LocalizedText | "I build web applications and AI-powered products." |
| `heroOrbitLabels` | LocalizedText[] | "Web Applications / AI Solutions / Real-World Impact" |
| `bio` | `{ short: LocalizedText, long: LocalizedText }` | About preview / Who I Am |
| `location` | `{ city: LocalizedText, country: LocalizedText, timezone }` | "Busan, South Korea", `Asia/Seoul` → header clock |
| `availability` | `{ isAvailable: bool, label: LocalizedText, details: LocalizedText }` | "Available for Opportunities" |
| `contactEmail` | string | public email |
| `socials` | `{ platform: GITHUB\|LINKEDIN\|TELEGRAM\|…, url, handle }[]` | Contact bar, footer |
| `resume` | `{ en: Media(file)?, ko: Media(file)? }` | "Download Resume" |
| `images` | `{ heroPortrait, aboutPortrait, contactPortrait, signature? }` (Media) | portraits |
| `focusAreas` | IconCard[] | Who I Am: Full-Stack / AI Engineering / Product Development |
| `philosophy` | IconCard[] (ordered) | How I Think: 4 principles |
| `interests` | `{ icon, title, description, tags: LocalizedText[] }[]` | Beyond the Code: Sports, Reading… |
| `spokenLanguages` | `{ code: 'ko'\|'en'\|'uz'\|'ru', name: LocalizedText }[]` | KO · EN · UZ · RU |
| `moments` | `{ image: Media, caption: LocalizedText }[]` | "Moments — Beyond Coding" carousel |
| `journey` | `{ beginning: {date, title, text}, future: {title, points[]} }` | "The Beginning" / "2026 – Beyond" cards |
| `contributions` | IconCard[] | Experience: "What I've Delivered" |
| `quotes` | `{ key, text: LocalizedText }[]` | section quotes (philosophy, journey, education…) |
| `manualStats` | Stat[] | only numbers that cannot be computed |

**Computed, never stored:** years of experience (from earliest `experiences.startDate`), project count, AI project count, company count, article / view / like totals. This fixes the mismatched "4+ / 05+ / 7+" numbers in the mockups.

---

## 4. `education`

| Field | Type | Notes |
|---|---|---|
| `degree` | enum `BACHELOR`\|`MASTER`\|`OTHER` | |
| `institution` | LocalizedText | Inje University / 인제대학교 |
| `institutionNative` | string? | "Toshkent davlat transport universiteti" |
| `program`, `major`, `qualification` | LocalizedText | |
| `location` | LocalizedText | |
| `startDate`, `endDate` | Date | `endDate` = graduation or expected |
| `status` | enum `COMPLETED`\|`IN_PROGRESS` | |
| `image` | Media? | building photo |
| `order` | number | |

## 5. `experiences`

| Field | Type | Notes |
|---|---|---|
| `company` | string | ITC Global, NGroup |
| `companyLogo`, `companyImage` | Media? | |
| `role` | LocalizedText | "Full-Stack & AI Developer" |
| `employmentType` | enum `FULL_TIME`\|`PART_TIME`\|`CONTRACT`\|`FREELANCE`\|`INTERNSHIP` | |
| `location` | LocalizedText? | |
| `startDate` | Date | |
| `endDate` | Date? | `null` = present. Duration ("1 year 7 months") is computed |
| `summary` | LocalizedText | |
| `responsibilities` | LocalizedText[] | Key Responsibilities |
| `achievements` | LocalizedText[] | |
| `skillIds` | ref `skills`[] | Tech Stack icons |
| `projectIds` | ref `projects`[] | Main Projects |
| `order` | number | |

---

## 6. `skill_categories`

| Field | Type | Notes |
|---|---|---|
| `key` | string unique | `frontend`, `backend`, `ai-ml`, `infrastructure` |
| `title`, `description` | LocalizedText | |
| `icon` | string | |
| `order` | number | |

## 7. `skills`

| Field | Type | Notes |
|---|---|---|
| `name` | string unique | "Next.js" |
| `slug` | string unique | `nextjs` |
| `icon` | string | Simple Icons slug |
| `categoryId` | ref `skill_categories` | |
| `featured` | bool | shown in Home preview (3 per category) |
| `order` | number | |

Skills are referenced by projects and experiences, so a tech name is spelled once and its icon is always the same.

---

## 8. `projects`

| Field | Type | Notes |
|---|---|---|
| `slug` | string unique | `fixora` → `/projects/fixora` |
| `title` | string | "Fixora" (brand names are not translated) |
| `subtitle` | LocalizedText | "Apple device repair marketplace" |
| `summary` | LocalizedText | card text |
| `category` | enum `FULL_STACK`\|`AI_ML`\|`WEB`\|`MOBILE`\|`OTHER` | |
| `status` | enum `COMPLETED`\|`IN_PROGRESS` | Lumora = `IN_PROGRESS` |
| `order` | number | Lumora last |
| `showOnHome` | bool | "Things I've Built" selection |
| `skillIds` | ref `skills`[] | tech chips |
| `links` | `{ live?, github?, demo? }` | |
| `media` | `{ cover, thumbnail, mockups: Media[], gallery: Media[] }` | |
| `theme` | `{ accent?: string, dark?: bool }` | Lumora purple, CarVia dark |
| `highlights` | `{ icon, label: LocalizedText }[]` | floating badges ("Trusted Technicians") |
| `caseStudy` | see below | case study page |
| `period` | `{ start?: Date, end?: Date }` | |
| `isPublished` | bool | drafts hidden from the public API |

`caseStudy` (all LocalizedText, markdown allowed): `overview`, `problem`, `solution`, `architecture`, `features[]`, `challenges[]`, `results[]`, `role`, `teamSize?`, `duration?`.

---

## 9. `articles` (Journal)

| Field | Type | Notes |
|---|---|---|
| `slug` | string unique | |
| `title`, `excerpt` | LocalizedText | |
| `content` | LocalizedText | markdown |
| `category` | enum `DEVELOPMENT`\|`AI_ML`\|`PERSONAL`\|`FREELANCE` | **exactly four** (brief) — enum, not a collection |
| `tags` | string[] | |
| `cover` | Media | |
| `status` | enum `DRAFT`\|`PUBLISHED` | |
| `publishedAt` | Date? | |
| `featured` | bool | Featured article block |
| `readingTime` | `{ en: number, ko?: number }` | minutes, computed on save |
| `viewCount`, `likeCount`, `commentCount` | number | denormalized counters for fast cards |
| `authorId` | ref `users` | |

## 10. `comments`

| Field | Type | Notes |
|---|---|---|
| `articleId` | ref `articles` | |
| `parentId` | ref `comments`? | one level of replies |
| `authorName` | string | |
| `authorEmail` | string? | private, never exposed publicly |
| `content` | string | plain text, length-limited |
| `status` | enum `PENDING`\|`APPROVED`\|`REJECTED`\|`SPAM` | moderation from admin panel |
| `isOwnerReply` | bool | reply written by the admin |
| `visitorId`, `ipHash`, `userAgent` | string | spam / rate limiting |

## 11. `likes`

| Field | Type | Notes |
|---|---|---|
| `articleId` | ref `articles` | |
| `visitorId` | string | anonymous visitor cookie |

Unique index `(article, visitorId)` → one like per visitor; toggling removes it.

---

## 12. `contact_messages`

| Field | Type | Notes |
|---|---|---|
| `name`, `email`, `subject`, `message` | string | validated + length limits |
| `locale` | `en`\|`ko` | |
| `status` | enum `NEW`\|`READ`\|`REPLIED`\|`ARCHIVED`\|`SPAM` | |
| `visitorId`, `ipHash`, `userAgent` | string | spam / rate limiting |
| `delivery` | `{ emailSentAt?, telegramSentAt?, lastError? }` | Resend + Telegram status |

---

## 13. `visitors`

| Field | Type | Notes |
|---|---|---|
| `visitorId` | string unique | random id in a first-party cookie |
| `firstSeenAt`, `lastSeenAt` | Date | |
| `visitCount` | number | |
| `firstReferrer` | string? | |
| `locale` | string? | |
| `device` | `{ browser, os, type: DESKTOP\|MOBILE\|TABLET }` | parsed from user agent |
| `country` | string? | optional, from IP lookup |

**Privacy:** raw IP addresses are never stored — only a salted hash.

## 14. `page_views`

| Field | Type | Notes |
|---|---|---|
| `visitorId`, `sessionId` | string | |
| `path` | string | |
| `locale` | `en`\|`ko` | |
| `pageType` | enum `HOME`\|`ABOUT`\|`PROJECTS`\|`PROJECT`\|`SKILLS`\|`EXPERIENCE`\|`JOURNAL`\|`ARTICLE`\|`CONTACT` | |
| `entityId` | ObjectId? | project / article being viewed |
| `referrer` | string? | |
| `createdAt` | Date | |

Analytics (total visitors, popular pages, trends, project visits, journal engagement) are **aggregation queries** over `page_views` + `visitors`. No separate stats collection until traffic needs it.

---

## Relationships

```
skill_categories 1──* skills
skills *──* projects        (projects.skills)
skills *──* experiences     (experiences.skills)
projects *──* experiences   (experiences.projects)
users 1──* articles         (articles.author)
articles 1──* comments      (comments.article, comments.parent)
articles 1──* likes
visitors 1──* page_views, likes, comments, contact_messages   (by visitorId)
users 1──* auth_sessions
profile, education          standalone
```

## 15. `uploads` — files on the VPS disk

| Field | Type | Notes |
|---|---|---|
| `path` | string unique | relative path under the uploads dir, e.g. `projects/2026/11/<uuid>.webp` |
| `url` | string | public URL served by Nginx (`/uploads/...`) |
| `originalName`, `mimeType` | string | |
| `size` | number | bytes |
| `width`, `height` | number? | images only |
| `uploadedBy` | ref `users` | |

`Media.url` values point at these files. The table lets the admin panel list files and clean up unused ones.

## Decisions (2026-11-22)

1. **Articles** — `ko` fields are optional and written by the admin; the frontend shows `en` when `ko` is empty.
2. **Comments** — saved as `PENDING`; visible only after the admin approves them. Name required, email optional.
3. **Files** — stored on the Hostinger VPS disk, served by Nginx; metadata in `uploads`.
