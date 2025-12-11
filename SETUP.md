# Git Markdown CMS - Setup Guide

This is a Next.js-based CMS that allows you to edit markdown files stored in a GitHub repository.

## Prerequisites

- Node.js 18+ and pnpm
- A GitHub repository with markdown files
- A GitHub Personal Access Token (PAT)

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Update the `.env.local` file with your configuration:

```bash
# Authentication - set your own secure token
LOGIN_TOKEN=your-secure-token-here

# GitHub Configuration
GITHUB_TOKEN=ghp_your_github_pat_here
GITHUB_REPO=username/repository-name
GITHUB_BRANCH=main
GITHUB_FOLDER=content
GITHUB_TARGET_BRANCH=cms-updates

# Public environment variables
NEXT_PUBLIC_GITHUB_FOLDER=content
```

### 3. GitHub Personal Access Token

Create a GitHub PAT with the following permissions:
- Repository contents: **Read & Write**
- Repository metadata: **Read**

To create a PAT:
1. Go to GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Click "Generate new token"
3. Select your repository
4. Grant the permissions above
5. Copy the token to `GITHUB_TOKEN` in `.env.local`

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Authentication

1. Navigate to the app
2. Enter the `LOGIN_TOKEN` value you set in `.env.local`
3. You'll be redirected to the editor

Session expires after 16 hours.

### Editing Files

1. **File Tree** (left pane): Browse and select markdown files
2. **Editor** (middle pane): Edit the raw markdown content
3. **Preview** (right pane): See a live preview in an iPhone 16 frame

### Saving Changes

1. Click the **Save** button in the top-right corner
2. Changes are committed to the `GITHUB_TARGET_BRANCH`
3. If the branch doesn't exist, it will be created automatically
4. Commit message: "chore: Update markdown content"

### Workflow

- The editor creates commits on the `GITHUB_TARGET_BRANCH` branch
- You must **manually review and merge** this branch into your main branch
- Unsaved changes trigger a browser warning when navigating away

## Project Structure

```
app/
├── auth/page.tsx                    # Login page
├── editor/page.tsx                  # Main editor
└── api/
    ├── auth/route.ts                # Authentication endpoint
    └── github/                      # GitHub API routes
        ├── tree/route.ts
        ├── content/route.ts
        └── commit/route.ts

components/
├── auth/LoginForm.tsx
└── editor/
    ├── EditorLayout.tsx             # Main layout
    ├── FileTree.tsx                 # File browser
    ├── MarkdownEditor.tsx           # Text editor
    ├── MarkdownPreview.tsx          # Live preview
    ├── iPhone16Frame.tsx            # Mobile frame
    ├── SaveButton.tsx
    └── UnsavedChangesPrompt.tsx

lib/
├── auth/session.ts                  # Session management
├── github/                          # GitHub API integration
│   ├── octokit.ts
│   ├── tree.ts
│   ├── content.ts
│   └── commit.ts
├── store/editorStore.ts             # Zustand state
└── utils/
    ├── cn.ts
    └── tree-adapter.ts
```

## Features

- ✅ Simple token-based authentication
- ✅ File tree browser with folder support
- ✅ Live markdown preview with GitHub Flavored Markdown
- ✅ iPhone 16 mobile preview frame
- ✅ Automatic branch creation
- ✅ Unsaved changes warning
- ✅ Session persistence (16 hours)

## Technologies

- **Next.js 16** with App Router
- **React 19**
- **TypeScript** with strict mode
- **Tailwind CSS 4** with Typography plugin
- **Zustand** for state management
- **Octokit** for GitHub API
- **react-markdown** for preview
- **react-complex-tree** for file browser

## Troubleshooting

### "GITHUB_TOKEN environment variable is not set"
- Make sure `.env.local` exists and contains `GITHUB_TOKEN`
- Restart the dev server after updating `.env.local`

### File tree not loading
- Check that `GITHUB_REPO`, `GITHUB_BRANCH`, and `GITHUB_FOLDER` are correct
- Verify your GitHub token has correct permissions
- Check that the folder exists in your repository

### Save fails with "File has been modified elsewhere"
- The file was updated in GitHub since you opened it
- Refresh the page and try again

### Session expires immediately
- Check your system clock is correct
- Clear localStorage and try logging in again
