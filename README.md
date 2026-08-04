This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Private packages (`@omnixys/*`)

This project depends on private packages served from the GitHub Packages registry. They require authentication. **A `.npmrc` is never committed to this repository.** Instead, a temporary `.npmrc` is generated at install/build time from the `OMNIXYS_TOKEN` environment variable.

> Why not `preinstall`? pnpm runs the root project's `preinstall` script only *after* dependency resolution, so it is too late to authenticate private packages on a fresh install (fails with `401`). The `.npmrc` must exist before `pnpm install` starts, which is why generation happens in the install command itself.

### Local development

1. Export the token (needs `read:packages` on GitHub Packages):
   ```bash
   export OMNIXYS_TOKEN=<your-token>
   ```
2. Generate the temporary `.npmrc` (one time after cloning):
   ```bash
   pnpm registry:setup
   ```
3. Install as usual:
   ```bash
   pnpm install
   ```

To remove the temporary `.npmrc` again:

```bash
pnpm registry:cleanup
```

### Vercel

`vercel.json` sets `installCommand` so the `.npmrc` is generated *before* `pnpm install --frozen-lockfile` runs. You only need to configure the env var once in the Vercel project:

- Project → Settings → Environment Variables
- Name: `OMNIXYS_TOKEN`
- Add it for **Production** and **Preview** (and Development if needed).

The `.npmrc` exists only inside the ephemeral build sandbox and is never committed.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
