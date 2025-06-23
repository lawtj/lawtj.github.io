# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

This is a monorepo personal website with two main applications:

- **Frontend (apps/web)**: SvelteKit static site using TailwindCSS and Shadcn/UI, deployed to GitHub Pages
- **Backend (apps/backend)**: FastAPI Python server with image processing tools, deployed to Vercel

The frontend serves as a portfolio/tools site with calculators for coffee brewing, local anesthetic dosing, Chase points optimization, and links to external image processing tools.

## Development Commands

### Frontend (SvelteKit)
```bash
# Development
npm run dev                # Short alias for dev:web
npm run dev:web

# Build and check
npm run build:web
npm run check --workspace=apps/web     # Type checking
npm run lint --workspace=apps/web      # ESLint + Prettier
npm run format --workspace=apps/web    # Format with Prettier

# Deploy to GitHub Pages
npm run deploy:web
```

### Backend (FastAPI)
```bash
# Development
npm run dev:backend        # Starts uvicorn on port 8000

# Deploy to Vercel
npm run deploy:backend
```

## Deployment

- **Frontend**: Deploys to GitHub Pages using `gh-pages` branch via the `gh-pages` package
- **Backend**: Deploys to Vercel using Python 3.12 runtime with FastAPI serverless functions

## Key Technologies

- **Frontend**: SvelteKit 5, TailwindCSS, DaisyUI, TypeScript
- **Backend**: FastAPI, Pillow (image processing), uvicorn
- **Build**: Vite, adapter-static for SvelteKit
- **Linting**: ESLint, Prettier with Svelte plugins