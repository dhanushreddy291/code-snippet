'use client';

import { useEffect, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { codeToHtml } from '@/lib/syntax-highlighter';

type CodeDisplayProps = {
  code: string;
  language: string;
  onCopy?: () => void;
};

export function CodeDisplay({ code, language, onCopy }: CodeDisplayProps) {
  const [html, setHtml] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const highlight = async () => {
      try {
        const highlighted = await codeToHtml(code, language);
        setHtml(highlighted);
      } catch (error) {
        console.error('[v0] Syntax highlighting error:', error);
        setHtml(`<pre><code>${code}</code></pre>`);
      } finally {
        setLoading(false);
      }
    };

    highlight();
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="rounded border border-border/75 bg-input/85 p-4 text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-md border border-border/75 bg-input/85">
      <Button
        onClick={handleCopy}
        size="sm"
        variant="ghost"
        className="absolute right-2 top-2 z-10 h-8 border border-border/70 bg-card/90 px-2 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-secondary/95 text-foreground"
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>

      <div
        className="overflow-x-auto p-4 text-sm font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
