import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const newsletters = sqliteTable('newsletters', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  publishDate: integer('publish_date', { mode: 'timestamp' }).notNull(),
  pdfPath: text('pdf_path').notNull(),
});

export const updates = sqliteTable('updates', {
  slug: text('slug').primaryKey(),
  title: text('title').notNull(),
  pubDate: integer('pub_date', { mode: 'timestamp' }).notNull(),
  author: text('author').notNull(),
  summary: text('summary').notNull(),
  tags: text('tags', { mode: 'json' }).$type<string[]>().notNull(),
  content: text('content').notNull(),
});

export const members = sqliteTable('members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  image: text('image'),
  contactLink: text('contact_link'),
});

export const committees = sqliteTable('committees', {
  name: text('name').primaryKey(),
  description: text('description'),
  email: text('email'),
});

export const committeeMembers = sqliteTable('committee_members', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    memberId: integer('member_id').notNull().references(() => members.id, { onDelete: 'cascade' }),
    committeeName: text('committee_name').notNull().references(() => committees.name, { onDelete: 'cascade' }),
    role: text('role').notNull(),
    isConvenor: integer('is_convenor', { mode: 'boolean' }).default(false).notNull(),
});

export const membersRelations = relations(members, ({ many }) => ({
  committeeMembers: many(committeeMembers),
}));

export const committeesRelations = relations(committees, ({ many }) => ({
  committeeMembers: many(committeeMembers),
}));

export const committeeMembersRelations = relations(committeeMembers, ({ one }) => ({
  committee: one(committees, {
    fields: [committeeMembers.committeeName],
    references: [committees.name],
  }),
  member: one(members, {
    fields: [committeeMembers.memberId],
    references: [members.id],
  }),
}));