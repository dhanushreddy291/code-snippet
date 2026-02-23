import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  primaryKey,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index('users_email_idx').on(table.email),
  })
);

// Snippets table
export const snippets = pgTable(
  'snippets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    code: text('code').notNull(),
    language: text('language').notNull().default('javascript'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('snippets_user_id_idx').on(table.userId),
    createdAtIdx: index('snippets_created_at_idx').on(table.createdAt),
  })
);

// Tags table
export const tags = pgTable(
  'tags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('tags_user_id_idx').on(table.userId),
    userIdNameIdx: index('tags_user_id_name_idx').on(table.userId, table.name),
  })
);

// Junction table for snippet-tag relationships
export const snippetTags = pgTable(
  'snippet_tags',
  {
    snippetId: uuid('snippet_id')
      .notNull()
      .references(() => snippets.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.snippetId, table.tagId] }),
    snippetIdIdx: index('snippet_tags_snippet_id_idx').on(table.snippetId),
    tagIdIdx: index('snippet_tags_tag_id_idx').on(table.tagId),
  })
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  snippets: many(snippets),
  tags: many(tags),
}));

export const snippetsRelations = relations(snippets, ({ one, many }) => ({
  user: one(users, {
    fields: [snippets.userId],
    references: [users.id],
  }),
  tags: many(snippetTags),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(users, {
    fields: [tags.userId],
    references: [users.id],
  }),
  snippets: many(snippetTags),
}));

export const snippetTagsRelations = relations(snippetTags, ({ one }) => ({
  snippet: one(snippets, {
    fields: [snippetTags.snippetId],
    references: [snippets.id],
  }),
  tag: one(tags, {
    fields: [snippetTags.tagId],
    references: [tags.id],
  }),
}));
