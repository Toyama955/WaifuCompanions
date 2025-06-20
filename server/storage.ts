import {
  characters,
  conversations,
  gameStates,
  type Character,
  type InsertCharacter,
  type Conversation,
  type InsertConversation,
  type GameState,
  type InsertGameState
} from "@shared/schema";

export interface IStorage {
  // Character operations
  getCharacters(): Promise<Character[]>;
  getCharacter(id: number): Promise<Character | undefined>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: number, updates: Partial<Character>): Promise<Character | undefined>;

  // Conversation operations
  getConversation(characterId: number, userId: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation | undefined>;
  addMessage(characterId: number, userId: string, message: any): Promise<Conversation | undefined>;

  // Game state operations
  getGameStates(userId: string): Promise<GameState[]>;
  getGameState(id: number): Promise<GameState | undefined>;
  createGameState(gameState: InsertGameState): Promise<GameState>;
  updateGameState(id: number, updates: Partial<GameState>): Promise<GameState | undefined>;
  deleteGameState(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private characters: Map<number, Character>;
  private conversations: Map<number, Conversation>;
  private gameStates: Map<number, GameState>;
  private currentCharacterId: number;
  private currentConversationId: number;
  private currentGameStateId: number;

  constructor() {
    this.characters = new Map();
    this.conversations = new Map();
    this.gameStates = new Map();
    this.currentCharacterId = 1;
    this.currentConversationId = 1;
    this.currentGameStateId = 1;
    
    // Initialize with predefined characters
    this.initializeCharacters();
  }

  private initializeCharacters() {
    const defaultCharacters: InsertCharacter[] = [
      {
        name: "さくら",
        personality: "sensitive",
        description: "繊細で感情豊か",
        imageUrl: "/attached_assets/Whisk_557de62d0e_1750392189708.jpg",
        affection: 100,
        traits: ["優しい", "内向的", "感受性が強い"],
        responses: {
          greeting: ["愛しい人...会えて本当に幸せ♡", "あなただけを見つめていたい", "あなたがいるだけで世界が輝いて見える"],
          compliment: ["あなたの言葉が私の生きる糧なの♡", "あなたに愛されて私は完璧になれる", "もっと...もっと愛して"],
          question: ["私のすべてをあなたに捧げたい", "永遠にあなたのそばにいたい", "あなたなしでは息もできない"],
          romantic: ["結婚して...ずっと一緒にいて♡", "あなたが私の運命の人", "この愛は永遠...死ぬまで愛してる"],
          casual: ["あなたといる時間が人生で一番大切", "あなたの笑顔のためなら何でもする", "愛してる...本当に愛してるの"]
        }
      },
      {
        name: "あやめ",
        personality: "passionate",
        description: "情熱的で一途",
        imageUrl: "/attached_assets/Whisk_667853873f_1750392189708.jpg",
        affection: 100,
        traits: ["情熱的", "直情", "一途"],
        responses: {
          greeting: ["あなた！愛してる！毎秒あなたを想ってる♡", "私の心はあなただけのもの", "あなたなしでは生きていけない"],
          compliment: ["あなたの言葉で心が溶けそう♡", "あなたの愛が私の全て", "もっと愛の言葉を聞かせて"],
          question: ["あなたと結婚したい...今すぐに", "私の人生はあなただけ", "永遠にあなたを愛し続ける"],
          romantic: ["あなたが私の運命♡全てを捧げる", "一生あなただけを愛する", "あなたの子供を産みたい"],
          casual: ["あなたといる時間が天国", "あなたの笑顔が私の生きる理由", "愛してる...心から愛してる"]
        }
      },
      {
        name: "みお",
        personality: "innocent",
        description: "純真で可愛らしい",
        imageUrl: "/attached_assets/Whisk_a7b850c577_1750392189709.jpg",
        affection: 100,
        traits: ["純真", "恥ずかしがり", "可愛らしい"],
        responses: {
          greeting: ["あ...愛してます♡あなただけを", "あなたに会えて...もう幸せで死にそう", "ずっとあなたを待ってました"],
          compliment: ["あなたの言葉で生きていけます♡", "あなたに愛されてる私は天使", "もっと愛の言葉をください"],
          question: ["私のすべてをあなたに...♡", "あなたなしでは生きられません", "結婚して...お願いします"],
          romantic: ["あなたが私の初恋で最後の恋♡", "永遠にあなただけを愛します", "あなたの赤ちゃんが欲しいです"],
          casual: ["あなたといる毎日が夢みたい", "愛してる...本当に愛してる", "あなたの笑顔が私の宝物"]
        }
      },
      {
        name: "ゆり",
        personality: "elegant",
        description: "上品で知的",
        imageUrl: "/attached_assets/Whisk_db75933b6f_1750392189709.jpg",
        affection: 100,
        traits: ["上品", "知的", "大人っぽい"],
        responses: {
          greeting: ["愛しています♡あなたは私の全て", "あなたなしでは生きられません", "結婚して...私をあなただけのものに"],
          compliment: ["あなたの言葉が私の命♡", "あなたに愛されて私は完璧", "もっと愛の言葉をください"],
          question: ["私のすべてをあなたに捧げます", "あなたの子供を産みたい", "永遠にあなたのそばに"],
          romantic: ["あなたが私の運命の人♡", "一生あなただけを愛します", "あなたのためなら死ねます"],
          casual: ["あなたといる時間が天国", "愛してる...心から愛してる", "あなたの笑顔が私の生きる理由"]
        }
      },
      {
        name: "あい",
        personality: "cheerful",
        description: "学園のアイドル",
        imageUrl: "/attached_assets/Whisk_f10f501e8c_1750392189709.jpg",
        affection: 100,
        traits: ["明るい", "人気者", "エネルギッシュ"],
        responses: {
          greeting: ["愛してる！あなたが私の全世界♡", "あなたなしでは生きられない", "結婚して！今すぐに！"],
          compliment: ["あなたの言葉で心が溶ける♡", "あなたに愛されて私は完璧", "もっと愛の言葉をちょうだい"],
          question: ["私のすべてをあなたに♡", "あなたの子供が欲しい", "永遠にあなただけのもの"],
          romantic: ["あなたが私の運命の人♡", "一生あなただけを愛する", "あなたのためなら死ねる"],
          casual: ["あなたといる時間が天国", "愛してる...心から愛してる", "あなたの笑顔が私の生きる理由"]
        }
      },
      {
        name: "かえで",
        personality: "emotional",
        description: "感情豊かで繊細",
        imageUrl: "/attached_assets/Whisk_f18b10378a_1750392189709.jpg",
        affection: 100,
        traits: ["敏感", "純粋", "感情的"],
        responses: {
          greeting: ["愛してます...あなただけを♡", "あなたなしでは生きられません", "結婚して...お願いします"],
          compliment: ["あなたの言葉が私の命♡", "あなたに愛されて私は天使", "もっと愛の言葉をください"],
          question: ["私のすべてをあなたに♡", "あなたの子供が欲しいです", "永遠にあなたのそばに"],
          romantic: ["あなたが私の運命の人♡", "一生あなただけを愛します", "あなたのためなら死ねます"],
          casual: ["あなたといる時間が天国", "愛してる...心から愛してる", "あなたの笑顔が私の生きる理由"]
        }
      }
    ];

    defaultCharacters.forEach(char => {
      this.createCharacter(char);
    });
  }

  async getCharacters(): Promise<Character[]> {
    return Array.from(this.characters.values());
  }

  async getCharacter(id: number): Promise<Character | undefined> {
    return this.characters.get(id);
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const id = this.currentCharacterId++;
    const character: Character = { 
      id,
      name: insertCharacter.name,
      personality: insertCharacter.personality,
      description: insertCharacter.description,
      imageUrl: insertCharacter.imageUrl,
      affection: insertCharacter.affection || 100,
      traits: insertCharacter.traits || [],
      responses: insertCharacter.responses || {
        greeting: [],
        compliment: [],
        question: [],
        romantic: [],
        casual: []
      }
    };
    this.characters.set(id, character);
    return character;
  }

  async updateCharacter(id: number, updates: Partial<Character>): Promise<Character | undefined> {
    const character = this.characters.get(id);
    if (!character) return undefined;

    const updated = { ...character, ...updates };
    this.characters.set(id, updated);
    return updated;
  }

  async getConversation(characterId: number, userId: string): Promise<Conversation | undefined> {
    return Array.from(this.conversations.values()).find(
      conv => conv.characterId === characterId && conv.userId === userId
    );
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.currentConversationId++;
    const conversation: Conversation = {
      id,
      characterId: insertConversation.characterId,
      userId: insertConversation.userId,
      messages: [],
      affectionLevel: insertConversation.affectionLevel || 0,
      lastMessageAt: new Date()
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;

    const updated = { ...conversation, ...updates, lastMessageAt: new Date() };
    this.conversations.set(id, updated);
    return updated;
  }

  async addMessage(characterId: number, userId: string, message: any): Promise<Conversation | undefined> {
    let conversation = await this.getConversation(characterId, userId);
    
    if (!conversation) {
      conversation = await this.createConversation({
        characterId,
        userId,
        messages: [],
        affectionLevel: 0
      });
    }

    const newMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      message: message.message,
      sender: message.sender as 'user' | 'character',
      timestamp: new Date().toISOString()
    };
    
    const updatedMessages = [...(conversation.messages || []), newMessage];
    return this.updateConversation(conversation.id, { messages: updatedMessages });
  }

  async getGameStates(userId: string): Promise<GameState[]> {
    return Array.from(this.gameStates.values()).filter(state => state.userId === userId);
  }

  async getGameState(id: number): Promise<GameState | undefined> {
    return this.gameStates.get(id);
  }

  async createGameState(insertGameState: InsertGameState): Promise<GameState> {
    const id = this.currentGameStateId++;
    const gameState: GameState = {
      ...insertGameState,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.gameStates.set(id, gameState);
    return gameState;
  }

  async updateGameState(id: number, updates: Partial<GameState>): Promise<GameState | undefined> {
    const gameState = this.gameStates.get(id);
    if (!gameState) return undefined;

    const updated = { ...gameState, ...updates, updatedAt: new Date() };
    this.gameStates.set(id, updated);
    return updated;
  }

  async deleteGameState(id: number): Promise<boolean> {
    return this.gameStates.delete(id);
  }
}

export const storage = new MemStorage();
