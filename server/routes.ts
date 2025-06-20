import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConversationSchema, insertGameStateSchema } from "@shared/schema";
import { z } from "zod";

const addMessageSchema = z.object({
  message: z.string(),
  sender: z.enum(['user', 'character']),
  timestamp: z.string().optional()
});

const userIdSchema = z.object({
  userId: z.string().optional().default('default-user')
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all characters
  app.get("/api/characters", async (req, res) => {
    try {
      const characters = await storage.getCharacters();
      res.json(characters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch characters" });
    }
  });

  // Get specific character
  app.get("/api/characters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const character = await storage.getCharacter(id);
      
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      
      res.json(character);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch character" });
    }
  });

  // Update character affection
  app.patch("/api/characters/:id/affection", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { affection } = req.body;

      if (typeof affection !== 'number' || affection < 0 || affection > 100) {
        return res.status(400).json({ message: "Invalid affection value" });
      }

      const character = await storage.updateCharacter(id, { affection });
      
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      
      res.json(character);
    } catch (error) {
      res.status(500).json({ message: "Failed to update character affection" });
    }
  });

  // Get conversation
  app.get("/api/conversations/:characterId", async (req, res) => {
    try {
      const characterId = parseInt(req.params.characterId);
      const { userId = 'default-user' } = req.query;

      const conversation = await storage.getConversation(characterId, userId as string);
      
      if (!conversation) {
        // Create new conversation if none exists
        const newConversation = await storage.createConversation({
          characterId,
          userId: userId as string,
          messages: [],
          affectionLevel: 0
        });
        return res.json(newConversation);
      }
      
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  // Add message to conversation
  app.post("/api/conversations/:characterId/messages", async (req, res) => {
    try {
      const characterId = parseInt(req.params.characterId);
      const { userId = 'default-user' } = req.body;
      
      const messageData = addMessageSchema.parse(req.body);
      
      const message = {
        id: Date.now().toString(),
        sender: messageData.sender,
        message: messageData.message,
        timestamp: messageData.timestamp || new Date().toISOString()
      };

      const conversation = await storage.addMessage(characterId, userId, message);
      
      if (!conversation) {
        return res.status(404).json({ message: "Failed to add message" });
      }
      
      res.json(conversation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add message" });
    }
  });

  // Generate character response
  app.post("/api/characters/:id/respond", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { message } = req.body;

      const character = await storage.getCharacter(id);
      
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }

      // Simple rule-based response generation
      let category = 'question'; // default

      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('好き') || lowerMessage.includes('愛') || lowerMessage.includes('美しい') || lowerMessage.includes('可愛い')) {
        category = 'compliment';
      } else if (lowerMessage.includes('こんにちは') || lowerMessage.includes('おはよう') || lowerMessage.includes('こんばんは')) {
        category = 'greeting';
      } else if (lowerMessage.includes('愛してる') || lowerMessage.includes('恋') || lowerMessage.includes('好き')) {
        category = 'romantic';
      } else if (lowerMessage.includes('今日') || lowerMessage.includes('天気') || lowerMessage.includes('趣味')) {
        category = 'casual';
      }

      const responses = character.responses[category as keyof typeof character.responses] || character.responses.question;
      const response = responses[Math.floor(Math.random() * responses.length)];

      // Increase affection slightly for interactions
      const newAffection = Math.min(100, character.affection + Math.floor(Math.random() * 3) + 1);
      await storage.updateCharacter(id, { affection: newAffection });

      res.json({ 
        response,
        affection: newAffection,
        category
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate response" });
    }
  });

  // Game state management
  app.get("/api/game-states", async (req, res) => {
    try {
      const { userId = 'default-user' } = req.query;
      const gameStates = await storage.getGameStates(userId as string);
      res.json(gameStates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game states" });
    }
  });

  app.post("/api/game-states", async (req, res) => {
    try {
      const gameStateData = insertGameStateSchema.parse(req.body);
      const gameState = await storage.createGameState(gameStateData);
      res.json(gameState);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid game state data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create game state" });
    }
  });

  app.get("/api/game-states/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const gameState = await storage.getGameState(id);
      
      if (!gameState) {
        return res.status(404).json({ message: "Game state not found" });
      }
      
      res.json(gameState);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game state" });
    }
  });

  app.put("/api/game-states/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const gameState = await storage.updateGameState(id, updates);
      
      if (!gameState) {
        return res.status(404).json({ message: "Game state not found" });
      }
      
      res.json(gameState);
    } catch (error) {
      res.status(500).json({ message: "Failed to update game state" });
    }
  });

  app.delete("/api/game-states/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteGameState(id);
      
      if (!success) {
        return res.status(404).json({ message: "Game state not found" });
      }
      
      res.json({ message: "Game state deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete game state" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
