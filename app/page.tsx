import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Code,
  Tag,
  Zap,
  FolderTree,
  TerminalSquare,
  Search,
  FileCode2,
  FolderOpen,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen text-foreground">
      <nav className="sticky top-0 z-50 border-b border-border/70 bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-base font-semibold">
            <TerminalSquare className="h-5 w-5 text-primary" />
            SnippetHub
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/sign-in"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign In
            </Link>
            <Link href="/auth/sign-up">
              <Button className="h-9 bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_1.1fr] lg:px-8">
        <div className="space-y-6 self-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/75 bg-card/70 px-3 py-1.5 text-xs uppercase tracking-wide text-muted-foreground">
            <FolderTree className="h-3.5 w-3.5" />
            Code snippet manager
          </div>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Organize your
            <span className="block bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              code snippets in one workspace
            </span>
          </h1>

          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Save, browse, and maintain reusable code with folder-style tags, language-aware previews, and snippet details.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Launch Workspace <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/sign-in">
              <Button size="lg" variant="outline" className="border-border/80 hover:bg-secondary/80">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="window-shell overflow-hidden rounded-xl">
          <div className="window-titlebar">
            <div className="window-controls">
              <span />
              <span />
              <span />
            </div>
            <p className="truncate px-2 text-xs text-muted-foreground">Workspace</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
              Find snippets by title or tag
            </div>
          </div>

          <div className="grid min-h-108 grid-cols-[220px_1fr]">
            <aside className="explorer-pane p-3">
              <p className="pane-header px-2">Quick Access</p>
              <div className="mt-2 space-y-1">
                <div className="explorer-row explorer-row-active flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" /> all-snippets
                </div>
                <div className="explorer-row flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" /> react
                </div>
                <div className="explorer-row flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" /> sql
                </div>
                <div className="explorer-row flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" /> utilities
                </div>
              </div>
            </aside>

            <div className="editor-pane">
              <div className="border-b border-border/75 px-3 py-2">
                <div className="inline-flex items-center gap-2 rounded-t-md border border-border/70 border-b-transparent bg-background/70 px-3 py-1.5 text-xs">
                  <FileCode2 className="h-3.5 w-3.5 text-primary" />
                  useAuthHook.ts
                </div>
              </div>

              <div className="space-y-3 p-3">
                <div className="ide-panel rounded-md p-3">
                  <p className="text-sm font-medium">useAuthHook.ts</p>
                  <p className="mt-1 text-xs text-muted-foreground">typescript · auth · hooks</p>
                </div>
                <div className="ide-panel rounded-md p-3">
                  <p className="text-sm font-medium">createOrder.sql</p>
                  <p className="mt-1 text-xs text-muted-foreground">sql · order · checkout</p>
                </div>
                <div className="ide-panel rounded-md p-3">
                  <p className="text-sm font-medium">productCard.tsx</p>
                  <p className="mt-1 text-xs text-muted-foreground">tsx · ui · ecommerce</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="ide-panel rounded-lg p-6 transition-colors hover:border-primary/40">
          <Code className="mb-4 h-9 w-9 text-primary" />
          <h3 className="mb-2 text-lg font-semibold">Syntax Highlighting</h3>
          <p className="text-sm text-muted-foreground">
            View snippets with language-specific formatting for clearer reading and editing.
          </p>
        </div>

        <div className="ide-panel rounded-lg p-6 transition-colors hover:border-primary/40">
          <Tag className="mb-4 h-9 w-9 text-primary" />
          <h3 className="mb-2 text-lg font-semibold">Folder-like Tags</h3>
          <p className="text-sm text-muted-foreground">
            Group snippets into tag folders to keep related code organized by topic or project.
          </p>
        </div>

        <div className="ide-panel rounded-lg p-6 transition-colors hover:border-primary/40">
          <Zap className="mb-4 h-9 w-9 text-primary" />
          <h3 className="mb-2 text-lg font-semibold">Snippet Editor</h3>
          <p className="text-sm text-muted-foreground">
            Create, update, and review snippet content with metadata in a focused editing view.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="window-shell rounded-xl p-8 text-center sm:p-10">
          <h2 className="text-3xl font-semibold">Ready to manage your code snippets?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Keep reusable code blocks organized, searchable, and easy to maintain in one place.
          </p>
          <Link href="/auth/sign-up" className="mt-7 inline-flex">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/60 bg-card/70">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>&copy; 2026 SnippetHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
