# NoteNest – Frontend (Next.js + Bootstrap 5)

Frontend for the **Note Management System** backend. The backend is **not modified**:
its CORS setting (`cors({ origin: CLIENT_URL })`) is used exactly as it is.

## How CORS works here

The backend `.env` already has `CLIENT_URL=http://localhost:3000`, and the backend only
accepts browser requests from that origin. So:

| App      | Port | Why |
|----------|------|-----|
| Frontend | 3000 | must match `CLIENT_URL` (CORS) |
| Backend  | 5000 | set with the `PORT` environment variable (`bin/www` already reads it) |

## Run it

```bash
# 1) Backend (from /backend) - on port 5000, no code change
PORT=5000 npm start            # Windows PowerShell:  $env:PORT=5000; npm start

# 2) Frontend (from /frontend)
cp .env.example .env.local     # first time only
npm install
npm run dev                    # http://localhost:3000
```

Production: `npm run build && npm start`.

### Password-reset emails
By default the backend links to `CLIENT_URL/app/#/reset/<token>`. To open this frontend instead,
add one line to the backend `.env` (configuration only, no code):

```
RESET_PAGE_URL=http://localhost:3000/reset-password
```

### Going live
Set `NEXT_PUBLIC_SITE_URL` (your frontend domain, also used for SEO) and `NEXT_PUBLIC_API_URL`
(your API URL), and set the backend `CLIENT_URL` to the same frontend domain so CORS allows it.

## Features
Landing page, register / login / logout, forgot & reset password, notes (create, edit, **auto-save**,
search, tag filter, sort, pagination, pin, archive, delete, **bulk actions**, export Markdown/PDF),
reminders, **Ask AI** over your notes, profile + change password, admin user list.

## Project structure
```
src/
  app/            routes (pages only render components + SEO metadata)
    (auth)/       login, register, forgot-password, reset-password/[token]
    (app)/        private pages: notes, reminders, ask, profile, admin/users
  components/
    ui/           reusable: Button, FormField, Modal, ConfirmModal, Dropdown, Pagination, Alert, ...
    layout/       Navbars, Footer, Brand
    auth/ notes/ profile/   feature components
  services/       api.js (fetch wrapper) + one small file per backend resource
  context/        AuthContext, ToastContext
  hooks/          useForm, useDebounce
  lib/            config (site name, limits), format helpers, validators
```
Rename the product in **one place**: `src/lib/config.js`.

## SEO & performance
Metadata API with title template, Open Graph/Twitter cards, generated social image, canonical URLs,
`robots.txt`, `sitemap.xml`, web manifest, JSON-LD structured data, private pages set to `noindex`,
semantic HTML, skip link, ARIA labels. Static pre-rendering for public pages, no Bootstrap JavaScript
bundle (modals/dropdowns/navbar are React-driven), no external fonts, security headers.
