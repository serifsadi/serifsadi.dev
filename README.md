# serifsadi.dev

Static personal website. The existing root `index.html`, `assets/` and `CNAME`
remain in place for GitHub Pages during the Cloudflare migration.

## Local preparation

Use Node 24.19.0 (`nvm use`); Wrangler requires Node >=22.12.0.

```sh
npm ci
npm run build
npx wrangler deploy --dry-run
```

The build recreates `dist/` and copies only `index.html` and `assets/`, without
transforming their contents. Hidden files and OS metadata are excluded; symbolic
links and special files are rejected. `README.md`, `CNAME`, Git metadata,
configuration, dependencies and development scripts are not published.
`dist/`, `node_modules/` and `.wrangler/` are ignored by Git.

Wrangler is pinned in `package.json` and `package-lock.json`; use `npm ci` to
reproduce the dependency installation. The build itself uses only Node built-ins.

## Cloudflare Workers Builds settings

These are the intended dashboard settings, not changes applied by this repository:

| Setting | Value |
| --- | --- |
| Worker name | `serifsadi-web` |
| Production branch | `main` |
| Root directory | Repository root |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Static assets directory | `./dist` (set in `wrangler.jsonc`) |

This uses Workers Static Assets only: no Worker runtime script, API, bindings or
SPA fallback. Missing paths return 404. No custom domain, route or account ID is
configured. The Cloudflare plan is managed in the dashboard, not in Wrangler.

The deploy command above is for a future authorized release; it publishes to
Cloudflare. Use `--dry-run` for local preparation. A dry run does not verify account
permissions, the connected GitHub repository/branch, or production domain routing.

Do not change DNS or disable GitHub Pages until the migration is separately
approved and the Cloudflare deployment is verified. This preparation does not
deploy, connect a custom domain, or change GitHub Pages settings.
