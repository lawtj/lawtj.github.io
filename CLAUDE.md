# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

This is a monorepo personal website with two main applications:

- **Frontend (apps/web)**: SvelteKit static site using TailwindCSS and Shadcn/UI, deployed to GitHub Pages
- **Backend (apps/backend)**: FastAPI Python server with image processing tools, deployed to Vercel

The frontend serves as a portfolio/tools site with calculators for coffee brewing, local anesthetic dosing, Chase points optimization, and links to external image processing tools.

## Development Commands

This repo uses **bun** as its package manager and task runner. `bun.lock` is the
lockfile; there is no `package-lock.json`. Install with `bun install`.

### Frontend (SvelteKit)
```bash
# Development
bun run dev                # Short alias for dev:web
bun run dev:web

# Build and check
bun run build:web
bun run check:web                      # Type checking
bun run --filter './apps/web' lint     # ESLint + Prettier

# Deploy to GitHub Pages
bun run deploy:web
```

### Backend (FastAPI)
```bash
# Development
bun run dev:backend        # Starts uvicorn on port 8000

# Deploy to Vercel
bun run deploy:backend
```

## Deployment

- **Frontend**: Deploys to GitHub Pages using `gh-pages` branch via the `gh-pages` package
- **Backend**: Deploys to Vercel using Python 3.12 runtime with FastAPI serverless functions

## Key Technologies

- **Frontend**: SvelteKit 5, TailwindCSS, DaisyUI, TypeScript
- **Backend**: FastAPI, Pillow (image processing), uvicorn
- **Build**: Vite, adapter-static for SvelteKit
- **Linting**: ESLint, Prettier with Svelte plugins