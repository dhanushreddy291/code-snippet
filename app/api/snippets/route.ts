import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { snippets, snippet_tags, tags } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const snippetSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Language is required'),
  tags: z.array(z.string()).optional(),
});

async function getUserIdFromSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session_id')?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const sessionData = JSON.parse(sessionCookie);
    return sessionData.userId || null;
  } catch {
    return null;
  }
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

    const userSnippets = await db.query.snippets.findMany({
      where: eq(snippets.user_id, userId),
      with: {
        snippet_tags: {
          with: {
            tag: true,
          },
        },
      },
    });

    const formattedSnippets = userSnippets.map((snippet) => ({
      ...snippet,
      tags: snippet.snippet_tags.map((st) => ({
        id: st.tag.id,
        name: st.tag.name,
      })),
    }));

    return NextResponse.json({ snippets: formattedSnippets });
  } catch (error) {
    console.error('[v0] Get snippets error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromSession();

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, code, language, tags: tagNames } = snippetSchema.parse(body);

    // Create snippet
    const newSnippet = await db.insert(snippets).values({
      user_id: userId,
      title,
      description: description || null,
      code,
      language,
    }).returning();

    if (!newSnippet || newSnippet.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create snippet' },
        { status: 500 }
      );
    }

    const snippet = newSnippet[0];

    // Handle tags
    if (tagNames && tagNames.length > 0) {
      const createdTags = [];

      for (const tagName of tagNames) {
        // Check if tag exists for this user
        let tag = await db.query.tags.findFirst({
          where: (tagsTable) =>
            tagsTable.user_id === userId && tagsTable.name === tagName,
        });

        // Create tag if it doesn't exist
        if (!tag) {
          const newTag = await db.insert(tags).values({
            user_id: userId,
            name: tagName,
          }).returning();

          if (newTag && newTag.length > 0) {
            tag = newTag[0];
          }
        }

        if (tag) {
          createdTags.push(tag);
        }
      }

      // Link snippet to tags
      for (const tag of createdTags) {
        await db.insert(snippet_tags).values({
          snippet_id: snippet.id,
          tag_id: tag.id,
        });
      }
    }

    return NextResponse.json(
      {
        snippet: {
          ...snippet,
          tags: tagNames || [],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('[v0] Create snippet error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
