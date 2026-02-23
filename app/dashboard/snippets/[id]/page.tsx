import { SnippetDetail } from '@/components/snippet-detail';

export const metadata = {
  title: 'Snippet | SnippetHub',
  description: 'View snippet details',
};

export default async function SnippetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SnippetDetail snippetId={id} />;
}
