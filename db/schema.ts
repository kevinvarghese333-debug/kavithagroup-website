import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contentBlocks = sqliteTable("content_blocks", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at").notNull(),
  updatedBy: text("updated_by"),
});

export const leaders = sqliteTable(
  "leaders",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    role: text("role").notNull(),
    bio: text("bio").notNull(),
    imageKey: text("image_key"),
    position: integer("position").notNull().default(0),
    published: integer("published", { mode: "boolean" }).notNull().default(true),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [index("idx_leaders_position").on(table.position)],
);

export const businesses = sqliteTable(
  "businesses",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    summary: text("summary").notNull(),
    location: text("location"),
    imageKey: text("image_key"),
    websiteUrl: text("website_url"),
    position: integer("position").notNull().default(0),
    published: integer("published", { mode: "boolean" }).notNull().default(true),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [index("idx_businesses_position").on(table.position)],
);

export const documents = sqliteTable(
  "documents",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    category: text("category").notNull(),
    year: integer("year").notNull(),
    fileKey: text("file_key").notNull(),
    fileName: text("file_name").notNull(),
    mimeType: text("mime_type").notNull(),
    size: integer("size").notNull(),
    published: integer("published", { mode: "boolean" }).notNull().default(true),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [index("idx_documents_category_published").on(table.category, table.published)],
);

export const jobs = sqliteTable(
  "jobs",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    location: text("location").notNull(),
    type: text("type").notNull(),
    description: text("description").notNull(),
    published: integer("published", { mode: "boolean" }).notNull().default(true),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [index("idx_jobs_published").on(table.published)],
);

export const inquiries = sqliteTable(
  "inquiries",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    status: text("status").notNull().default("new"),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [index("idx_inquiries_status_created").on(table.status, table.createdAt)],
);
