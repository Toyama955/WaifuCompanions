import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  personality: text("personality").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  affection: integer("affection").notNull().default(0),
  traits: jsonb("traits").$type<string[]>().notNull().default([]),
  responses: jsonb("responses").$type<{
    greeting: string[];
    compliment: string[];
    question: string[];
    romantic: string[];
    casual: string[];
  }>().notNull()
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").notNull(),
  userId: text("user_id").notNull(),
  messages: jsonb("messages").$type<{
    id: string;
    sender: 'user' | 'character';
    message: string;
    timestamp: string;
  }[]>().notNull().default([]),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  affectionLevel: integer("affection_level").notNull().default(0)
});

export const gameStates = pgTable("game_states", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  data: jsonb("data").$type<{
    selectedCharacter?: number;
    characters: Record<string, any>;
    conversations: Record<string, any>;
    settings: Record<string, any>;
  }>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  lastMessageAt: true
});

export const insertGameStateSchema = createInsertSchema(gameStates).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type Character = typeof characters.$inferSelect;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type GameState = typeof gameStates.$inferSelect;
export type InsertGameState = z.infer<typeof insertGameStateSchema>;
