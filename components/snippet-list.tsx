'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Search, FileCode2, Clock3, Hash } from 'lucide-react';
import Link from 'next/link';

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

type SnippetListProps = {
  snippets: Snippet[];
  onEdit?: (snippet: Snippet) => void;
  onDelete?: (snippetId: string) => void;
  selectedTag?: string;
};

export function SnippetList({ snippets, onEdit, onDelete, selectedTag }: SnippetListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags?.some((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = !selectedTag || snippet.tags?.some((tag) => tag.name === selectedTag);

    return matchesSearch && matchesTag;
  });

  if (snippets.length === 0) {
    return (
      <div className="ide-panel flex flex-col items-center justify-center rounded-lg border-dashed py-16 text-center">
        <div className="mb-3 text-4xl">📁</div>
        <h3 className="mb-2 text-xl font-semibold text-foreground">No files yet</h3>
        <p className="text-muted-foreground">Create your first snippet to populate the workspace.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          placeholder="Search files by title, description, or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 border-border/80 bg-card/80 pl-10"
        />
      </div>

      {filteredSnippets.length === 0 ? (
        <div className="ide-panel rounded-lg border-dashed py-10 text-center text-muted-foreground">
          No snippets match your search{selectedTag && ` for tag "${selectedTag}"`}
        </div>
      ) : (
        <div className="ide-panel overflow-hidden rounded-lg">
          <div className="hidden grid-cols-[1.4fr_120px_180px_160px] gap-3 border-b border-border/75 bg-card/75 px-4 py-2.5 text-xs uppercase tracking-wide text-muted-foreground md:grid">
            <span>File</span>
            <span>Language</span>
            <span>Tags</span>
            <span>Updated</span>
          </div>

          {filteredSnippets.map((snippet) => (
            <div
              key={snippet.id}
              className="group border-b border-border/65 last:border-b-0 hover:bg-secondary/40 transition-colors"
            >
              <div className="grid items-center gap-3 px-4 py-3 md:grid-cols-[1.4fr_120px_180px_160px_auto]">
                <Link href={`/dashboard/snippets/${snippet.id}`} className="min-w-0">
                  <div className="flex min-w-0 items-start gap-3">
                    <FileCode2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <h3 className="truncate font-medium text-foreground transition-colors group-hover:text-primary">
                        {snippet.title}
                      </h3>
                      {snippet.description && (
                        <p className="text-sm text-muted-foreground truncate">{snippet.description}</p>
                      )}
                    </div>
                  </div>
                </Link>

                <div className="hidden md:flex items-center">
                  <span className="rounded-md border border-primary/35 bg-primary/15 px-2 py-0.5 text-xs text-primary">
                    {snippet.language}
                  </span>
                </div>

                <div className="hidden min-w-0 items-center gap-1.5 md:flex">
                  {snippet.tags && snippet.tags.length > 0 ? (
                    snippet.tags.slice(0, 2).map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="border-border/65 bg-secondary/80 text-xs text-foreground"
                      >
                        {tag.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                  {snippet.tags && snippet.tags.length > 2 && (
                    <span className="text-xs text-muted-foreground">+{snippet.tags.length - 2}</span>
                  )}
                </div>

                <div className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
                  <Clock3 className="h-3.5 w-3.5" />
                  {new Date(snippet.updated_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    onClick={() => onEdit?.(snippet)}
                    variant="outline"
                    className="h-8 border-border/75 bg-card/70 px-2.5 hover:bg-secondary/80"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this snippet?')) {
                        onDelete?.(snippet.id);
                      }
                    }}
                    variant="outline"
                    className="h-8 border-destructive/35 bg-card/70 px-2.5 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="col-span-full flex items-center gap-2 text-xs text-muted-foreground md:hidden">
                  <Hash className="h-3.5 w-3.5" />
                  <span>{snippet.language}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
