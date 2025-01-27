import { integer, pgTable, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const todosTable = pgTable("todos", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar(255).notNull(), // Specify max length for varchar
    completed: boolean().notNull().default(false),
    created_at: timestamp().notNull().default("now()"),
    updated_at: timestamp().notNull().default("now()"),
});