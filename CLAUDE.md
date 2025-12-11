# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application with TypeScript, React 19, and Tailwind CSS 4. The project uses the App Router architecture and is configured with pnpm as the package manager.

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Architecture

**Framework**: Next.js 16 with App Router
- Uses the `app/` directory structure for routing
- Server Components by default
- TypeScript with strict mode enabled

**Styling**: Tailwind CSS 4
- PostCSS configuration in `postcss.config.mjs`
- Global styles in `app/globals.css`
- Configured with Geist fonts (sans and mono)

**Path Aliases**: 
- `@/*` maps to the root directory (configured in `tsconfig.json`)

**Key Files**:
- `app/layout.tsx`: Root layout with font configuration and metadata
- `app/page.tsx`: Homepage component
- `next.config.ts`: Next.js configuration (currently minimal)
- `eslint.config.mjs`: ESLint flat config with Next.js presets

## TypeScript Configuration

- Target: ES2017
- Module resolution: bundler
- Strict mode enabled
- JSX: react-jsx
- Includes Next.js TypeScript plugin for enhanced editor support

## Linting

Uses ESLint flat config format with:
- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`
