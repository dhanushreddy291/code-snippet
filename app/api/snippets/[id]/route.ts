import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { db } from '@/lib/db';
import { snippets, snippetTags, tags } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const updateSnippetSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  code: z.string().min(1).optional(),
  language: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  isShared: z.boolean().optional(),
});

async function getUserIdFromSession(): Promise<string | null> {
  const { data: session } = await auth.getSession();
  return session?.user?.id ?? null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserIdFromSession();

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const snippet = await db.query.snippets.findFirst({
      where: and(eq(snippets.id, id), eq(snippets.userId, userId)),
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
    console.error('[v0] Get snippet error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserIdFromSession();

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const updates = updateSnippetSchema.parse(body);

    // Verify ownership
    const snippet = await db.query.snippets.findFirst({
      where: and(eq(snippets.id, id), eq(snippets.userId, userId)),
    });

    if (!snippet) {
      return NextResponse.json(
        { error: 'Snippet not found' },
        { status: 404 }
      );
    }

    // Update snippet
    const updateData: Record<string, any> = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.code !== undefined) updateData.code = updates.code;
    if (updates.language !== undefined) updateData.language = updates.language;
    if (updates.isShared !== undefined) {
      updateData.isShared = updates.isShared;
      if (updates.isShared && !snippet.shareToken) {
        updateData.shareToken = crypto.randomUUID();
      }
    }
    updateData.updatedAt = new Date();

    await db.update(snippets).set(updateData).where(eq(snippets.id, id));

    // Handle tags if provided
    if (updates.tags !== undefined) {
      // Remove existing tags
      await db.delete(snippetTags).where(eq(snippetTags.snippetId, id));

      // Add new tags
      for (const tagName of updates.tags) {
        let tag = await db.query.tags.findFirst({
          where: and(eq(tags.userId, userId), eq(tags.name, tagName)),
        });

        if (!tag) {
          const newTag = await db.insert(tags).values({
            userId: userId,
            name: tagName,
          }).returning();

          if (newTag && newTag.length > 0) {
            tag = newTag[0];
          }
        }

        if (tag) {
          await db.insert(snippetTags).values({
            snippetId: id,
            tagId: tag.id,
          });
        }
      }
    }

    const updatedSnippet = await db.query.snippets.findFirst({
      where: eq(snippets.id, id),
      with: {
        tags: {
          with: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json({
      snippet: {
        ...updatedSnippet,
        created_at: updatedSnippet?.createdAt instanceof Date ? updatedSnippet.createdAt.toISOString() : updatedSnippet?.createdAt,
        updated_at: updatedSnippet?.updatedAt instanceof Date ? updatedSnippet.updatedAt.toISOString() : updatedSnippet?.updatedAt,
        tags: updatedSnippet?.tags.map((st: { tag: { id: string; name: string } }) => ({
          id: st.tag.id,
          name: st.tag.name,
        })),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('[v0] Update snippet error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserIdFromSession();

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify ownership
    const snippet = await db.query.snippets.findFirst({
      where: and(eq(snippets.id, id), eq(snippets.userId, userId)),
    });

    if (!snippet) {
      return NextResponse.json(
        { error: 'Snippet not found' },
        { status: 404 }
      );
    }

    // Delete snippet (cascade will remove snippet_tags)
    await db.delete(snippets).where(eq(snippets.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Delete snippet error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
