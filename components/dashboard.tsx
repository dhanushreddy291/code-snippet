'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import { UserButton } from '@neondatabase/auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Files, Tags, FolderTree, Search, MonitorCog, FolderOpen } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 text-foreground sm:p-4">
      <div className="window-shell mx-auto flex min-h-[calc(100vh-1.5rem)] w-full max-w-425 flex-col overflow-hidden rounded-xl sm:min-h-[calc(100vh-2rem)]">
        <header className="window-titlebar h-12">
          <div className="window-controls">
            <button
              type="button"
              onClick={() => router.push('/')}
              aria-label="Close window"
              title="Close"
              className="h-3 w-3 rounded-full border border-black/30 bg-[#ff5f57] transition-transform hover:scale-105 active:scale-95"
            />
            <button
              type="button"
              onClick={() => router.push('/')}
              aria-label="Minimize window"
              title="Minimize"
              className="h-3 w-3 rounded-full border border-black/30 bg-[#febc2e] transition-transform hover:scale-105 active:scale-95"
            />
            <button
              type="button"
              aria-label="Maximize window"
              title="Maximize"
              className="h-3 w-3 rounded-full border border-black/30 bg-[#28c840] transition-transform hover:scale-105 active:scale-95"
            />
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <MonitorCog className="h-4 w-4 text-primary" />
            <p className="truncate text-xs text-muted-foreground sm:text-sm">
              SnippetHub
            </p>
          </div>

          <div className="flex items-center gap-3">

            <Button
              onClick={() => {
                setEditingSnippet(null);
                setShowEditor(true);
              }}
              className="h-8 bg-primary px-3 text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              New File
            </Button>
            <UserButton variant={"ghost"} size={"sm"} />
          </div>
        </header>

        <main className="grid min-h-0 flex-1 lg:grid-cols-[300px_1fr]">
          <aside className="explorer-pane flex min-h-0 flex-col">
            <div className="p-3 sm:p-4">
              <div className="grid grid-cols-2 gap-3">
                <Card className="ide-panel p-3">
                  <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Files className="h-3 w-3" />
                    Files
                  </div>
                  <p className="text-lg font-semibold">{snippets.length}</p>
                </Card>
                <Card className="ide-panel p-3">
                  <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Tags className="h-3 w-3" />
                    Tags
                  </div>
                  <p className="text-lg font-semibold">{tags.length}</p>
                </Card>
              </div>
            </div>

            <Card className="mx-3 mb-3 flex min-h-0 flex-1 flex-col border-border/70 bg-card/75 p-0 sm:mx-4 sm:mb-4">
              <div className="pane-header flex items-center gap-2 border-b border-border/70 px-3">
                <FolderTree className="h-3.5 w-3.5" />
                Explorer
              </div>
              <div className="space-y-1 overflow-y-auto p-2.5">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`explorer-row flex items-center gap-2 ${selectedTag === null ? 'explorer-row-active' : ''}`}
                >
                  <FolderOpen className="h-3.5 w-3.5 shrink-0" />
                  all-snippets
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTag(tag.name)}
                    className={`explorer-row flex items-center justify-between gap-2 ${selectedTag === tag.name ? 'explorer-row-active' : ''}`}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <FolderOpen className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{tag.name}</span>
                    </span>
                    <span className="text-xs opacity-75">{tag.snippetCount}</span>
                  </button>
                ))}
              </div>
            </Card>
          </aside>

          <section className="editor-pane min-h-0 overflow-y-auto p-4 md:p-6">
            {error && (
              <div className="mb-4 rounded border border-destructive/35 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="mb-5 border-b border-border/70 pb-3">
              <h2 className="text-xl font-semibold md:text-2xl">
                {selectedTag ? `#${selectedTag}` : 'All Snippets'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {snippets.length} file{snippets.length !== 1 ? 's' : ''} in your workspace
              </p>
            </div>

            <SnippetList
              snippets={snippets}
              onEdit={handleEdit}
              onDelete={handleDelete}
              selectedTag={selectedTag || undefined}
            />
          </section>
        </main>
      </div>

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
