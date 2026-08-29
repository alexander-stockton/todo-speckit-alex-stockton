# Behavior & Rules Reference

**Living snapshot** of product rules currently in force on `dev` (not API shapes or columns — see [api.md](./api.md) and [data-model.md](./data-model.md)).

These files answer: *"What rules does the app enforce right now?"*  
They do **not** authorize new scope — implement only from `features/feature-*.md` (**FR-00N** + Gherkin).

**Related:** [ADR-0002 — Security architecture](../../docs/adr/0002-security-architecture.md)

---

## Maintenance

| When | Action |
|------|--------|
| Feature changes a product rule (sort, ownership, validation, UI rule) | Update this file in the **same PR** |
| Feature only changes routes/payloads/schema | Update [api.md](./api.md) / [data-model.md](./data-model.md); touch this file only if rules changed |

---

## Auth & sessions

| Rule | Enforcement | Introduced |
|------|-------------|------------|
| Login is **username + password** (not email-only) | Auth API + Login UI | Feature 1 |
| Passwords hashed with bcrypt (`SALT_ROUNDS = 10`); hash never returned | Register/login APIs; user `defaultScope` | Feature 1 |
| Session = JWT stored server-side; client sends `Authorization: Bearer <token>` | `authenticate` middleware + `sessions` table | Feature 1 |
| Session lifetime **24 hours** from creation | Session create on register/login | Feature 1 |
| Login reuses a non-expired session for the same user when one exists | Login controller | Feature 1 |
| Logout invalidates the server session and clears client `user` storage | Logout API + `authServices.logoutUser` | Feature 1 |
| Unauthenticated protected API → `401` | `authenticate` | Feature 1 |
| Unauthenticated protected UI → redirect to login | Router `beforeEach` | Feature 1 |
| Signed-in user visiting login/register → redirect to home | Router `beforeEach` | Feature 1 |
| Default role for new users is `worker` | Register | Feature 1 |
| Registration email uses shared `emailRules` from `validation.js` | Register UI | Feature 1 |

## Ownership & isolation

| Rule | Enforcement | Introduced |
|------|-------------|------------|
| Every authenticated request resolves to `req.user.id` from the session | `authenticate` | Feature 1 |
| Cross-user access → **`404`**, never `403` (do not confirm existence) | Controllers + `getAccessible*OrNull` | Features 2–3 |
| Lists: reads/writes scoped to `userId = req.user.id`; create ownership from server only | `list.controller` + `getAccessibleListOrNull` | Feature 2 |
| Todos: parent list must be owned; todo reads/writes scoped to caller; create ignores client `userId` spoofing | `todo.controller` + helpers | Feature 3 |
| Deleting a list cascades to its todos | Sequelize `List hasMany Todo` `onDelete: CASCADE` | Feature 3 |

## Lists

| Rule | Enforcement | Introduced |
|------|-------------|------------|
| List name trimmed; empty/whitespace rejected | Create/update API + Dashboard dialogs | Feature 2 |
| List name max **100** characters | API + client rules | Feature 2 |
| Lists returned **alphabetically by name** | `findAll` `order: name ASC` | Feature 2 |
| Single-view lists UI (`Dashboard.vue`); list CRUD via dialogs; no sidebar/main split | Dashboard | Feature 2 |
| Empty lists: **"No lists yet. Create your first list."** | Dashboard | Feature 2 |

## Todos

| Rule | Enforcement | Introduced |
|------|-------------|------------|
| Todo title trimmed; empty/whitespace rejected | Create/update API + dialogs | Feature 3 |
| Todo title max **255** characters | API + client rules | Feature 3 |
| New todos default `completed: false` | Create | Feature 3 |
| Sort: **incomplete first**, then `createdAt` ascending | API `order` + client `sortTodos` | Feature 3 |
| Items managed in list-items dialog (+ nested add/edit/delete); **+ Add Item** only inside that dialog | Dashboard | Feature 3 |
| Empty items: **"No todos in this list yet."** | Items dialog | Feature 3 |
| Completed todos show struck-through / muted title | Dashboard row styling | Feature 3 |

## App chrome

| Rule | Enforcement | Introduced |
|------|-------------|------------|
| `MenuBar` shows signed-in user's name and **Sign out** | `MenuBar.vue` | Feature 2 |
| `MenuBar` hidden on login and register routes | `App.vue` | Feature 2 |

## UI (auth pages)

| Rule | Enforcement | Introduced |
|------|-------------|------------|
| Login and register use full-screen layout (no `MenuBar`) | `App.vue` | Feature 1 |

## Errors (product convention)

| Rule | Enforcement | Introduced |
|------|-------------|------------|
| Error body shape `{ "message": "Human-readable explanation." }` | Controllers | Feature 1 |
| Validation failures use `400` where specified; missing/unowned resources use `404` | Controllers | Features 2–3 |

---

## How to use

| Question | Look here |
|----------|-----------|
| What rule is in force now? | This file |
| Exact scenario / test name | Introducing `feature-N-*.md` Test Coverage Map |
| Routes and payloads | [api.md](./api.md) |
| Tables and columns | [data-model.md](./data-model.md) |
