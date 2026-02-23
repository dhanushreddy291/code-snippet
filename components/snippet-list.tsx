'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Search } from 'lucide-react';
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
      snippet.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = !selectedTag || snippet.tags?.some((tag) => tag.name === selectedTag);

    return matchesSearch && matchesTag;
  });

  if (snippets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No snippets yet</h3>
        <p className="text-muted-foreground mb-6">Create your first code snippet to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search snippets by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-input border border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {filteredSnippets.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No snippets match your search{selectedTag && ` for tag "${selectedTag}"`}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredSnippets.map((snippet) => (
            <Card
              key={snippet.id}
              className="border border-border bg-card hover:border-primary/50 transition-colors overflow-hidden"
            >
              <Link href={`/dashboard/snippets/${snippet.id}`}>
                <div className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer h-full flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground truncate flex-1">
                      {snippet.title}
                    </h3>
                    <span className="ml-2 px-2 py-1 text-xs bg-primary/20 text-primary rounded">
                      {snippet.language}
                    </span>
                  </div>

                  {snippet.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {snippet.description}
                    </p>
                  )}

                  {snippet.tags && snippet.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {snippet.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          className="text-xs bg-secondary/50 text-foreground"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-border flex gap-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        onEdit?.(snippet);
                      }}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        if (confirm('Are you sure you want to delete this snippet?')) {
                          onDelete?.(snippet.id);
                        }
                      }}
                      variant="outline"
                      className="border-destructive/30 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
