import { pgTable, pgSchema, index, foreignKey, uuid, text, timestamp, unique, boolean, uniqueIndex, jsonb, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { relations } from 'drizzle-orm';


export const neonAuth = pgSchema("neon_auth");


export const invitationInNeonAuth = neonAuth.table("invitation", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  organizationId: uuid().notNull(),
  email: text().notNull(),
  role: text(),
  status: text().notNull(),
  expiresAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
  createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  inviterId: uuid().notNull(),
}, (table) => [
  index("invitation_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
  index("invitation_organizationId_idx").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
  foreignKey({
    columns: [table.organizationId],
    foreignColumns: [organizationInNeonAuth.id],
    name: "invitation_organizationId_fkey"
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.inviterId],
    foreignColumns: [userInNeonAuth.id],
    name: "invitation_inviterId_fkey"
  }).onDelete("cascade"),
]);

export const userInNeonAuth = neonAuth.table("user", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  email: text().notNull(),
  emailVerified: boolean().notNull(),
  image: text(),
  createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  role: text(),
  banned: boolean(),
  banReason: text(),
  banExpires: timestamp({ withTimezone: true, mode: 'string' }),
}, (table) => [
  unique("user_email_key").on(table.email),
]);

export const sessionInNeonAuth = neonAuth.table("session", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  expiresAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
  token: text().notNull(),
  createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
  ipAddress: text(),
  userAgent: text(),
  userId: uuid().notNull(),
  impersonatedBy: text(),
  activeOrganizationId: text(),
}, (table) => [
  index("session_userId_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [userInNeonAuth.id],
    name: "session_userId_fkey"
  }).onDelete("cascade"),
  unique("session_token_key").on(table.token),
]);

export const organizationInNeonAuth = neonAuth.table("organization", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  slug: text().notNull(),
  logo: text(),
  createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
  metadata: text(),
}, (table) => [
  uniqueIndex("organization_slug_uidx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
  unique("organization_slug_key").on(table.slug),
]);

export const accountInNeonAuth = neonAuth.table("account", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: uuid().notNull(),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: timestamp({ withTimezone: true, mode: 'string' }),
  refreshTokenExpiresAt: timestamp({ withTimezone: true, mode: 'string' }),
  scope: text(),
  password: text(),
  createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
  index("account_userId_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [userInNeonAuth.id],
    name: "account_userId_fkey"
  }).onDelete("cascade"),
]);

export const verificationInNeonAuth = neonAuth.table("verification", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
  createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
  index("verification_identifier_idx").using("btree", table.identifier.asc().nullsLast().op("text_ops")),
]);

export const jwksInNeonAuth = neonAuth.table("jwks", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  publicKey: text().notNull(),
  privateKey: text().notNull(),
  createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
  expiresAt: timestamp({ withTimezone: true, mode: 'string' }),
});

export const memberInNeonAuth = neonAuth.table("member", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  organizationId: uuid().notNull(),
  userId: uuid().notNull(),
  role: text().notNull(),
  createdAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
  index("member_organizationId_idx").using("btree", table.organizationId.asc().nullsLast().op("uuid_ops")),
  index("member_userId_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
  foreignKey({
    columns: [table.organizationId],
    foreignColumns: [organizationInNeonAuth.id],
    name: "member_organizationId_fkey"
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [userInNeonAuth.id],
    name: "member_userId_fkey"
  }).onDelete("cascade"),
]);

export const projectConfigInNeonAuth = neonAuth.table("project_config", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  endpointId: text("endpoint_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  trustedOrigins: jsonb("trusted_origins").notNull(),
  socialProviders: jsonb("social_providers").notNull(),
  emailProvider: jsonb("email_provider"),
  emailAndPassword: jsonb("email_and_password"),
  allowLocalhost: boolean("allow_localhost").notNull(),
  pluginConfigs: jsonb("plugin_configs"),
  webhookConfig: jsonb("webhook_config"),
}, (table) => [
  unique("project_config_endpoint_id_key").on(table.endpointId),
]);


export const snippets = pgTable(
  'snippets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => userInNeonAuth.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    code: text('code').notNull(),
    language: text('language').notNull().default('javascript'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    {
      userIdIdx: index('snippets_user_id_idx').on(table.userId),
      createdAtIdx: index('snippets_created_at_idx').on(table.createdAt),
    }
  ]
);

export const tags = pgTable(
  'tags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => userInNeonAuth.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [{
    userIdIdx: index('tags_user_id_idx').on(table.userId),
    userIdNameIdx: index('tags_user_id_name_idx').on(table.userId, table.name),
  }]
);

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
  (table) => [
    primaryKey({ columns: [table.snippetId, table.tagId] }),
    index('snippet_tags_snippet_id_idx').on(table.snippetId),
    index('snippet_tags_tag_id_idx').on(table.tagId),
  ]
);

export const usersRelations = relations(userInNeonAuth, ({ many }) => ({
  snippets: many(snippets),
  tags: many(tags),
}));

export const snippetsRelations = relations(snippets, ({ one, many }) => ({
  user: one(userInNeonAuth, {
    fields: [snippets.userId],
    references: [userInNeonAuth.id],
  }),
  tags: many(snippetTags),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(userInNeonAuth, {
    fields: [tags.userId],
    references: [userInNeonAuth.id],
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
