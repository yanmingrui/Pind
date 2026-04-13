# Trajec

Trajec is a bead-pattern editor and sharing MVP built with Next.js.

## Features

- Upload an image and convert it into a bead pattern in the browser
- Map pixels to a fixed bead palette and generate a square board layout
- Recolor cells manually in a grid editor
- See per-color bead counts and estimated board usage
- Save patterns into a local JSON-backed gallery
- Open a pattern detail page for each saved design

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Local file persistence through Route Handlers

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Notes

- Saved works are stored in `data/patterns.json`.
- Image conversion is currently client-side and uses nearest-color palette mapping.
- This MVP is designed to be extended with auth, cloud storage, comments, likes, and richer real-world bead palettes.
