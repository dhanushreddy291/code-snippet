'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import { UserButton } from '@neondatabase/auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { SnippetEditor } from './snippet-editor';
import { SnippetList } from './snippet-list';

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

type Tag = {
  id: string;
  name: string;
  snippetCount: number;
};

export function Dashboard() {
  const router = useRouter();
  const { data: sessionData, isPending: sessionLoading } = authClient.useSession();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionLoading && !sessionData?.user) {
      router.push('/auth/sign-in');
      return;
    }
    if (sessionData?.user) {
      fetchData();
    }
  }, [sessionData, sessionLoading]);

  const fetchData = async () => {
    try {
      // Fetch snippets
      const snippetsRes = await fetch('/api/snippets');
      if (snippetsRes.ok) {
        const snippetsData = await snippetsRes.json();
        setSnippets(snippetsData.snippets);
      }

      // Fetch tags
      const tagsRes = await fetch('/api/tags');
      if (tagsRes.ok) {
        const tagsData = await tagsRes.json();
        setTags(tagsData.tags);
      }
    } catch (err) {
      setError('Failed to load dashboard');
      console.error('[v0] Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setShowEditor(true);
  };

  const handleDelete = async (snippetId: string) => {
    try {
      const response = await fetch(`/api/snippets/${snippetId}`, { method: 'DELETE' });
      if (response.ok) {
        setSnippets((prev) => prev.filter((s) => s.id !== snippetId));
        await fetchData();
      }
    } catch (err) {
      setError('Failed to delete snippet');
    }
  };

  const handleSave = (snippet: Snippet) => {
    setShowEditor(false);
    setEditingSnippet(null);
    fetchData();
  };

  if (loading || sessionLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">SnippetHub</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {sessionData?.user?.name}</p>
          </div>
          <UserButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/30 rounded text-destructive">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Button
              onClick={() => {
                setEditingSnippet(null);
                setShowEditor(true);
              }}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mb-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Snippet
            </Button>

            {tags.length > 0 && (
              <Card className="border border-border bg-card p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Tags ({tags.length})</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${selectedTag === null
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                      }`}
                  >
                    All Snippets
                  </button>
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => setSelectedTag(tag.name)}
                      className={`w-full text-left px-3 py-2 rounded transition-colors flex items-center justify-between ${selectedTag === tag.name
                          ? 'bg-primary/20 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                        }`}
                    >
                      <span className="truncate">{tag.name}</span>
                      <span className="text-xs ml-2 opacity-75">{tag.snippetCount}</span>
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {selectedTag ? `Tag: ${selectedTag}` : 'Your Snippets'}
              </h2>
              <p className="text-muted-foreground">
                {snippets.length} total snippet{snippets.length !== 1 ? 's' : ''}
              </p>
            </div>

            <SnippetList
              snippets={snippets}
              onEdit={handleEdit}
              onDelete={handleDelete}
              selectedTag={selectedTag || undefined}
            />
          </div>
        </div>
      </main>

      {showEditor && (
        <SnippetEditor
          initialData={editingSnippet}
          onClose={() => {
            setShowEditor(false);
            setEditingSnippet(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
