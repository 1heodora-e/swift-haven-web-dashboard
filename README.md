# Haven Dashboard — Swift Haven Africa

Pitch-ready NGO impact dashboard for tracking smart pad dispenser deployments in Kigali secondary schools.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5180/](http://localhost:5180/) — the Haven Dashboard loads directly.

`/dashboard` redirects to `/` for older links.

## Features

- Live dispenser activity feed and pads counter
- Kigali school map with inventory pins
- Investment scale slider for funder conversations
- Guided pitch tour (sidebar)
- PDF / CSV impact reports
- Data persists in `localStorage` across refresh

## Build & deploy

```bash
npm run build
npm run preview
```

Deploy `dist` to Vercel/Netlify (`vercel.json` included for SPA routing).
