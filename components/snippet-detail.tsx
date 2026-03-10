'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CodeDisplay } from './code-display';
import { SnippetEditor } from './snippet-editor';
import { ArrowLeft, Edit, Trash2, FileCode2, CalendarClock, Tag, Share2, Check, Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Snippet = {
  id: string;
  title: string;
  description?: string;
  language: string;
  tags?: Array<{ id: string; name: string }>;
  code: string;
  isShared: boolean;
  created_at: string;
  updated_at: string;
};

type SnippetDetailProps = {
  snippetId: string;
};

export function SnippetDetail({ snippetId }: SnippetDetailProps) {
  const router = useRouter();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [isTogglingShare, setIsTogglingShare] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSnippet();
  }, []);

  const fetchSnippet = async () => {
    try {
      const response = await fetch(`/api/snippets/${snippetId}`);
      if (!response.ok) {
        setError('Failed to load snippet');
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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this snippet?')) return;

    try {
      const response = await fetch(`/api/snippets/${snippetId}`, { method: 'DELETE' });
      if (response.ok) {
        router.push('/dashboard');
      } else {
        setError('Failed to delete snippet');
      }
    } catch (err) {
      setError('Failed to delete snippet');
    }
  };

  const handleToggleShare = async () => {
    if (!snippet) return;

    setIsTogglingShare(true);
    try {
      const response = await fetch(`/api/snippets/${snippetId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isShared: !snippet.isShared }),
      });

      if (response.ok) {
        const data = await response.json();
        setSnippet(data.snippet);
        if (!snippet.isShared) {
          setShowShareDialog(true);
        }
      }
    } catch (err) {
      console.error('[v0] Toggle share error:', err);
    } finally {
      setIsTogglingShare(false);
    }
  };

  const copyShareLink = () => {
    if (!snippet) return;
    const link = `${window.location.origin}/share/${snippet.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <Button
          onClick={() => router.push('/dashboard')}
          variant="outline"
          className="border-border/80 bg-card/80 text-foreground hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Workspace
        </Button>
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
            <span className="truncate text-sm text-muted-foreground">Workspace / snippets / {snippet.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleToggleShare}
              variant="outline"
              className="h-8 border-border/80 bg-card/75 px-3 hover:bg-secondary"
              disabled={isTogglingShare}
            >
              <Share2 className="mr-1.5 h-4 w-4" />
              {snippet.isShared ? 'Shared' : 'Share'}
            </Button>
            <Button
              onClick={() => setShowEditor(true)}
              variant="outline"
              className="h-8 border-border/80 bg-card/75 px-3 hover:bg-secondary"
            >
              <Edit className="mr-1.5 h-4 w-4" />
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              variant="outline"
              className="h-8 border-destructive/40 bg-card/75 px-2.5 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[280px_1fr]">
          <aside className="explorer-pane p-3 sm:p-4">
            <Button
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="mb-4 w-full justify-start border-border/80 bg-card/70 hover:bg-secondary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Workspace
            </Button>

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
                    Last updated
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(snippet.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
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

      {showEditor && (
        <SnippetEditor
          initialData={snippet}
          onClose={() => setShowEditor(false)}
          onSave={() => {
            setShowEditor(false);
            fetchSnippet();
          }}
        />
      )}

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Snippet Shared!</DialogTitle>
            <DialogDescription>
              Anyone with the link can now view this snippet.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 mt-4">
            <input
              readOnly
              value={`${typeof window !== 'undefined' ? window.location.origin : ''}/share/${snippet?.id}`}
              className="flex-1 px-3 py-2 text-sm bg-secondary rounded-md border border-input"
            />
            <Button onClick={copyShareLink} variant="secondary" size="icon">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <Button
            onClick={() => setShowShareDialog(false)}
            className="w-full mt-2"
          >
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
