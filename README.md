# serifsadi.dev

Static personal website at [https://serifsadi.dev](https://serifsadi.dev).
Cloudflare Workers Static Assets is the sole production hosting platform, using
the `serifsadi-web` Worker and the existing GitHub integration on `main`.
GitHub Pages is disabled and its legacy root `CNAME` file has been removed.

## Local preparation

Use Node 24.19.0 (`nvm use`); Wrangler requires Node >=22.12.0.

```sh
npm ci
npm run build
npx wrangler deploy --dry-run
```

The build recreates `dist/` and copies only `index.html` and `assets/`, without
transforming their contents. Hidden files and OS metadata are excluded; symbolic
links and special files are rejected. `README.md`, Git metadata,
configuration, dependencies and development scripts are not published.
`dist/`, `node_modules/` and `.wrangler/` are ignored by Git.

Wrangler is pinned in `package.json` and `package-lock.json`; use `npm ci` to
reproduce the dependency installation. The build itself uses only Node built-ins.

## Cloudflare Workers Builds settings

Production uses the following settings. Dashboard settings and the GitHub
integration are managed separately from this repository:

| Setting | Value |
| --- | --- |
| Worker name | `serifsadi-web` |
| Production branch | `main` |
| Root directory | Repository root |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Static assets directory | `./dist` (set in `wrangler.jsonc`) |

This uses Workers Static Assets only: no Worker runtime script, API, bindings or
SPA fallback. Missing paths return 404. The production custom domain, DNS, HTTPS
and WWW redirects are managed in Cloudflare; no custom domain, route or account ID
is declared in `wrangler.jsonc`. The Cloudflare plan is managed in the dashboard.

The existing Cloudflare GitHub integration builds and deploys production updates
from `main`. The deploy command above publishes to Cloudflare in that pipeline.
Use `--dry-run` for local validation without deploying. A dry run does not verify
account permissions, the connected GitHub repository/branch, or production domain
routing. Local builds do not change DNS or hosting settings.
