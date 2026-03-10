import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { snippets } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const snippet = await db.query.snippets.findFirst({
      where: and(eq(snippets.shareToken, token), eq(snippets.isShared, true)),
      with: {
        tags: {
          with: {
            tag: true,
          },
        },
      },
    });

    if (!snippet) {
      return NextResponse.json(
        { error: 'Snippet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      snippet: {
        ...snippet,
        created_at: snippet.createdAt instanceof Date ? snippet.createdAt.toISOString() : snippet.createdAt,
        updated_at: snippet.updatedAt instanceof Date ? snippet.updatedAt.toISOString() : snippet.updatedAt,
        tags: snippet.tags.map((st: { tag: { id: string; name: string } }) => ({
          id: st.tag.id,
          name: st.tag.name,
        })),
      },
    });
  } catch (error) {
    console.error('[v0] Get shared snippet error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
