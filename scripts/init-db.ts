import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../lib/db/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initializeDatabase() {
  const db = drizzle(pool, { schema });
  
  console.log('Creating database tables...');
  
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
    `);

    // Create snippets table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS snippets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        code TEXT NOT NULL,
        language TEXT NOT NULL DEFAULT 'javascript',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS snippets_user_id_idx ON snippets(user_id);
      CREATE INDEX IF NOT EXISTS snippets_created_at_idx ON snippets(created_at);
    `);

    // Create tags table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS tags_user_id_idx ON tags(user_id);
      CREATE INDEX IF NOT EXISTS tags_user_id_name_idx ON tags(user_id, name);
    `);

    // Create snippet_tags junction table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS snippet_tags (
        snippet_id UUID NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
        tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (snippet_id, tag_id)
      );
      CREATE INDEX IF NOT EXISTS snippet_tags_snippet_id_idx ON snippet_tags(snippet_id);
      CREATE INDEX IF NOT EXISTS snippet_tags_tag_id_idx ON snippet_tags(tag_id);
    `);

    console.log('✓ All tables created successfully');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error creating tables:', error);
    await pool.end();
    process.exit(1);
  }
}

initializeDatabase();
