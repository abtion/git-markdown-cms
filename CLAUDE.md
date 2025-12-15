# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Git Markdown CMS** - a Next.js 16 application that provides a web-based interface for editing markdown files stored in GitHub repositories. It enables content editing with live preview, automatic branch management, and direct commits to GitHub.

**Core Functionality:**

- Token-based authentication with 16-hour sessions
- File tree browser for navigating repository markdown files
- Split-pane editor with live markdown preview in iPhone 16 frame
- Direct commits to GitHub with automatic branch creation

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

**Note**: This project uses `pnpm` as the package manager.

## Architecture

### Framework Stack

- **Next.js 16** with App Router (Server Components by default)
- **React 19** with TypeScript strict mode
- **Tailwind CSS 4** with custom prose styles for markdown
- **Zustand 5** for centralized state management
- **Octokit** for GitHub API integration

### Directory Structure

| Directory            | Purpose                                                      |
| -------------------- | ------------------------------------------------------------ |
| `app/`               | Next.js App Router pages and layouts                         |
| `app/api/`           | API routes for auth and GitHub operations                    |
| `app/auth/`          | Login page                                                   |
| `app/editor/`        | Main editor page (protected route)                           |
| `components/auth/`   | LoginForm component                                          |
| `components/editor/` | 7 editor UI components (layout, tree, editor, preview, etc.) |
| `lib/auth/`          | Session management (localStorage-based)                      |
| `lib/github/`        | GitHub API integration (octokit, tree, content, commit)      |
| `lib/store/`         | Zustand editor state store                                   |
| `lib/utils/`         | Helper utilities (cn, tree-adapter)                          |
| `types/`             | TypeScript type definitions                                  |

### Key Architectural Patterns

**Three-Pane Editor Layout:**

```
FileTree | MarkdownEditor | MarkdownPreview (iPhone 16 frame)
```

**State Management (Zustand):**

- Single centralized store (`lib/store/editorStore.ts`)
- Tracks: selectedFile, content, originalContent, isDirty, isSaving, error
- Components access via `useEditorStore` hook

**Authentication Flow:**

- Simple token validation on `/api/auth`
- Session stored in localStorage with expiration
- Session validation on page load with auto-redirect
- Logged-in users → `/editor`, logged-out users → `/auth`

**GitHub Integration:**

- `GET /api/github/tree` - Fetches repository structure filtered to markdown files
- `GET /api/github/content` - Retrieves file content with SHA for conflict detection
- `POST /api/github/commit` - Commits changes to target branch with SHA validation
- Custom tree adapter converts flat GitHub structure to hierarchical format

**File Tree Filtering:**

- Only shows folders and `.md` files within configured `GITHUB_FOLDER`
- Hierarchical structure built from GitHub's flat API response

**Unsaved Changes Protection:**

- Browser warning when navigating with unsaved changes
- `UnsavedChangesPrompt` component manages `beforeunload` event

### Important Configuration Files

- **`.env.local`**: Environment variables (see SETUP.md for details)
  - `LOGIN_TOKEN` - Authentication token
  - `GITHUB_TOKEN` - PAT with repo read/write permissions
  - `GITHUB_REPO`, `GITHUB_BRANCH`, `GITHUB_FOLDER` - Source configuration
  - `GITHUB_TARGET_BRANCH` - Branch where commits are made
  - `NEXT_PUBLIC_GITHUB_FOLDER` - Client-side folder reference

- **`tsconfig.json`**: Path aliases (`@/*` maps to root), strict mode enabled
- **`postcss.config.mjs`**: Tailwind CSS 4 configuration
- **`app/globals.css`**: Custom prose styles for markdown preview

## TypeScript Configuration

- Target: ES2017
- Module resolution: bundler
- Strict mode enabled
- JSX: react-jsx
- Path alias: `@/*` maps to root directory

## Key Dependencies

**UI & Styling:**

- `react-markdown` + `remark-gfm` + `rehype-raw` - Markdown rendering with GFM support
- `react-complex-tree` - Hierarchical file tree component
- `tailwindcss` + `clsx` + `tailwind-merge` - Styling utilities

**State & Data:**

- `zustand` - Lightweight state management
- `@octokit/rest` - GitHub API client

## Development Workflow

**Session Management:**

- Sessions expire after 16 hours
- Stored in localStorage as JSON with expiration timestamp
- Validation happens on every protected page load

**Save Workflow:**

1. User clicks Save button
2. `POST /api/github/commit` with file path, content, and SHA
3. SHA validation prevents overwriting concurrent changes (409 conflict)
4. Automatic branch creation if `GITHUB_TARGET_BRANCH` doesn't exist
5. Commit message: "chore: Update markdown content"
6. Manual PR/merge required to integrate into main branch

**Error Handling:**

- GitHub API errors (404, 409) are caught and displayed to user
- File conflicts show user-friendly messages
- Session expiration triggers automatic redirect to login

## Type Definitions

Key types in `types/`:

- `Session` - Expiration timestamp
- `FileSelection` - File path and SHA
- `EditorState` - Complete editor state (content, isDirty, isSaving, etc.)
- `GitHubTreeItem` - GitHub API tree response
- `TreeItem`/`TreeData` - Hierarchical structure for react-complex-tree
- `GitHubContent` - File content response

## Linting

Uses ESLint flat config format with:

- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Additional Documentation

- **SETUP.md** - Comprehensive setup guide with environment configuration, GitHub PAT creation, and troubleshooting
- **README.md** - Basic Next.js template information
