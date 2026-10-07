# AicyroNext

This project now runs on **Next.js** with the classic `pages` router, Tailwind CSS for styling, and Firebase Realtime Database for content management.

## Getting Started

```bash
npm install
npm run dev
```

The dev server boots on [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` – start the Next.js development server
- `npm run build` – create an optimized production build
- `npm start` – serve the production build
- `npm run lint` – run ESLint using `next lint`

## Project Structure

- `src/pages` – route entries (`/`, `/services`, `/portfolio`, `/about`, `/contact`)
- `src/Components` – shared UI sections used across routes
- `src/lib/firebase.js` – Firebase initialization shared by data-driven components
- `src/styles/globals.css` – Tailwind and global styles

Static assets continue to live in `src/assets` and are imported directly into components.
