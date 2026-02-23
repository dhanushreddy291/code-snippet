import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { db } from '@/lib/db';
import { tags } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

async function getUserIdFromSession(): Promise<string | null> {
  const { data: session } = await auth.getSession();
  return session?.user?.id ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromSession();

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get all tags for the user with count of snippets
    const userTags = await db.query.tags.findMany({
      where: eq(tags.userId, userId),
      with: {
        snippets: true,
      },
    });

    const formattedTags = userTags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      snippetCount: tag.snippets.length,
    }));

    return NextResponse.json({ tags: formattedTags });
  } catch (error) {
    console.error('[v0] Get tags error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserIdFromSession();

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get('id');

    if (!tagId) {
      return NextResponse.json(
        { error: 'Tag ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const tag = await db.query.tags.findFirst({
      where: and(eq(tags.id, tagId), eq(tags.userId, userId)),
    });

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    // Delete tag (cascade will remove snippet_tags)
    await db.delete(tags).where(eq(tags.id, tagId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Delete tag error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
