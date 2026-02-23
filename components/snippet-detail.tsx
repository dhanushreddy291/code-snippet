'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CodeDisplay } from './code-display';
import { SnippetEditor } from './snippet-editor';
import { ArrowLeft, Edit, Trash2, Copy, Check } from 'lucide-react';

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

type SnippetDetailProps = {
  snippetId: string;
};

export function SnippetDetail({ snippetId }: SnippetDetailProps) {
  const router = useRouter();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditor, setShowEditor] = useState(false);
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

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Button
          onClick={() => router.push('/dashboard')}
          variant="outline"
          className="border-border text-foreground hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="mt-8 text-center text-muted-foreground">{error || 'Snippet not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          onClick={() => router.push('/dashboard')}
          variant="outline"
          className="mb-6 border-border text-foreground hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="border border-border bg-card p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{snippet.title}</h1>
                <span className="px-3 py-1 text-sm bg-primary/20 text-primary rounded">
                  {snippet.language}
                </span>
              </div>

              {snippet.description && (
                <p className="text-muted-foreground text-lg mb-4">{snippet.description}</p>
              )}

              {snippet.tags && snippet.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {snippet.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="bg-secondary/50 text-foreground"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 ml-4">
              <Button
                onClick={() => setShowEditor(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              Created:{' '}
              {new Date(snippet.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            {snippet.updated_at !== snippet.created_at && (
              <p>
                Last updated:{' '}
                {new Date(snippet.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>
        </Card>

        <Card className="border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Code</h2>
          <CodeDisplay
            code={snippet.code}
            language={snippet.language}
            onCopy={handleCopy}
          />
        </Card>
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
    </div>
  );
}
