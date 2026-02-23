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
      <div className="bg-input border border-border rounded p-4 text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative group border border-border rounded overflow-hidden bg-input">
      <Button
        onClick={handleCopy}
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-secondary/50 hover:bg-secondary text-foreground"
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>

      <div
        className="overflow-x-auto p-4 text-sm font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
