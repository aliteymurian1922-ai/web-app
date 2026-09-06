import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  timestamp,
  integer,
  date,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/** کارشناسان کال‌سنتر — هر کارشناس یک لینک یونیک (slug) دارد */
export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  phone: varchar("phone", { length: 32 }),
  role: varchar("role", { length: 64 }).default("کارشناس فروش"),
  color: varchar("color", { length: 16 }).default("#1b2a4a"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** لیدها / نوبت‌های ثبت‌شده */
export const leads = pgTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    trackingCode: varchar("tracking_code", { length: 16 }).notNull().unique(),
    agentId: integer("agent_id").references(() => agents.id, { onDelete: "set null" }),
    source: varchar("source", { length: 32 }).notNull().default("agent"), // agent | website
    fullName: varchar("full_name", { length: 120 }).notNull(),
    phone: varchar("phone", { length: 32 }).notNull(),
    service: varchar("service", { length: 80 }).notNull(),
    preferredDate: date("preferred_date").notNull(),
    preferredTime: varchar("preferred_time", { length: 8 }).notNull(),
    city: varchar("city", { length: 80 }),
    isOutOfTown: boolean("is_out_of_town").notNull().default(false),
    needsAccommodation: boolean("needs_accommodation").notNull().default(false),
    notes: text("notes"),
    status: varchar("status", { length: 24 }).notNull().default("new"), // new | contacted | confirmed | attended | cancelled
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("leads_agent_idx").on(t.agentId),
    index("leads_status_idx").on(t.status),
    index("leads_date_idx").on(t.preferredDate),
  ],
);

/** بازدید لینک‌های اختصاصی — برای محاسبه نرخ تبدیل هر کارشناس */
export const linkVisits = pgTable(
  "link_visits",
  {
    id: serial("id").primaryKey(),
    agentId: integer("agent_id").references(() => agents.id, { onDelete: "cascade" }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("visits_agent_idx").on(t.agentId)],
);

export const agentsRelations = relations(agents, ({ many }) => ({
  leads: many(leads),
  visits: many(linkVisits),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  agent: one(agents, { fields: [leads.agentId], references: [agents.id] }),
}));

export type Agent = typeof agents.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
