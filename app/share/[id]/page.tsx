'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CodeDisplay } from '@/components/code-display';
import { FileCode2, CalendarClock, Tag, ArrowLeft } from 'lucide-react';

type Snippet = {
  id: string;
  title: string;
  description?: string;
  language: string;
  tags?: Array<{ id: string; name: string }>;
  code: string;
  created_at: string;
  updated_at: string;
};

export default function SharePage() {
  const params = useParams();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSnippet();
  }, []);

  const fetchSnippet = async () => {
    try {
      const response = await fetch(`/api/snippets/public/${params.id}`);
      if (!response.ok) {
        setError('Snippet not found or not shared');
        return;
      }
      const data = await response.json();
      setSnippet(data.snippet);
    } catch (err) {
      setError('Failed to load snippet');
      console.error('[v0] Fetch snippet error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading file...
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="min-h-screen p-4 md:p-6">
        <div className="mt-8 text-center text-muted-foreground">{error || 'Snippet not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 text-foreground sm:p-4">
      <div className="window-shell mx-auto flex min-h-[calc(100vh-1.5rem)] w-full max-w-[1700px] flex-col overflow-hidden rounded-xl sm:min-h-[calc(100vh-2rem)]">
        <header className="window-titlebar h-12">
          <div className="window-controls">
            <span />
            <span />
            <span />
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <FileCode2 className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate text-sm text-muted-foreground">Shared / {snippet.title}</span>
          </div>
          <div />
        </header>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[280px_1fr]">
          <aside className="explorer-pane p-3 sm:p-4">
            <Card className="ide-panel h-fit p-4">
              <h2 className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">File Info</h2>
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Name</p>
                  <p className="break-words font-medium">{snippet.title}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Language</p>
                  <span className="rounded-md border border-primary/35 bg-primary/15 px-2 py-1 text-xs text-primary">
                    {snippet.language}
                  </span>
                </div>
                <div>
                  <p className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" />
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {snippet.tags && snippet.tags.length > 0 ? (
                      snippet.tags.map((tag) => (
                        <Badge key={tag.id} variant="secondary" className="border-border/70 bg-secondary/85 text-foreground">
                          {tag.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No tags</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarClock className="h-3.5 w-3.5" />
                    Created
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(snippet.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </Card>
          </aside>

          <section className="editor-pane min-h-0 overflow-y-auto p-4 md:p-6">
            <Card className="ide-panel overflow-hidden">
              <div className="border-b border-border/75 bg-card/85 px-4 py-3">
                <h2 className="font-medium">{snippet.title}.{snippet.language}</h2>
                {snippet.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{snippet.description}</p>
                )}
              </div>
              <div className="p-4">
                <CodeDisplay code={snippet.code} language={snippet.language} />
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
