# Provision PDF Annotator

A small desktop React take-home project for annotating a bundled construction drawing PDF.

## Features

- Navigate multi-page documents
- Draw red Ignore and green Capture regions
- Store annotations as normalized coordinates (`0-1`)
- Persist annotations in `localStorage`

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL, choose Ignore or Capture, and drag over the rendered page.
Annotations are restored when the page is reopened.

## Validation

```bash
npm run lint
npm run build
```

## Architecture

```text
Bundled PDF
  -> React-PDF / PDF.js canvas
  -> absolute AnnotationLayer
  -> normalized annotation coordinates
  -> React state
  -> localStorage
```
