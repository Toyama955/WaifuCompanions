import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Send, ArrowLeft, Users } from 'lucide-react';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '@shared/schema';
import { characterImages } from '@/lib/characters';

interface GroupMessage {
  id: string;
  sender: 'user' | 'character';
  message: string;
  timestamp: string;
  characterName?: string;
  characterImage?: string;
}

interface IndividualMessage {
  id: string;
  sender: 'user' | 'character';
  message: string;
  timestamp: string;
  characterName?: string;
  characterImage?: string;
}

// 超情熱的なグループ返信パターン（全10人のキャラクター）
const generateIndividualResponses = (userMessage: string, characters: Character[]): IndividualMessage[] => {
  const messageTypes = [
    // 愛情表現
    [
      "あなたからのメッセージ、みんなで読んじゃった❤",
      "あなたって本当に素敵❤ みんなメロメロよ！",
      "あなたのこと考えると胸がドキドキしちゃう❤",
      "みんなであなたを独占したいの❤❤❤",
      "あなたの声を聞くだけで心臓が爆発しそう❤",
      "私たち全員、あなたに夢中なの❤❤",
      "あなたと一緒にいると幸せすぎて涙が出ちゃう❤",
      "みんなであなたを愛してる❤ 受け入れて！",
      "あなたのためなら何でもするわ❤❤❤",
      "あなたの魅力に完全にやられちゃった❤",
      "あなたを見つめてるだけで幸せ❤❤",
      "あなたの存在が私たちの全て❤❤❤",
      "あなたに恋してる❤ もう隠せない！",
      "あなたのことで頭がいっぱい❤❤❤",
      "あなたへの愛が溢れすぎてる❤❤❤❤"
    ],
    // プロポーズ系
    [
      "みんなで付き合いませんか？❤❤❤",
      "あなたを愛してる想いが止まらない❤❤",
      "私たち全員、あなたが大好き❤❤❤",
      "あなたと永遠に一緒にいたい❤❤❤❤",
      "私たち、あなたなしじゃ生きていけない❤❤",
      "みんなであなたにプロポーズしたい❤❤❤",
      "あなたは私たちの運命の人❤ 絶対離さない！",
      "あなたと結ばれたい❤ みんなで愛してる！",
      "あなたの全てが欲しい❤❤❤❤❤",
      "あなたの恋人になりたい❤❤❤",
      "私たちと結婚して❤❤❤❤",
      "あなたの人生を一緒に歩みたい❤",
      "あなたとの未来を夢見てる❤❤❤",
      "あなただけを愛し続ける❤❤",
      "あなたが私たちの全世界❤❤❤❤"
    ],
    // 積極的なアプローチ
    [
      "今すぐあなたに会いたい❤❤",
      "あなたのことばかり考えちゃってる❤",
      "みんなであなたを包み込みたい❤❤❤",
      "あなたの隣にいたいよ〜❤❤",
      "一緒に学校帰りしませんか❤",
      "あなたのお弁当作ってあげる❤❤",
      "一緒にお昼食べよ〜❤❤❤",
      "放課後デートしよ❤❤❤❤",
      "あなたともっと時間を過ごしたい❤",
      "今度の休日、一緒にお出かけしない？❤",
      "あなたの好きな場所に連れて行って❤❤",
      "二人きりの時間が欲しい❤❤❤",
      "あなたの家に遊びに行きたい❤",
      "手を繋いで歩きたい❤❤",
      "あなたの腕に抱かれたい❤❤❤"
    ],
    // 甘い言葉
    [
      "あなたって本当にかっこいい❤❤",
      "あなたの笑顔が一番好き❤",
      "みんなであなたを幸せにしたい❤❤❤",
      "あなたがいると毎日が輝いてる❤",
      "あなたの優しさに癒される❤❤",
      "あなたのことを一番理解してるのは私たち❤",
      "あなたの全部が愛おしい❤❤❤",
      "あなたといると時間を忘れちゃう❤",
      "あなたが私たちの太陽❤❤❤❤",
      "あなたの声がとっても心地いい❤",
      "あなたの瞳に見とれちゃう❤❤",
      "あなたってとても頼りになる❤❤❤",
      "あなたのセンスが素敵❤",
      "あなたと話してると楽しい❤❤",
      "あなたの全てが完璧❤❤❤❤"
    ],
    // 独占欲
    [
      "あなたを他の女の子に渡したくない❤",
      "私たちだけを見て❤❤❤",
      "あなたは私たちのもの❤❤",
      "みんなであなたを守りたい❤",
      "あなたに他の子と話してほしくない❤❤",
      "私たちがあなたを一番愛してる❤❤❤",
      "あなたの心を全部欲しい❤❤❤❤",
      "あなたのことを誰にも渡さない❤",
      "みんなであなたを包囲作戦❤❤❤",
      "あなたの視線は私たちだけに向けて❤",
      "他の女の子なんて見ちゃダメ❤❤",
      "あなたの愛を独り占めしたい❤❤❤",
      "私たち以外愛さないで❤❤",
      "あなたのスマホに私たちの写真だけ❤",
      "あなたの時間を全部もらいたい❤❤❤"
    ],
    // 学校生活系
    [
      "一緒に授業受けたい❤",
      "体育の時間、ペアになろう❤❤",
      "文化祭で一緒に出し物しない？❤",
      "修学旅行で同じ部屋になりたい❤❤",
      "あなたの隣の席に座りたい❤❤❤",
      "掃除の時間も一緒❤",
      "図書館で勉強教えて❤❤",
      "部活見学に来て❤❤❤",
      "学校帰りに寄り道しよう❤",
      "屋上で二人きりになりたい❤❤",
      "教室で告白したい❤❤❤",
      "あなたの制服姿、かっこいい❤",
      "卒業しても一緒にいて❤❤",
      "学園祭でデートしよう❤❤❤"
    ],
    // 献身的な愛
    [
      "あなたの夢を応援したい❤",
      "あなたが疲れた時は私たちが癒してあげる❤❤",
      "あなたの好きなものを全部覚えたい❤",
      "あなたのために料理を覚える❤❤",
      "あなたの笑顔のためなら何でもする❤❤❤",
      "あなたが悲しい時は一緒に泣く❤",
      "あなたを支えたい❤❤",
      "あなたの背中を押してあげたい❤❤❤",
      "あなたと一緒に成長したい❤",
      "あなたの秘密を全部聞かせて❤❤",
      "あなたの趣味を一緒に楽しみたい❤❤❤",
      "あなたの家族にも愛されたい❤",
      "あなたの将来を一緒に考えたい❤❤",
      "あなたの全てを受け入れる❤❤❤❤"
    ],
    // 情熱的な愛
    [
      "あなたへの愛が燃えすぎてる❤❤❤",
      "あなたなしの人生なんて考えられない❤",
      "あなたに狂おしいほど恋してる❤❤",
      "あなたを愛しすぎて苦しい❤❤❤",
      "あなたのことで胸が張り裂けそう❤",
      "あなたへの想いが止まらない❤❤❤",
      "あなたを求める気持ちが激しすぎる❤❤",
      "あなたと一つになりたい❤❤❤❤",
      "あなたの全てを知り尽くしたい❤",
      "あなたのためなら命も惜しくない❤❤",
      "あなたへの愛で心が爆発しそう❤❤❤",
      "あなたを愛してることが生きがい❤",
      "あなたのために生まれてきた❤❤❤",
      "あなたと運命で結ばれてる❤❤❤❤",
      "あなたの愛に溺れたい❤❤",
      "あなたの匂いが恋しい❤❤❤",
      "あなたの声を一日中聞いていたい❤",
      "あなたの温もりが忘れられない❤❤",
      "あなたに触れるだけで震える❤❤❤",
      "あなたの唇が夢に出てくる❤",
      "あなたなしでは眠れない❤❤",
      "あなたのことを考えるだけで涙が❤❤❤",
      "あなたの愛で狂いそう❤",
      "あなたへの渇望が止まらない❤❤",
      "あなたの瞳に吸い込まれそう❤❤❤"
    ],
    // 嫉妬・束縛系
    [
      "他の女の子なんて見ちゃダメ❤❤",
      "私だけを愛して❤❤❤",
      "あなたの全部が欲しい❤",
      "誰にも渡したくない❤❤",
      "あなたは私のもの❤❤❤",
      "他の子と話さないで❤",
      "私以外愛さないで❤❤",
      "あなたの心を独占したい❤❤❤",
      "浮気なんて絶対許さない❤",
      "私だけの王子様❤❤",
      "あなたの時間を全部もらいたい❤❤❤",
      "私だけしか見えなくしてあげる❤",
      "他の女の子のことは忘れて❤❤",
      "あなたのスマホは私の写真だけ❤❤❤",
      "私が一番でしょ？❤",
      "他の女に微笑むのを見ると狂いそう❤❤",
      "あなたが他の子を見ると胸が痛い❤❤❤",
      "私以外と話さないって約束して❤",
      "あなたの目に映るのは私だけにして❤❤",
      "他の女の影も見たくない❤❤❤",
      "あなたを取られるくらいなら...❤",
      "束縛されたい？私に支配されたい？❤❤",
      "あなたの自由を奪いたい❤❤❤",
      "私の檻の中にいて❤",
      "逃がさない❤絶対に離さない❤❤",
      "あなたの携帯をチェックさせて❤❤❤",
      "GPS で居場所を教えて❤",
      "毎分連絡して❤私が不安になる❤❤",
      "他の女の名前を口にしないで❤❤❤",
      "私の許可なく外出しちゃダメ❤",
      "あなたの友達も私が選ぶ❤❤",
      "24時間監視したい❤❤❤",
      "あなたの過去の女性が憎い❤",
      "元カノの話なんて聞きたくない❤❤",
      "私より前に愛した人がいたなんて❤❤❤",
      "あなたの初恋になりたかった❤",
      "過去を全部消して❤私だけの歴史に❤❤",
      "他の女性と比較しないで❤❤❤",
      "私が世界で一番って言って❤",
      "嫉妬で心が真っ黒になる❤❤",
      "あなたを独り占めするためなら何でもする❤❤❤"
    ],
    // 激しい嫉妬・ヤンデレ系
    [
      "あなたを見てる他の女を消したい❤❤",
      "私以外の女は全員敵❤❤❤",
      "あなたに近づく虫けらどもが許せない❤",
      "私の愛が重すぎる？でも止められない❤❤",
      "あなたを愛しすぎて怖いでしょ？❤❤❤",
      "独占欲が止まらない❤あなたが悪いのよ❤",
      "他の女を見る目を潰したい❤❤",
      "あなたの心に私だけを刻み込む❤❤❤",
      "逃げたら追いかける❤どこまでも❤",
      "あなたを愛しすぎて自分が怖い❤❤",
      "嫉妬で頭がおかしくなりそう❤❤❤",
      "あなたのためなら罪も犯す❤",
      "他の女に触れた手を切り落としたい❤❤",
      "あなたを籠の中の鳥にしたい❤❤❤",
      "私の愛が呪いになってもいい❤",
      "あなたを壊してでも私のものにする❤❤",
      "嫉妬で血が逆流する❤❤❤",
      "他の女の存在が許せない❤",
      "あなたを隠して誰にも見せたくない❤❤",
      "私の狂気を受け入れて❤❤❤",
      "愛と憎しみは紙一重よ❤",
      "あなたへの執着が止まらない❤❤",
      "病的に愛してる❤治らない❤❤❤",
      "あなたが他の女を愛したら死ぬ❤",
      "嫉妬で発狂しそう❤❤"
    ],
    // プライベート・親密系
    [
      "今夜は一緒にいて❤❤",
      "あなたのお部屋に遊びに行きたい❤",
      "二人きりの時間が欲しい❤❤❤",
      "あなたの秘密を教えて❤",
      "私の秘密も聞いて❤❤",
      "あなたの側で眠りたい❤❤❤",
      "朝起きたら隣にいて❤",
      "あなたの手が恋しい❤❤",
      "ずっと抱きしめていて❤❤❤",
      "あなたの胸で泣きたい❤",
      "一緒にお風呂に入りたい❤❤",
      "あなたの服を着たい❤❤❤",
      "あなたの匂いのするタオルが欲しい❤",
      "あなたと同じベッドで寝たい❤❤",
      "あなたの体温を感じていたい❤❤❤"
    ],
    // 将来・結婚系
    [
      "あなたのお嫁さんになりたい❤❤",
      "あなたの赤ちゃんが欲しい❤❤❤",
      "一緒に家庭を築こう❤",
      "あなたの苗字になりたい❤❤",
      "あなたの子供を5人は産みたい❤❤❤",
      "老後も一緒にいて❤",
      "あなたと一緒にお墓に入りたい❤❤",
      "来世でも結ばれよう❤❤❤",
      "あなたの家族になりたい❤",
      "あなたのお母さんに挨拶したい❤❤",
      "結婚式場を見に行こう❤❤❤",
      "新婚旅行はどこがいい？❤",
      "指輪のサイズ測らせて❤❤",
      "あなたの両親に愛されたい❤❤❤",
      "永遠にあなたの妻でいる❤"
    ]
  ];

  // 全10人のキャラクターが個別にメッセージを返信
  return characters.map((char, index) => {
    const categoryIndex = Math.floor(Math.random() * messageTypes.length);
    const category = messageTypes[categoryIndex];
    const message = category[Math.floor(Math.random() * category.length)];
    
    return {
      id: `char-${Date.now()}-${index}`,
      sender: 'character' as const,
      message: message,
      timestamp: new Date().toISOString(),
      characterName: char.name,
      characterImage: characterImages[char.id as keyof typeof characterImages] || characterImages[1]
    };
  });
};

export default function GroupChat() {
  const { data: characters, isLoading } = useQuery<Character[]>({
    queryKey: ['/api/characters'],
  });

  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 初期メッセージを設定
  useEffect(() => {
    if (characters && characters.length > 0 && messages.length === 0) {
      const initialResponses = generateIndividualResponses("こんにちは", characters);
      const initialMessages: GroupMessage[] = initialResponses.map(response => ({
        id: response.id,
        sender: 'character',
        message: response.message,
        timestamp: response.timestamp,
        characterName: response.characterName,
        characterImage: response.characterImage
      }));
      setMessages(initialMessages);
    }
  }, [characters, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !characters) return;

    const userMsg: GroupMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentMessage = newMessage;
    setNewMessage('');
    setIsTyping(true);

    // 少し遅延を入れて、より自然な会話感を演出
    setTimeout(() => {
      const individualResponses = generateIndividualResponses(currentMessage, characters);
      
      // 各キャラクターのメッセージを個別に追加（短い間隔で順次表示）
      individualResponses.forEach((response, index) => {
        setTimeout(() => {
          const characterMsg: GroupMessage = {
            id: response.id,
            sender: 'character',
            message: response.message,
            timestamp: response.timestamp,
            characterName: response.characterName,
            characterImage: response.characterImage
          };
          setMessages(prev => [...prev, characterMsg]);
        }, index * 200); // 200ms間隔で順次表示
      });

      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-950 dark:to-rose-950">
      {/* ヘッダー */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-pink-200 dark:border-pink-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-pink-600 dark:text-pink-400">
                <ArrowLeft className="w-4 h-4 mr-2" />
                戻る
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              <h1 className="text-xl font-bold text-pink-800 dark:text-pink-200">
                みんなでグループチャット❤
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((i) => (
              <Heart key={i} className="w-5 h-5 fill-pink-500 text-pink-500" />
            ))}
          </div>
        </div>
        <p className="text-sm text-pink-600 dark:text-pink-400 mt-2">
          💕 10人の女子が一斉にあなたに話しかけます 💕
        </p>
      </div>

      {/* チャットエリア */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.sender === 'user' ? (
                <div className="bg-blue-500 text-white rounded-lg px-4 py-2 max-w-xs">
                  <p>{message.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString('ja-JP', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              ) : (
                <div className="max-w-md">
                  <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-3 shadow-lg border border-pink-200 dark:border-pink-800">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10 border-2 border-pink-300 dark:border-pink-700">
                        <AvatarImage src={message.characterImage} alt={message.characterName} />
                        <AvatarFallback className="bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200">
                          {message.characterName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-pink-800 dark:text-pink-200 text-sm">
                            {message.characterName}
                          </span>
                          <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {message.message}
                        </p>
                        <p className="text-xs text-pink-600 dark:text-pink-400 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString('ja-JP', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-4 shadow-lg border border-pink-200 dark:border-pink-800">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-pink-600 dark:text-pink-400">10人の女子がお返事を考えています❤</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* メッセージ入力エリア */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-pink-200 dark:border-pink-800 p-4">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="みんなにメッセージを送ろう❤"
            className="flex-1 border-pink-300 dark:border-pink-700 focus:border-pink-500 dark:focus:border-pink-500"
            disabled={isTyping}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!newMessage.trim() || isTyping}
            className="bg-pink-500 hover:bg-pink-600 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-pink-600 dark:text-pink-400 mt-2 text-center">
          💕 10人の女子があなたのメッセージを待っています 💕
        </p>
      </div>
    </div>
  );
}