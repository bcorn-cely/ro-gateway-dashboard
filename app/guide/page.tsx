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
        <h2 className="text-3xl font-bold tracking-tight">Platform Guide</h2>
        <p className="text-muted-foreground mt-2">
          How apps get created, built, and deployed in this monorepo — and how to add a new one.
        </p>
      </div>

      <SectionCard number={1} title="How This Repo Works">
        <p>
          Each app in <code>apps/</code> is its own Vercel Project. They share the repo for
          structure, shared packages, and Turborepo caching — but they deploy independently to
          separate URLs.
        </p>
        <Callout>
          <strong>Key insight:</strong> Each app is a standalone deployment with its own URL,
          its own environment variables, and its own deployment lifecycle. Merging to{" "}
          <code>main</code> triggers production deploys for affected apps only.
        </Callout>
      </SectionCard>

      <SectionCard number={2} title="Repo Structure">
        <CodeBlock label="File structure">{`ro-platform/
├── apps/
│   ├── gateway-dashboard/     ← This app (Vercel Project #1)
│   ├── another-app/           ← Another app (Vercel Project #2)
│   └── ...
├── packages/
│   ├── ui/                    ← Shared component library
│   └── config/                ← Shared ESLint/TS config
├── .github/
│   └── workflows/
│       └── deploy.yml         ← GitHub Actions: builds + deploys via VERCEL_TOKEN
├── AGENTS.md                  ← Conventions for Claude Code
├── pnpm-workspace.yaml
├── turbo.json
└── package.json`}</CodeBlock>
        <div className="mt-4 space-y-2">
          <p>
            <code>apps/</code> — Deployable applications. Each directory is its own Vercel
            Project with a unique URL and deployment lifecycle.
          </p>
          <p>
            <code>packages/</code> — Shared code consumed by apps. Never deployed directly.
          </p>
          <p>
            <code>.github/workflows/</code> — CI/CD that builds and deploys using the Vercel
            CLI and a <code>VERCEL_TOKEN</code>.
          </p>
        </div>
      </SectionCard>

      <SectionCard number={3} title="How Deployment Works">
        <Callout>
          This is <strong>not</strong> Vercel&apos;s built-in Git Integration. Deployments are
          driven by <strong>GitHub Actions</strong> using a <code>VERCEL_TOKEN</code>.
        </Callout>
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="font-semibold text-base mb-2">On push to a feature branch:</h4>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>GitHub Actions detects which app(s) changed</li>
              <li>Runs <code>vercel deploy</code> for affected apps using the token</li>
              <li>Posts preview URLs back to the PR</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-base mb-2">On merge to main:</h4>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>GitHub Actions runs <code>vercel deploy --prod</code> for affected apps</li>
              <li>Production URLs update</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-base mb-2">Key config per app:</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Vercel project <code>rootDirectory</code> → <code>apps/&lt;project-name&gt;</code></li>
              <li><code>turbo.json</code> handles build orchestration and dependency-aware caching</li>
              <li>Environment variables are set per-project in Vercel</li>
            </ul>
          </div>
        </div>
      </SectionCard>

      <SectionCard number={4} title="Adding a New App">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-base mb-2">Step 1: Scaffold the app</h4>
            <CodeBlock label="Terminal">{`cd apps/
pnpx create-next-app@latest my-new-app --typescript --tailwind --use-pnpm
cd ..`}</CodeBlock>
          </div>
          <div>
            <h4 className="font-semibold text-base mb-2">Step 2: Create the Vercel Project</h4>
            <CodeBlock label="Terminal">{`cd apps/my-new-app
vercel --yes --scope vercel-internal-playground
cd ../..`}</CodeBlock>
            <p className="text-sm text-muted-foreground mt-2">
              This creates a Vercel Project with <code>rootDirectory</code> set to{" "}
              <code>apps/my-new-app</code>.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-base mb-2">Step 3: Wire CI/CD</h4>
            <p className="text-sm text-muted-foreground">
              The GitHub Actions workflow should already pick up the new app if it follows the
              conventions in <code>AGENTS.md</code>. Verify the workflow file includes the new
              app path in its trigger/detection logic.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-base mb-2">Step 4: First production deploy</h4>
            <CodeBlock label="Terminal">{`cd apps/my-new-app
vercel deploy --prod --yes --scope vercel-internal-playground
cd ../..`}</CodeBlock>
          </div>
        </div>
      </SectionCard>

      <SectionCard number={5} title="The Development Loop">
        <CodeBlock label="Terminal">{`# Create a feature branch
git checkout -b feat/new-widget

# Make changes in apps/my-new-app/
# Commit and push
git add apps/my-new-app/
git commit -m "feat(my-new-app): add usage widget"
git push -u origin feat/new-widget`}</CodeBlock>
        <div className="mt-4 space-y-2 text-muted-foreground">
          <p><strong className="text-foreground">What happens:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>GitHub Actions detects the push, identifies affected apps</li>
            <li>Runs <code>vercel deploy</code> for <code>apps/my-new-app</code> only</li>
            <li>Preview URL is posted to the PR</li>
            <li>Merging to <code>main</code> triggers <code>vercel deploy --prod</code></li>
          </ul>
        </div>
      </SectionCard>

      <SectionCard number={6} title="Turborepo Build Caching">
        <p>
          Turborepo caches build outputs. If <code>apps/my-new-app</code> hasn&apos;t changed
          and none of its <code>packages/</code> dependencies changed, the build is a cache
          hit — near-instant.
        </p>
        <div className="mt-4">
          <CodeBlock label="Terminal">{`# Run build for all apps (Turborepo figures out what changed)
pnpm turbo build

# Run build for a specific app
pnpm turbo build --filter=my-new-app`}</CodeBlock>
        </div>
        <p className="mt-4">
          <code>turbo.json</code> defines the task pipeline: what runs, in what order, and
          what&apos;s cacheable.
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
                <TableCell>Build orchestration, caching, task pipeline</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">pnpm-workspace.yaml</TableCell>
                <TableCell>Defines which directories are workspace packages</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">AGENTS.md</TableCell>
                <TableCell>Conventions for Claude Code when adding new apps</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">.github/workflows/deploy.yml</TableCell>
                <TableCell>GitHub Actions CI/CD using VERCEL_TOKEN</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">apps/&lt;app&gt;/package.json</TableCell>
                <TableCell>Must have unique name field</TableCell>
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
          are structured instruction packages that extend AI agent capabilities — Claude Code,
          Cursor, GitHub Copilot, and 15+ other agents. They teach the agent patterns,
          conventions, and best practices without manual explanation in every prompt.
        </p>

        <div className="mt-4">
          <CodeBlock label="Terminal">{`# Install a skill
npx skills add <owner/repo>`}</CodeBlock>
        </div>

        <h4 className="font-semibold text-base mt-6 mb-3">Recommended skills for this repo:</h4>
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
                <TableCell>React/Next.js patterns, Server Components, rendering</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Find Skills</TableCell>
                <TableCell className="font-mono text-xs">npx skills add vercel-labs/find-skills</TableCell>
                <TableCell>Meta-skill: discovers and installs additional skills</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Repo Conventions</TableCell>
                <TableCell className="font-mono text-xs">Defined in AGENTS.md</TableCell>
                <TableCell>How to add apps, naming, deployment workflow</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <Callout>
          <strong>Why this matters:</strong> Skills make Claude Code (and other agents)
          immediately productive in this repo without manual onboarding. An agent with the
          right skills installed knows how to scaffold apps, follow naming conventions, and
          deploy correctly from the first prompt.
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
