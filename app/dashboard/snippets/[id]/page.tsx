import { SnippetDetail } from '@/components/snippet-detail';

export const metadata = {
  title: 'Snippet | SnippetHub',
  description: 'View snippet details',
};

export default function SnippetPage({ params }: { params: Promise<{ id: string }> }) {
  return <SnippetDetail snippetId={(params as any).id} />;
}
