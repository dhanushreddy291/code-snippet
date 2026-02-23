'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';

const LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'react',
  'jsx',
  'tsx',
  'html',
  'css',
  'sql',
  'bash',
  'json',
  'xml',
  'yaml',
  'markdown',
  'go',
  'rust',
  'java',
  'csharp',
  'php',
  'ruby',
];

type SnippetEditorProps = {
  onClose: () => void;
  onSave?: (snippet: any) => void;
  initialData?: any;
};

export function SnippetEditor({ onClose, onSave, initialData }: SnippetEditorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    code: initialData?.code || '',
    language: initialData?.language || 'javascript',
    tags: initialData?.tags?.map((t: any) => t.name) || [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (value: string) => {
    setFormData((prev) => ({ ...prev, language: value }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = initialData ? `/api/snippets/${initialData.id}` : '/api/snippets';
      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save snippet');
      }

      const result = await response.json();
      onSave?.(result.snippet);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
      <Card className="window-shell w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-xl border border-border/80 p-0">
        <div className="window-titlebar">
          <div className="window-controls">
            <span />
            <span />
            <span />
          </div>
          <p className="text-sm text-muted-foreground">{initialData ? 'Edit Snippet File' : 'Create New Snippet File'}</p>
          <button
            onClick={onClose}
            className="rounded-sm p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">
              {initialData ? 'Edit Snippet' : 'New Snippet'}
            </h2>
          </div>

          {error && (
            <div className="mb-4 rounded border border-destructive/35 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-foreground">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter snippet title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 border-border/80 bg-input/90 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-foreground">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of the snippet"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 min-h-20 border-border/80 bg-input/90 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <Label htmlFor="language" className="text-foreground">
                Programming Language
              </Label>
              <Select value={formData.language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="mt-1 border-border/80 bg-input/90 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border border-border/80 bg-card">
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang} className="text-foreground">
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="code" className="text-foreground">
                Code
              </Label>
              <Textarea
                id="code"
                name="code"
                placeholder="Paste your code here"
                value={formData.code}
                onChange={handleChange}
                required
                className="mt-1 min-h-56 border-border/80 bg-input/90 font-mono text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <Label className="text-foreground">Tags</Label>
              <div className="mt-1 flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="border-border/80 bg-input/90 text-foreground placeholder:text-muted-foreground"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  variant="outline"
                  className="border-border/80 bg-card/80 text-foreground hover:bg-secondary"
                >
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded border border-primary/35 bg-primary/20 px-2 py-1 text-primary"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:opacity-70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? 'Saving...' : 'Save Snippet'}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="border-border/80 bg-card/80 text-foreground hover:bg-secondary"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
