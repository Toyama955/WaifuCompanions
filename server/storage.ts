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
        affection: 60,
        traits: ["優しい", "内向的", "感受性が強い"],
        responses: {
          greeting: ["あなたに会えて本当に嬉しいです...", "今日も一緒にいてくれるんですね", "あなたといると心が温かくなります"],
          compliment: ["そんなこと言われると...恥ずかしいです", "あなたにそう言ってもらえると自信が持てます", "ありがとう...あなたは優しいですね"],
          question: ["私のこと...もっと知りたいですか？", "あなたのことを教えてください", "一緒にいる時間がとても大切です"],
          romantic: ["あなたと一緒だと...とても安心します", "こんな気持ち初めてです", "あなたがそばにいてくれるだけで幸せです"],
          casual: ["今日はどんな一日でしたか？", "あなたの好きなことを教えて", "一緒にお散歩しませんか？"]
        }
      },
      {
        name: "あやめ",
        personality: "passionate",
        description: "情熱的で一途",
        imageUrl: "/attached_assets/Whisk_667853873f_1750392189708.jpg",
        affection: 80,
        traits: ["情熱的", "直情", "一途"],
        responses: {
          greeting: ["あなた！待ってたの！", "やっと来てくれたのね...嬉しい", "あなたがいないと寂しくて仕方ないの"],
          compliment: ["本当に？私のこと、そんなふうに思ってくれるの？", "あなたからの言葉は特別よ", "もっと聞かせて...あなたの声が好き"],
          question: ["私たちの関係...どう思ってる？", "あなたの全てを知りたいの", "私だけを見ていてほしい"],
          romantic: ["あなたを愛してる...本当よ", "一緒にいられるなら何も要らない", "あなたの心を独り占めしたい"],
          casual: ["今日は何をして過ごしましょう？", "あなたの趣味を一緒に楽しみたい", "二人だけの時間が一番好き"]
        }
      },
      {
        name: "みお",
        personality: "innocent",
        description: "純真で可愛らしい",
        imageUrl: "/attached_assets/Whisk_a7b850c577_1750392189709.jpg",
        affection: 40,
        traits: ["純真", "恥ずかしがり", "可愛らしい"],
        responses: {
          greeting: ["あ、あの...こんにちは", "え？私に会いに来てくれたんですか？", "う、嬉しいです..."],
          compliment: ["そ、そんな...恥ずかしいです", "本当ですか？嬉しいけど...照れちゃいます", "あ、ありがとうございます"],
          question: ["え？私のこと聞きたいんですか？", "あの...あなたのことも知りたいです", "一緒にいると...ドキドキします"],
          romantic: ["こ、恋愛のお話ですか？", "まだよく分からないけど...あなたといると特別な気持ちに", "もしかして...これが恋なのかな？"],
          casual: ["今日はお天気がいいですね", "あの...お話できて嬉しいです", "何をお話ししましょうか？"]
        }
      },
      {
        name: "ゆり",
        personality: "elegant",
        description: "上品で知的",
        imageUrl: "/attached_assets/Whisk_db75933b6f_1750392189709.jpg",
        affection: 55,
        traits: ["上品", "知的", "大人っぽい"],
        responses: {
          greeting: ["お疲れ様です。今日もお会いできて光栄です", "あなたとお話しできる時間は特別ですね", "いつもありがとうございます"],
          compliment: ["お褒めいただき、ありがとうございます", "あなたの言葉は心に響きます", "そう言っていただけると嬉しいです"],
          question: ["何かお聞きになりたいことがあるのですね", "お答えできることでしたら何でも", "あなたのご質問にお応えしたいと思います"],
          romantic: ["大人の関係として...お互いを大切にしたいですね", "あなたとの時間は特別な意味を持ちます", "心の繋がりを感じています"],
          casual: ["今日はどのようにお過ごしでしたか？", "良い本を読みました。あなたの趣味は？", "お茶でも飲みながらお話ししませんか？"]
        }
      },
      {
        name: "あい",
        personality: "cheerful",
        description: "学園のアイドル",
        imageUrl: "/attached_assets/Whisk_f10f501e8c_1750392189709.jpg",
        affection: 95,
        traits: ["明るい", "人気者", "エネルギッシュ"],
        responses: {
          greeting: ["おはよう！今日も元気だよ〜", "会えて嬉しい！一緒に楽しもうね", "あなたがいると毎日が楽しい！"],
          compliment: ["わぁ〜ありがとう！嬉しい〜", "あなたって本当に優しいのね", "そんなこと言われちゃうと頑張っちゃう！"],
          question: ["何でも聞いて！答えるよ〜", "あなたのことももっと知りたいな", "お話しするのって楽しいね"],
          romantic: ["え？もしかして...私のこと好きなの？", "私もあなたのこと...特別に思ってるよ", "一緒にいると心がポカポカするの"],
          casual: ["今度一緒にお出かけしない？", "何か面白いことない？", "あなたと過ごす時間が一番好き！"]
        }
      },
      {
        name: "かえで",
        personality: "emotional",
        description: "感情豊かで繊細",
        imageUrl: "/attached_assets/Whisk_f18b10378a_1750392189709.jpg",
        affection: 35,
        traits: ["敏感", "純粋", "感情的"],
        responses: {
          greeting: ["あ...あなた", "また会えたんですね...", "嬉しい...でも少し緊張します"],
          compliment: ["そんな...私なんて...", "あなたにそう言われると...涙が出そうです", "ありがとう...心が温かくなります"],
          question: ["私のこと...気になるんですか？", "あなたの優しさに...感動しています", "こんな私でも...大丈夫ですか？"],
          romantic: ["こんな気持ち...初めてで怖いです", "あなたといると...胸がいっぱいになります", "愛って...こんなに切ないものなんですね"],
          casual: ["今日も一日お疲れ様でした", "あなたと話していると心が落ち着きます", "静かな時間も...好きです"]
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
      affection: insertCharacter.affection || 0,
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
