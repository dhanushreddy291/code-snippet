import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Tag, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-xl font-bold">SnippetHub</div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/sign-in"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              Organize Your Code
              <span className="block bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Snippets Effortlessly
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Save, organize, and discover code snippets with powerful tagging, syntax highlighting, and fast search.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Start for Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/auth/sign-in">
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-secondary"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
            <Code className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Syntax Highlighting</h3>
            <p className="text-muted-foreground">
              100+ programming languages with beautiful, automatic syntax highlighting powered by Shiki.
            </p>
          </div>

          <div className="border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
            <Tag className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Smart Tagging</h3>
            <p className="text-muted-foreground">
              Create custom tags and assign multiple tags to each snippet for powerful organization and filtering.
            </p>
          </div>

          <div className="border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
            <Zap className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Fast & Responsive</h3>
            <p className="text-muted-foreground">
              Lightning-fast search, instant filtering, and a snappy interface built for developers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-card border border-border/50 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to organize your snippets?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join developers who are already using SnippetHub to manage their code collection.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Create Free Account <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2024 SnippetHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
