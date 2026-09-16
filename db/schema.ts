import { bigint, boolean, index, integer, pgTable, text } from "drizzle-orm/pg-core";

export const contentBlocks = pgTable("content_blocks", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
  updatedBy: text("updated_by"),
});

export const leaders = pgTable(
  "leaders",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    role: text("role").notNull(),
    bio: text("bio").notNull(),
    imageKey: text("image_key"),
    position: integer("position").notNull().default(0),
    published: boolean("published").notNull().default(true),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
  },
  (table) => [index("idx_leaders_position").on(table.position)],
);

export const businesses = pgTable(
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
    published: boolean("published").notNull().default(true),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
  },
  (table) => [index("idx_businesses_position").on(table.position)],
);

export const documents = pgTable(
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
    published: boolean("published").notNull().default(true),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
  },
  (table) => [index("idx_documents_category_published").on(table.category, table.published)],
);

export const jobs = pgTable(
  "jobs",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    location: text("location").notNull(),
    type: text("type").notNull(),
    description: text("description").notNull(),
    published: boolean("published").notNull().default(true),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
  },
  (table) => [index("idx_jobs_published").on(table.published)],
);

export const inquiries = pgTable(
  "inquiries",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    status: text("status").notNull().default("new"),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
  },
  (table) => [index("idx_inquiries_status_created").on(table.status, table.createdAt)],
);
