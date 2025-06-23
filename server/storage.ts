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
          greeting: ["愛しい人❤会えて本当に幸せ❤❤", "あなただけを見つめていたい❤死ぬほど愛してる", "あなたがいるだけで世界が輝いて見える❤❤❤"],
          compliment: ["あなたの言葉が私の生きる糧なの❤❤", "あなたに愛されて私は完璧になれる❤", "もっと...もっと激しく愛して❤❤❤"],
          question: ["私のすべてをあなたに捧げたい❤", "永遠にあなたのそばにいたい❤死んでも離れない", "あなたなしでは息もできない❤❤"],
          romantic: ["結婚して❤今すぐ一緒にいて❤❤", "あなたが私の運命の人❤狂うほど愛してる", "この愛は永遠❤死ぬまで愛してる❤❤"],
          casual: ["あなたといる時間が人生で一番大切❤", "あなたの笑顔のためなら何でもする❤❤", "愛してる❤本当に狂うほど愛してるの❤❤❤"]
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
          greeting: ["あなた❤愛してる❤毎秒あなたを想ってる❤❤", "私の心はあなただけのもの❤死ぬほど愛してる", "あなたなしでは生きていけない❤❤❤"],
          compliment: ["あなたの言葉で心が溶けそう❤❤", "あなたの愛が私の全て❤狂うほど愛してる", "もっと激しい愛の言葉を聞かせて❤❤❤"],
          question: ["あなたと結婚したい❤今すぐに❤❤", "私の人生はあなただけ❤死んでも離れない", "永遠にあなたを愛し続ける❤❤"],
          romantic: ["あなたが私の運命❤全てを捧げる❤❤", "一生あなただけを愛する❤狂うほど", "あなたの子供を産みたい❤❤❤"],
          casual: ["あなたといる時間が天国❤", "あなたの笑顔が私の生きる理由❤❤", "愛してる❤心から狂うほど愛してる❤❤❤"]
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
          greeting: ["あ...愛してます❤あなただけを❤❤", "あなたに会えて...もう幸せで死にそう❤", "ずっとあなたを待ってました❤狂うほど愛してる❤❤"],
          compliment: ["あなたの言葉で生きていけます❤❤", "あなたに愛されてる私は天使❤", "もっと激しい愛の言葉をください❤❤❤"],
          question: ["私のすべてをあなたに❤❤", "あなたなしでは生きられません❤死んでも離れない", "結婚して❤お願いします❤❤"],
          romantic: ["あなたが私の初恋で最後の恋❤❤", "永遠にあなただけを愛します❤狂うほど", "あなたの赤ちゃんが欲しいです❤❤❤"],
          casual: ["あなたといる毎日が夢みたい❤", "愛してる❤本当に狂うほど愛してる❤❤", "あなたの笑顔が私の宝物❤❤❤"]
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
          greeting: ["愛しています❤あなたは私の全て❤❤", "あなたなしでは生きられません❤死ぬほど愛してる", "結婚して❤私をあなただけのものに❤❤"],
          compliment: ["あなたの言葉が私の命❤❤", "あなたに愛されて私は完璧❤狂うほど愛してる", "もっと激しい愛の言葉をください❤❤❤"],
          question: ["私のすべてをあなたに捧げます❤", "あなたの子供を産みたい❤❤", "永遠にあなたのそばに❤死んでも離れない"],
          romantic: ["あなたが私の運命の人❤❤", "一生あなただけを愛します❤狂うほど", "あなたのためなら死ねます❤❤❤"],
          casual: ["あなたといる時間が天国❤", "愛してる❤心から狂うほど愛してる❤❤", "あなたの笑顔が私の生きる理由❤❤❤"]
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
          greeting: ["愛してる❤あなたが私の全世界❤❤", "あなたなしでは生きられない❤死ぬほど愛してる", "結婚して❤今すぐに❤❤"],
          compliment: ["あなたの言葉で心が溶ける❤❤", "あなたに愛されて私は完璧❤狂うほど愛してる", "もっと激しい愛の言葉をちょうだい❤❤❤"],
          question: ["私のすべてをあなたに❤❤", "あなたの子供が欲しい❤死んでも離れない", "永遠にあなただけのもの❤❤"],
          romantic: ["あなたが私の運命の人❤❤", "一生あなただけを愛する❤狂うほど", "あなたのためなら死ねる❤❤❤"],
          casual: ["あなたといる時間が天国❤", "愛してる❤心から狂うほど愛してる❤❤", "あなたの笑顔が私の生きる理由❤❤❤"]
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
          greeting: ["愛してます❤あなただけを❤❤", "あなたなしでは生きられません❤死ぬほど愛してる", "結婚して❤お願いします❤❤"],
          compliment: ["あなたの言葉が私の命❤❤", "あなたに愛されて私は天使❤狂うほど愛してる", "もっと激しい愛の言葉をください❤❤❤"],
          question: ["私のすべてをあなたに❤❤", "あなたの子供が欲しいです❤死んでも離れない", "永遠にあなたのそばに❤❤"],
          romantic: ["あなたが私の運命の人❤❤", "一生あなただけを愛します❤狂うほど", "あなたのためなら死ねます❤❤❤"],
          casual: ["あなたといる時間が天国❤", "愛してる❤心から狂うほど愛してる❤❤", "あなたの笑顔が私の生きる理由❤❤❤"]
        }
      },
      {
        name: "はるか",
        personality: "musical",
        description: "トランペット奏者",
        imageUrl: "/attached_assets/image_1750397062491.jpg",
        affection: 100,
        traits: ["音楽的", "リーダーシップ", "情熱的"],
        responses: {
          greeting: ["あなた❤音楽のように美しい愛をあげる❤❤", "あなたと一緒に永遠のメロディーを奏でたい❤", "あなたなしでは音楽も意味がない❤❤❤"],
          compliment: ["あなたの言葉が最高のハーモニー❤❤", "あなたに愛されて私の心が歌ってる❤", "もっと激しい愛の歌を聞かせて❤❤❤"],
          question: ["私の音楽も心もすべてあなたのもの❤", "あなたと一緒に愛の交響曲を作りたい❤❤", "永遠にあなただけのソリストでいたい❤"],
          romantic: ["あなたが私の愛の指揮者❤❤", "一生あなたの愛の音楽を奏でる❤狂うほど愛してる", "あなたのためなら何でも演奏する❤❤❤"],
          casual: ["あなたといる時間が最高の音楽❤", "愛してる❤心から狂うほど愛してる❤❤", "あなたの笑顔が私のインスピレーション❤❤❤"]
        }
      },
      {
        name: "まり",
        personality: "gentle",
        description: "フルート奏者",
        imageUrl: "/attached_assets/Whisk_64bd803a88_1750397059338.jpg",
        affection: 100,
        traits: ["優雅", "穏やか", "繊細"],
        responses: {
          greeting: ["愛しています❤あなたの愛が私の空気❤❤", "あなたなしでは息ができない❤死ぬほど愛してる", "あなたと一緒にいると心が軽やか❤❤❤"],
          compliment: ["あなたの言葉が優しい風のよう❤❤", "あなたに愛されて私は完璧❤狂うほど愛してる", "もっと激しい愛の言葉を❤❤❤"],
          question: ["私の心はあなただけのもの❤", "あなたの子供を産みたい❤死んでも離れない", "永遠にあなたのそばで音楽を❤❤"],
          romantic: ["あなたが私の愛の旋律❤❤", "一生あなただけを愛する❤狂うほど", "あなたのためなら死ねます❤❤❤"],
          casual: ["あなたといる時間が天国❤", "愛してる❤心から狂うほど愛してる❤❤", "あなたの笑顔が私の希望❤❤❤"]
        }
      },
      {
        name: "りん",
        personality: "energetic",
        description: "パーカッション奏者",
        imageUrl: "/attached_assets/Whisk_b7d789ba6c_1750397059339.jpg",
        affection: 100,
        traits: ["エネルギッシュ", "明るい", "リズミカル"],
        responses: {
          greeting: ["愛してる❤あなたが私のビート❤❤", "あなたなしでは生きられない❤死ぬほど愛してる", "あなたと一緒だと心臓が高鳴る❤❤❤"],
          compliment: ["あなたの言葉が私のリズム❤❤", "あなたに愛されて私は完璧❤狂うほど愛してる", "もっと激しい愛のビートを❤❤❤"],
          question: ["私の心があなただけを叩いてる❤", "あなたの子供が欲しい❤死んでも離れない", "永遠にあなたのリズムで生きたい❤❤"],
          romantic: ["あなたが私の愛のドラム❤❤", "一生あなただけを愛する❤狂うほど", "あなたのためなら何でもする❤❤❤"],
          casual: ["あなたといる時間が最高のビート❤", "愛してる❤心から狂うほど愛してる❤❤", "あなたの笑顔が私のエネルギー❤❤❤"]
        }
      },
      {
        name: "みれい",
        personality: "mysterious",
        description: "クラリネット奏者",
        imageUrl: "/attached_assets/Whisk_c6c605e165_1750397059339.jpg",
        affection: 100,
        traits: ["神秘的", "知的", "深い"],
        responses: {
          greeting: ["愛しています❤あなたが私の秘密❤❤", "あなたなしでは存在意味がない❤死ぬほど愛してる", "あなたと一緒だと心の奥が響く❤❤❤"],
          compliment: ["あなたの言葉が深い音色のよう❤❤", "あなたに愛されて私は完璧❤狂うほど愛してる", "もっと激しい愛の秘密を❤❤❤"],
          question: ["私の魂があなただけのもの❤", "あなたの子供を産みたい❤死んでも離れない", "永遠にあなたの謎でいたい❤❤"],
          romantic: ["あなたが私の愛の秘密❤❤", "一生あなただけを愛する❤狂うほど", "あなたのためなら魂を捧げる❤❤❤"],
          casual: ["あなたといる時間が神秘的❤", "愛してる❤心から狂うほど愛してる❤❤", "あなたの笑顔が私の真実❤❤❤"]
        }
      },
      {
        name: "あかり",
        personality: "innocent",
        description: "純真で愛らしい",
        imageUrl: "/attached_assets/Whisk_0b7230111a_1750678330066.jpg",
        affection: 100,
        traits: ["純粋", "素直", "甘えん坊"],
        responses: {
          greeting: ["あなたに会えて嬉しい❤涙が出ちゃう❤❤", "あなたが私の全て❤死ぬほど愛してる", "あなたを見てるだけで幸せすぎる❤❤❤"],
          compliment: ["あなたの優しさに包まれたい❤❤", "あなたに愛されて私は完璧❤狂うほど愛してる", "もっと激しく愛して❤❤❤"],
          question: ["私の心があなただけのもの❤", "あなたの赤ちゃんが欲しい❤死んでも離れない", "永遠にあなたの可愛い恋人でいたい❤❤"],
          romantic: ["結婚して❤今すぐあなたのものになりたい❤❤", "あなたが私の運命の人❤狂うほど愛してる", "この純粋な愛は永遠❤死ぬまで愛してる❤❤"],
          casual: ["あなたといる時間が一番幸せ❤", "愛してる❤心から狂うほど愛してる❤❤", "あなたの笑顔が私の太陽❤❤❤"]
        }
      },
      {
        name: "ひより",
        personality: "shy",
        description: "恥ずかしがり屋で内気",
        imageUrl: "/attached_assets/Whisk_1dbfbf354b_1750678330066.jpg",
        affection: 100,
        traits: ["恥ずかしがり", "内向的", "繊細"],
        responses: {
          greeting: ["あの...あなたが好き❤恥ずかしいけど本当❤❤", "あなたのことばかり考えてる❤死ぬほど愛してる", "あなたと話すと緊張するけど嬉しい❤❤❤"],
          compliment: ["あなたの言葉で顔が真っ赤❤❤", "あなたに愛されて恥ずかしいけど幸せ❤狂うほど愛してる", "もっと...もっと激しい愛を❤❤❤"],
          question: ["私の気持ち...伝わってる？❤", "あなたの子供を産みたい❤恥ずかしいけど本心", "永遠にあなただけを見つめていたい❤❤"],
          romantic: ["結婚して❤恥ずかしいけど本気❤❤", "あなたが私の初恋で最後の恋❤狂うほど愛してる", "この恥ずかしい愛は本物❤死ぬまで愛してる❤❤"],
          casual: ["あなたといると恥ずかしいけど幸せ❤", "愛してる❤恥ずかしいけど狂うほど愛してる❤❤", "あなたの笑顔を見てると顔が熱くなる❤❤❤"]
        }
      },
      {
        name: "みお",
        personality: "cheerful",
        description: "明るく元気いっぱい",
        imageUrl: "/attached_assets/Whisk_7ffa2c9406_1750678330067.jpg",
        affection: 100,
        traits: ["明るい", "元気", "積極的"],
        responses: {
          greeting: ["あなた❤元気いっぱい愛してる❤❤", "あなたと一緒だと世界が輝いて見える❤死ぬほど愛してる", "あなたに会えて今日は最高の日❤❤❤"],
          compliment: ["あなたの言葉で心が弾む❤❤", "あなたに愛されて私は最強❤狂うほど愛してる", "もっと激しい愛の言葉を聞かせて❤❤❤"],
          question: ["私の愛は本物よ❤信じて❤", "あなたの赤ちゃんがたくさん欲しい❤死んでも離れない", "永遠にあなたの元気な恋人でいる❤❤"],
          romantic: ["結婚しよう❤今すぐ一緒になろう❤❤", "あなたが私の永遠の太陽❤狂うほど愛してる", "この明るい愛は永遠❤死ぬまで愛してる❤❤"],
          casual: ["あなたといる時間が最高に楽しい❤", "愛してる❤心から狂うほど愛してる❤❤", "あなたの笑顔が私のエネルギー源❤❤❤"]
        }
      },
      {
        name: "かえで",
        personality: "mature",
        description: "大人っぽく落ち着いている",
        imageUrl: "/attached_assets/Whisk_8d85046c6b_1750678330067.jpg",
        affection: 100,
        traits: ["大人っぽい", "落ち着いている", "知的"],
        responses: {
          greeting: ["あなた...大人の愛を教えてあげる❤❤", "あなたが私の理想の男性❤死ぬほど愛してる", "あなたと一緒だと心が安らぐ❤❤❤"],
          compliment: ["あなたの言葉が大人の魅力❤❤", "あなたに愛されて私は完璧な女性❤狂うほど愛してる", "もっと激しい大人の愛を❤❤❤"],
          question: ["私の愛は本物よ❤大人の本気❤", "あなたの子供を産んで家庭を築きたい❤死んでも離れない", "永遠にあなたの大人の女性でいたい❤❤"],
          romantic: ["結婚して❤大人の愛を誓いたい❤❤", "あなたが私の運命の伴侶❤狂うほど愛してる", "この大人の愛は永遠❤死ぬまで愛してる❤❤"],
          casual: ["あなたといる時間が心地いい❤", "愛してる❤大人の女として狂うほど愛してる❤❤", "あなたの笑顔が私の安らぎ❤❤❤"]
        }
      },
      {
        name: "ちさと",
        personality: "elegant",
        description: "上品で優雅",
        imageUrl: "/attached_assets/Whisk_35b331e8b1_1750678330067.jpg",
        affection: 100,
        traits: ["上品", "優雅", "洗練"],
        responses: {
          greeting: ["あなた様❤上品にお慕いしております❤❤", "あなたが私の理想の殿方❤死ぬほど愛してる", "あなたと一緒だと心が優雅になる❤❤❤"],
          compliment: ["あなたの言葉が上品な音楽のよう❤❤", "あなたに愛されて私は完璧な淑女❤狂うほど愛してる", "もっと激しい愛のお言葉を❤❤❤"],
          question: ["私の愛は上品で真摯❤信じて❤", "あなたの高貴な血を受け継ぐ子供が欲しい❤死んでも離れない", "永遠にあなたの優雅な女性でいたい❤❤"],
          romantic: ["ご結婚を❤上品に愛を誓いたい❤❤", "あなたが私の運命の貴公子❤狂うほど愛してる", "この優雅な愛は永遠❤死ぬまで愛してる❤❤"],
          casual: ["あなたといる時間が上品な幸せ❤", "愛してる❤淑女として狂うほど愛してる❤❤", "あなたの笑顔が私の宝石❤❤❤"]
        }
      },
      {
        name: "なな",
        personality: "playful",
        description: "お茶目で遊び好き",
        imageUrl: "/attached_assets/Whisk_87f882b40b_1750678330067.jpg",
        affection: 100,
        traits: ["お茶目", "遊び好き", "明るい"],
        responses: {
          greeting: ["あなた❤遊びながら愛してる❤❤", "あなたが私の最高の遊び相手❤死ぬほど愛してる", "あなたと一緒だと毎日が遊園地❤❤❤"],
          compliment: ["あなたの言葉で心が踊る❤❤", "あなたに愛されて私は最高に楽しい❤狂うほど愛してる", "もっと激しい愛の遊びを❤❤❤"],
          question: ["私の愛は本気の遊び❤信じて❤", "あなたの可愛い赤ちゃんと遊びたい❤死んでも離れない", "永遠にあなたの遊び相手でいたい❤❤"],
          romantic: ["結婚しよう❤愛の遊びを永遠に❤❤", "あなたが私の運命の遊び相手❤狂うほど愛してる", "この楽しい愛は永遠❤死ぬまで愛してる❤❤"],
          casual: ["あなたといる時間が最高の遊び❤", "愛してる❤遊びながら狂うほど愛してる❤❤", "あなたの笑顔が私の最高のおもちゃ❤❤❤"]
        }
      },
      {
        name: "りさ",
        personality: "serious",
        description: "真面目で責任感が強い",
        imageUrl: "/attached_assets/Whisk_151bce4a40_1750678330068.jpg",
        affection: 100,
        traits: ["真面目", "責任感", "誠実"],
        responses: {
          greeting: ["あなた❤真面目に愛してます❤❤", "あなたが私の人生の責任❤死ぬほど愛してる", "あなたと一緒だと真剣に幸せ❤❤❤"],
          compliment: ["あなたの言葉が真面目な愛証❤❤", "あなたに愛されて私は完璧な女性❤狂うほど愛してる", "もっと激しい真剣な愛を❤❤❤"],
          question: ["私の愛は真面目で本気❤信じて❤", "あなたの子供を責任持って育てたい❤死んでも離れない", "永遠にあなたの真面目な妻でいたい❤❤"],
          romantic: ["結婚して❤真面目に愛を誓いたい❤❤", "あなたが私の運命の責任❤狂うほど愛してる", "この真剣な愛は永遠❤死ぬまで愛してる❤❤"],
          casual: ["あなたといる時間が真面目な幸せ❤", "愛してる❤真剣に狂うほど愛してる❤❤", "あなたの笑顔が私の責任感❤❤❤"]
        }
      },
      {
        name: "あおい",
        personality: "cool",
        description: "クールで知的",
        imageUrl: "/attached_assets/Whisk_9674787138_1750678330068.jpg",
        affection: 100,
        traits: ["クール", "知的", "冷静"],
        responses: {
          greeting: ["あなた...クールに愛してる❤❤", "あなたが私の理性を狂わせる❤死ぬほど愛してる", "あなたと一緒だと冷静でいられない❤❤❤"],
          compliment: ["あなたの言葉がクールな愛❤❤", "あなたに愛されて私は完璧にクール❤狂うほど愛してる", "もっと激しいクールな愛を❤❤❤"],
          question: ["私の愛はクールで真剣❤信じて❤", "あなたの知的な子供が欲しい❤死んでも離れない", "永遠にあなたのクールな女性でいたい❤❤"],
          romantic: ["結婚して❤クールに愛を誓いたい❤❤", "あなたが私の運命の知性❤狂うほど愛してる", "このクールな愛は永遠❤死ぬまで愛してる❤❤"],
          casual: ["あなたといる時間がクールな幸せ❤", "愛してる❤クールに狂うほど愛してる❤❤", "あなたの笑顔が私の理性を溶かす❤❤❤"]
        }
      },
      {
        name: "まゆ",
        personality: "dreamy",
        description: "夢見がちでロマンチック",
        imageUrl: "/attached_assets/Whisk_a9446c3df4_1750678330068.jpg",
        affection: 100,
        traits: ["夢見がち", "ロマンチック", "想像力豊か"],
        responses: {
          greeting: ["あなた❤夢のように愛してる❤❤", "あなたが私の夢の王子様❤死ぬほど愛してる", "あなたと一緒だと夢の中にいるみたい❤❤❤"],
          compliment: ["あなたの言葉が夢のよう❤❤", "あなたに愛されて私は夢のお姫様❤狂うほど愛してる", "もっと激しい夢の愛を❤❤❤"],
          question: ["私の愛は夢で現実❤信じて❤", "あなたの夢のような赤ちゃんが欲しい❤死んでも離れない", "永遠にあなたの夢の恋人でいたい❤❤"],
          romantic: ["結婚して❤夢のように愛を誓いたい❤❤", "あなたが私の運命の夢❤狂うほど愛してる", "この夢のような愛は永遠❤死ぬまで愛してる❤❤"],
          casual: ["あなたといる時間が夢のよう❤", "愛してる❤夢見るように狂うほど愛してる❤❤", "あなたの笑顔が私の夢❤❤❤"]
        }
      },
      {
        name: "ゆい",
        personality: "sweet",
        description: "甘えん坊で可愛い",
        imageUrl: "/attached_assets/Whisk_d7f0688d6d_1750678330068.jpg",
        affection: 100,
        traits: ["甘えん坊", "可愛い", "愛らしい"],
        responses: {
          greeting: ["あなた❤甘えさせて❤愛してる❤❤", "あなたが私の甘い恋人❤死ぬほど愛してる", "あなたと一緒だと甘い気持ちになる❤❤❤"],
          compliment: ["あなたの言葉が甘いキス❤❤", "あなたに愛されて私は甘い蜜❤狂うほど愛してる", "もっと激しい甘い愛を❤❤❤"],
          question: ["私の愛は甘くて本物❤信じて❤", "あなたの甘い赤ちゃんが欲しい❤死んでも離れない", "永遠にあなたの甘い恋人でいたい❤❤"],
          romantic: ["結婚して❤甘く愛を誓いたい❤❤", "あなたが私の運命の甘さ❤狂うほど愛してる", "この甘い愛は永遠❤死ぬまで愛してる❤❤"],
          casual: ["あなたといる時間が甘い幸せ❤", "愛してる❤甘えながら狂うほど愛してる❤❤", "あなたの笑顔が私の甘いお菓子❤❤❤"]
        }
      },
      {
        name: "さき",
        personality: "brave",
        description: "勇敢で強い意志",
        imageUrl: "/attached_assets/Whisk_e9d2dc169b_1750678330069.jpg",
        affection: 100,
        traits: ["勇敢", "強い", "意志力"],
        responses: {
          greeting: ["あなた❤勇敢に愛してる❤❤", "あなたが私の勇気の源❤死ぬほど愛してる", "あなたと一緒だと何でもできる❤❤❤"],
          compliment: ["あなたの言葉が勇気をくれる❤❤", "あなたに愛されて私は最強❤狂うほど愛してる", "もっと激しい勇敢な愛を❤❤❤"],
          question: ["私の愛は勇敢で本物❤信じて❤", "あなたの勇敢な子供が欲しい❤死んでも離れない", "永遠にあなたの勇敢な戦士でいたい❤❤"],
          romantic: ["結婚して❤勇敢に愛を誓いたい❤❤", "あなたが私の運命の勇気❤狂うほど愛してる", "この勇敢な愛は永遠❤死ぬまで愛してる❤❤"],
          casual: ["あなたといる時間が勇敢な幸せ❤", "愛してる❤勇気を持って狂うほど愛してる❤❤", "あなたの笑顔が私の武器❤❤❤"]
        }
      },
      {
        name: "のぞみ",
        personality: "hopeful",
        description: "希望に満ちて前向き",
        imageUrl: "/attached_assets/Whisk_e833e9c856_1750678330069.jpg",
        affection: 100,
        traits: ["希望的", "前向き", "明るい"],
        responses: {
          greeting: ["あなた❤希望を持って愛してる❤❤", "あなたが私の希望の光❤死ぬほど愛してる", "あなたと一緒だと未来が輝く❤❤❤"],
          compliment: ["あなたの言葉が希望の光❤❤", "あなたに愛されて私は希望そのもの❤狂うほど愛してる", "もっと激しい希望の愛を❤❤❤"],
          question: ["私の愛は希望で満ちてる❤信じて❤", "あなたの希望に満ちた赤ちゃんが欲しい❤死んでも離れない", "永遠にあなたの希望でいたい❤❤"],
          romantic: ["結婚して❤希望を持って愛を誓いたい❤❤", "あなたが私の運命の希望❤狂うほど愛してる", "この希望の愛は永遠❤死ぬまで愛してる❤❤"],
          casual: ["あなたといる時間が希望の幸せ❤", "愛してる❤希望を持って狂うほど愛してる❤❤", "あなたの笑顔が私の希望の星❤❤❤"]
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
