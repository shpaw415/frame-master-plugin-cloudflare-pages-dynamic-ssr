# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Scope
- This repository is a single Frame-Master plugin package: `cloudflare-pages-dynamic-ssr`.
- Main implementation file: [index.ts](index.ts).
- Package metadata and dependency constraints: [package.json](package.json).
- User-facing usage docs: [README.md](README.md).
- Domain-specific plugin authoring guidance: [SKILL.md](SKILL.md).

## Runtime And Architecture
- Runtime target is Bun + Frame-Master plugin lifecycle, not a standalone app.
- Export a default plugin factory that returns `FrameMasterPlugin`.
- Keep plugin metadata (`name`, `version`) sourced from `package.json`, matching the existing pattern in [index.ts](index.ts).
- Preserve lifecycle structure unless the task explicitly requires removal:
  - `router.before_request`
  - `router.request`
  - `router.after_request`
  - `router.html_rewrite` (`initContext`, `rewrite`, `after`)
  - `serverStart.main` and `serverStart.dev_main`
  - `requirement` block

## Commands
- Install deps: `bun install`
- Type-check (no emit): `bunx tsc --noEmit`

Notes:
- `package.json` currently defines no `scripts` section and no test runner command.
- Prefer adding scripts only when requested by the task.

## Editing Conventions
- Keep strict TypeScript compatibility with [tsconfig.json](tsconfig.json).
- Maintain ESM style and existing import pattern.
- Avoid changing public plugin name/signature unless explicitly requested.
- Keep changes minimal and localized to requested behavior.

## Common Pitfalls
- Do not remove or silently relax the `requirement` version constraints.
- Do not convert this package into a server app; this repo is a plugin module.
- Avoid introducing Node-only APIs when Bun-native behavior is expected.

## Done Checklist
- Code compiles with `bunx tsc --noEmit`.
- Export remains default plugin factory.
- README usage remains valid after code changes.
