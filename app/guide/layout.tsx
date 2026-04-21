import Link from "next/link";

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-semibold tracking-tight">
              AI Gateway
            </h1>
            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/reporting"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Reporting
              </Link>
              <Link
                href="/guide"
                className="text-foreground font-medium"
              >
                Guide
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
