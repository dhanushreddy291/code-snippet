import { codeToHtml as shikiCodeToHtml, getHighlighter } from 'shiki';

let highlighter: any = null;

export async function initHighlighter() {
  if (!highlighter) {
    highlighter = await getHighlighter({
      themes: ['github-dark'],
      langs: [
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
      ],
    });
  }
  return highlighter;
}

export async function codeToHtml(code: string, language: string): Promise<string> {
  try {
    const highlighter = await initHighlighter();
    const html = await shikiCodeToHtml(code, {
      lang: language || 'plaintext',
      theme: 'github-dark',
      transformers: [
        {
          line(node: any) {
            node.properties.className?.push('line');
          },
        },
      ],
    });
    return html;
  } catch (error) {
    console.error('[v0] Failed to highlight code:', error);
    // Fallback to plain code block
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
