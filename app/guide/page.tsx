import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function SectionCard({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <Badge variant="secondary" className="h-7 w-7 rounded-full p-0 flex items-center justify-center text-xs font-bold shrink-0">
            {number}
          </Badge>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="prose prose-invert prose-sm max-w-none">
        {children}
      </CardContent>
    </Card>
  );
}

function CodeBlock({ label, children }: { label?: string; children: string }) {
  return (
    <div className="not-prose">
      {label && (
        <div className="text-xs text-muted-foreground mb-1 font-mono">{label}</div>
      )}
      <div className="bg-zinc-950 border border-border rounded-lg p-4 overflow-x-auto">
        <pre className="font-mono text-sm text-zinc-300 leading-relaxed whitespace-pre">
          {children}
        </pre>
      </div>
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose border-l-4 border-chart-1 bg-chart-1/5 rounded-r-lg px-4 py-3 text-sm">
      {children}
    </div>
  );
}

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Monorepo Deployment Guide</h2>
        <p className="text-muted-foreground mt-2">
          How to deploy multiple independent apps from a single Turborepo monorepo using
          GitHub Actions and the Vercel CLI — no microfrontends, no multizone, no built-in Git Integration.
        </p>
      </div>

      <SectionCard number={1} title="The Problem">
        <p>
          You have one repo with multiple apps. Each app needs its own Vercel Project, its own
          URL, and its own deployment lifecycle. Vercel&apos;s built-in Git Integration links
          one repo to one project — it doesn&apos;t natively handle &quot;push to this repo
          deploys five different projects depending on what changed.&quot;
        </p>
        <p>
          The solution: <strong>GitHub Actions + the Vercel CLI + a <code>VERCEL_TOKEN</code></strong>.
          Your CI pipeline detects which apps changed, then runs <code>vercel deploy</code> for
          each affected app using the CLI. No microfrontends. No multizone. Each app is a
          completely independent Vercel Project that happens to live in the same repo.
        </p>
        <Callout>
          <strong>This is not multizone.</strong> Multizone composes multiple Next.js apps under
          one domain with path-based routing. This pattern gives each app its own domain and its
          own deployment — they just share a repo for code reuse and build caching.
        </Callout>
      </SectionCard>

      <SectionCard number={2} title="How It Works">
        <p>The architecture has three layers:</p>
        <div className="mt-2 space-y-3">
          <p>
            <strong>Turborepo monorepo</strong> — pnpm workspaces define which directories are
            packages. <code>turbo.json</code> orchestrates builds and caches outputs. Apps live
            in <code>apps/</code>, shared libraries in <code>packages/</code>.
          </p>
          <p>
            <strong>Independent Vercel Projects</strong> — each app in <code>apps/</code> is
            linked to its own Vercel Project with <code>rootDirectory</code> set to that app&apos;s
            folder. Each project has its own domain, environment variables, and deployment history.
          </p>
          <p>
            <strong>GitHub Actions CI/CD</strong> — a workflow uses a <code>VERCEL_TOKEN</code> to
            run <code>vercel deploy</code> for each affected app on every push. Feature branches
            get preview deployments. Merges to <code>main</code> trigger production deploys.
          </p>
        </div>
        <CodeBlock label="Repo structure">{`your-platform/
├── apps/
│   ├── dashboard/             ← Vercel Project #1 (dashboard.your-domain.com)
│   ├── docs/                  ← Vercel Project #2 (docs.your-domain.com)
│   ├── admin/                 ← Vercel Project #3 (admin.your-domain.com)
│   └── ...
├── packages/
│   ├── ui/                    ← Shared component library
│   ├── config/                ← Shared ESLint/TS config
│   └── db/                    ← Shared database utilities
├── .github/
│   └── workflows/
│       └── deploy.yml         ← Detects changes, deploys affected apps
├── pnpm-workspace.yaml
├── turbo.json
└── package.json`}</CodeBlock>
        <div className="mt-4 space-y-2">
          <p>
            <code>apps/</code> — Deployable applications. Each is its own Vercel Project with a
            unique URL. They can be Next.js, Remix, Astro, or any framework Vercel supports.
          </p>
          <p>
            <code>packages/</code> — Shared code consumed by apps via workspace dependencies.
            Never deployed directly. Changes here trigger rebuilds of consuming apps.
          </p>
          <p>
            <code>.github/workflows/</code> — The CI/CD pipeline that replaces Vercel&apos;s
            built-in Git Integration. This is where the <code>VERCEL_TOKEN</code> is used.
          </p>
        </div>
      </SectionCard>

      <SectionCard number={3} title="The Deployment Pipeline">
        <Callout>
          <strong>Why not use Vercel&apos;s Git Integration?</strong> The built-in integration
          maps one repo → one project. With multiple apps in one repo, you need to control
          which apps deploy on each push. GitHub Actions gives you that control.
        </Callout>
        <div className="mt-4 space-y-6">
          <div>
            <h4 className="font-semibold text-base mb-2">On push to a feature branch:</h4>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>GitHub Actions triggers on the push</li>
              <li>The workflow detects which <code>apps/</code> directories have changes (using git diff or Turborepo&apos;s <code>--filter</code>)</li>
              <li>For each affected app, runs <code>vercel deploy</code> using the <code>VERCEL_TOKEN</code></li>
              <li>Preview URLs are posted back to the PR as comments</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-base mb-2">On merge to main:</h4>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Same detection logic identifies affected apps</li>
              <li>Runs <code>vercel deploy --prod</code> for each affected app</li>
              <li>Production URLs update — only for apps that actually changed</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-base mb-3">Example workflow:</h4>
            <CodeBlock label=".github/workflows/deploy.yml">{`name: Deploy
on:
  push:
    branches: [main]
  pull_request:

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      dashboard: \${{ steps.filter.outputs.dashboard }}
      docs: \${{ steps.filter.outputs.docs }}
      admin: \${{ steps.filter.outputs.admin }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v3
        id: filter
        with:
          filters: |
            dashboard:
              - 'apps/dashboard/**'
              - 'packages/**'
            docs:
              - 'apps/docs/**'
              - 'packages/**'
            admin:
              - 'apps/admin/**'
              - 'packages/**'

  deploy-dashboard:
    needs: detect-changes
    if: needs.detect-changes.outputs.dashboard == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: |
          if [ "\${{ github.event_name }}" = "push" ]; then
            vercel deploy --prod --token=\${{ secrets.VERCEL_TOKEN }}
          else
            vercel deploy --token=\${{ secrets.VERCEL_TOKEN }}
          fi
        working-directory: apps/dashboard
        env:
          VERCEL_ORG_ID: \${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: \${{ secrets.VERCEL_DASHBOARD_PROJECT_ID }}`}</CodeBlock>
          </div>
          <Callout>
            <strong>Key detail:</strong> each app needs its own <code>VERCEL_PROJECT_ID</code>{" "}
            secret because each app is a separate Vercel Project. The <code>VERCEL_ORG_ID</code>{" "}
            and <code>VERCEL_TOKEN</code> are shared across all apps.
          </Callout>
        </div>
      </SectionCard>

      <SectionCard number={4} title="Setting Up a New App">
        <p>
          When you add a new app to the monorepo, you need to create both the app code and
          a corresponding Vercel Project with <code>rootDirectory</code> pointing to the app folder.
        </p>
        <div className="mt-4 space-y-6">
          <div>
            <h4 className="font-semibold text-base mb-2">Step 1: Scaffold the app</h4>
            <CodeBlock label="Terminal">{`cd apps/
pnpx create-next-app@latest my-new-app --typescript --tailwind --use-pnpm
cd ..`}</CodeBlock>
          </div>
          <div>
            <h4 className="font-semibold text-base mb-2">Step 2: Create the Vercel Project</h4>
            <CodeBlock label="Terminal">{`cd apps/my-new-app
vercel link        # creates .vercel/project.json with project + org IDs
cd ../..`}</CodeBlock>
            <p className="text-sm text-muted-foreground mt-2">
              This creates a Vercel Project with <code>rootDirectory</code> set to{" "}
              <code>apps/my-new-app</code>. Grab the project ID from{" "}
              <code>.vercel/project.json</code> — you&apos;ll need it as a GitHub Actions secret.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-base mb-2">Step 3: Add to CI/CD</h4>
            <p className="text-sm text-muted-foreground">
              Add a new job to <code>deploy.yml</code> following the same pattern as existing
              apps. Add a new path filter, a new deploy job, and a new{" "}
              <code>VERCEL_*_PROJECT_ID</code> secret in your repo settings.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-base mb-2">Step 4: First deploy</h4>
            <CodeBlock label="Terminal">{`cd apps/my-new-app
vercel deploy --prod --token=$VERCEL_TOKEN
cd ../..`}</CodeBlock>
          </div>
        </div>
      </SectionCard>

      <SectionCard number={5} title="Why This Pattern">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-base mb-1">Independent deployment lifecycles</h4>
            <p className="text-muted-foreground">
              Pushing a change to <code>apps/docs</code> doesn&apos;t redeploy your dashboard.
              Each app only rebuilds when its own code or its dependencies in <code>packages/</code> change.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-base mb-1">Shared code without duplication</h4>
            <p className="text-muted-foreground">
              Your UI components, database utilities, config, and types live in <code>packages/</code>{" "}
              and are consumed as workspace dependencies. One source of truth, multiple consumers.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-base mb-1">Turborepo build caching</h4>
            <p className="text-muted-foreground">
              If nothing changed in an app or its dependencies, Turborepo skips the build entirely.
              In CI, remote caching means builds that already ran on another machine are instant.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-base mb-1">No framework lock-in per app</h4>
            <p className="text-muted-foreground">
              One app can be Next.js 16, another can be Astro, another can be a plain API.
              They&apos;re independent Vercel Projects — the monorepo is just a code organization choice.
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard number={6} title="Turborepo Build Caching">
        <p>
          Turborepo caches build outputs based on file hashes. If an app&apos;s source files
          and its dependency tree haven&apos;t changed, the build is a cache hit — near-instant
          locally and in CI with remote caching enabled.
        </p>
        <div className="mt-4">
          <CodeBlock label="Terminal">{`# Build all apps (Turborepo skips unchanged ones)
pnpm turbo build

# Build only one app and its dependencies
pnpm turbo build --filter=dashboard

# See what Turborepo would build without running it
pnpm turbo build --dry-run`}</CodeBlock>
        </div>
        <p className="mt-4">
          <code>turbo.json</code> defines the task pipeline: what runs, in what order, and
          what&apos;s cacheable. Combined with the GitHub Actions workflow, this means CI only
          rebuilds what actually changed.
        </p>
      </SectionCard>

      <SectionCard number={7} title="Key Files Reference">
        <div className="not-prose">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Purpose</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-sm">turbo.json</TableCell>
                <TableCell>Build orchestration, caching, task pipeline definitions</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">pnpm-workspace.yaml</TableCell>
                <TableCell>Defines which directories are workspace packages</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">.github/workflows/deploy.yml</TableCell>
                <TableCell>CI/CD — detects changes, deploys affected apps via VERCEL_TOKEN</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">apps/&lt;app&gt;/.vercel/project.json</TableCell>
                <TableCell>Links each app directory to its Vercel Project (org + project IDs)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">apps/&lt;app&gt;/package.json</TableCell>
                <TableCell>Must have a unique name field for workspace resolution</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard number={8} title="Limits to Know">
        <div className="not-prose">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Constraint</TableHead>
                <TableHead className="text-right">Hobby</TableHead>
                <TableHead className="text-right">Pro</TableHead>
                <TableHead className="text-right">Enterprise</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Max Vercel Projects per repo</TableCell>
                <TableCell className="text-right font-mono">10</TableCell>
                <TableCell className="text-right font-mono">60</TableCell>
                <TableCell className="text-right font-mono">Custom</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Concurrent builds</TableCell>
                <TableCell className="text-right font-mono">1</TableCell>
                <TableCell className="text-right font-mono">12</TableCell>
                <TableCell className="text-right font-mono">Custom</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <p className="mt-4">
          The concurrent builds limit matters most here — if you push a change that affects
          5 apps, they queue. On Pro with 12 concurrent builds, this is rarely an issue.
          See{" "}
          <a
            href="https://vercel.com/docs/limits"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Vercel Limits
          </a>{" "}
          for the full list.
        </p>
      </SectionCard>

      <SectionCard number={9} title="Agent Skills">
        <p>
          <a
            href="https://skills.sh"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Skills
          </a>{" "}
          are structured instruction packages that extend AI coding agents — Claude Code,
          Cursor, GitHub Copilot, and 15+ others. They teach the agent patterns,
          conventions, and best practices without manual explanation in every prompt.
        </p>

        <div className="mt-4">
          <CodeBlock label="Terminal">{`# Install a skill into your repo
npx skills add <owner/repo>`}</CodeBlock>
        </div>

        <h4 className="font-semibold text-base mt-6 mb-3">Recommended for monorepo development:</h4>
        <div className="not-prose">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill</TableHead>
                <TableHead>Install</TableHead>
                <TableHead>Purpose</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">React Best Practices</TableCell>
                <TableCell className="font-mono text-xs">npx skills add vercel-labs/vercel-react-best-practices</TableCell>
                <TableCell>React/Next.js patterns, Server Components, rendering strategies</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Find Skills</TableCell>
                <TableCell className="font-mono text-xs">npx skills add vercel-labs/find-skills</TableCell>
                <TableCell>Meta-skill: discovers and installs additional skills as needed</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <Callout>
          <strong>For monorepos specifically:</strong> add an <code>AGENTS.md</code> at the repo
          root that documents your conventions — where apps go, naming patterns, how to wire
          CI/CD for a new app, which secrets to add. This file is what makes any AI coding agent
          immediately productive in the repo without manual onboarding.
        </Callout>

        <p className="mt-4">
          Browse 91K+ skills at{" "}
          <a
            href="https://skills.sh"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-foreground"
          >
            skills.sh
          </a>
          .
        </p>
      </SectionCard>
    </div>
  );
}
