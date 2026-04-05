---
name: supabase-github-vercel-release
description: Use when a project ships through a Supabase plus GitHub plus Vercel workflow, especially when schema changes may need to be applied before pushing and deploying.
---

# Supabase GitHub Vercel Release

Use this skill for projects that follow this release sequence:

1. run local validation
2. apply any required Supabase SQL changes
3. commit and push to GitHub
4. rely on Vercel's GitHub deployment, or create a preview deploy when needed

This skill is intentionally generic. Adapt the exact commands to the current repo, but keep the release order stable unless the user asks otherwise.

## Core workflow

### 1. Discover the project release shape

Before making release decisions, confirm:

- project root
- package manager and build commands
- whether Supabase is used for schema, auth, storage, or RLS
- whether Vercel deploys from GitHub automatically
- whether the user wants production deployment or only a preview

If the repo already documents release steps in `README`, `package.json`, `vercel.json`, or `supabase/`, prefer those project-local instructions.

### 2. Validate locally

Run the project's local checks before pushing.

Typical examples:

```bash
npm run lint
npm run build
```

or

```bash
pnpm lint
pnpm build
```

If validation fails, fix that before pushing unless the user explicitly wants to ship despite the warnings or failures.

### 3. Check for Supabase schema changes

Before deployment, inspect whether the change includes:

- new tables
- new columns
- new constraints
- new storage rules
- changed RLS or storage policy behavior

If yes:

1. identify the SQL file in the project's `supabase/` directory
2. apply it before feature validation
3. continue only after the schema is ready

### 4. Push to GitHub

Preferred production flow:

1. stage
2. commit
3. push the target branch

### 5. Deploy to Vercel

Preferred production flow:

1. push to the GitHub branch that Vercel tracks
2. let Vercel build from GitHub automatically

If the user wants a manual preview deployment, use the `vercel-deploy` skill.

If `vercel` CLI is unavailable, use the fallback script:

```bash
bash /Users/wzyth/.codex/skills/vercel-deploy/scripts/deploy.sh /path/to/project
```

Return the preview URL and claim URL when available.

## Supabase SQL execution options

When a SQL migration must be applied, use one of these:

1. user runs it in Supabase SQL Editor
2. if the user provides a valid Supabase PAT, call the official Management API `database/query` endpoint

Do not assume a service role key is enough for the Management API SQL endpoint.

## Release checklist

Before calling a release complete:

1. local checks pass
2. required Supabase SQL is already applied
3. git push succeeds
4. user knows whether deployment is handled by GitHub-connected Vercel or a manual preview deploy

## Project adaptation note

When reusing this skill in another project, replace repo-specific assumptions with the current repo's:

- root directory
- package manager
- build and lint commands
- Supabase migration path
- GitHub default branch
- Vercel deployment mode

## Lens Notes example

- project root: `/Users/wzyth/Documents/wzycodex/web`
- package manager: `npm`
- validation: `npm run lint` and `npm run build`
- Supabase SQL path: `/Users/wzyth/Documents/wzycodex/web/supabase`
- repo: `https://github.com/wzy-InfiniteProgress/lens-notes`
- default branch: `main`
- photo content, photo notes, and essays are intentionally separate flows
- essays live under `/journals`
- older Chinese slugs should still be verified when slug logic changes
