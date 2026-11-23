# Meena IVF & Fertility Care: website redesign (demo)

React + Vite + Tailwind front end for the Meena IVF pitch. All content, names, schedules, figures and photos come from the clinic's current website (see `REDESIGN_PLAN.md` for the audit and plan, `DESIGN.md` for the design system).

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
npm run build && npm run preview   # production build at http://localhost:4173
```

## Deploy to Vercel
- **Dashboard:** push this folder to a Git repo → Vercel → *Add New Project* → import. Vercel detects Vite automatically (build `npm run build`, output `dist`).
- **CLI:** `npx vercel` from this folder (then `npx vercel --prod`).

The `Meena IVF Old Site Clone/` folder is the original WordPress site, kept as reference. It is excluded from Git (`.gitignore`), from Vercel uploads (`.vercelignore`) and from Vite's dev server (`vite.config.ts`).

`vercel.json` already handles client-side routes (`/doctors/…`, `/treatments/…`) and long-term caching for images and assets.

## Where things live
| What | File |
|---|---|
| Phone, email, address, social links, headline stats | `src/data/site.ts` |
| Doctors (bio, qualifications, weekly schedule) | `src/data/doctors.ts` |
| 18 treatments (content, steps, FAQs) | `src/data/treatments.ts` |
| Centres, team, testimonials, FAQ, events, videos | `src/data/content.ts` |
| Bengali blog posts | `src/data/blog.json` |
| Optimised images (WebP) | `public/img/` |

## Demo limitations
- Booking, contact and careers forms validate input and show a confirmation, but **send nothing** (the confirmation says so). The booking confirmation offers a pre-filled WhatsApp message to the hotline.
- "In clinic today" badges use the doctors' published weekly schedules in Asia/Dhaka time; they don't know about leave or holidays.
- OPD dates are calculated as the 2nd Friday (Khulna) / 2nd Tuesday (Cumilla) of each month.
- Old WordPress URLs (`/about-us`, `/dr-lubna-yasmin`, `/ivf`, …) redirect to the new pages on the client side.
