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
      "あなたのためなら何でもするわ❤❤❤"
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
      "あなたの全てが欲しい❤❤❤❤❤"
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
      "あなたともっと時間を過ごしたい❤"
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
      "あなたが私たちの太陽❤❤❤❤"
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
      "みんなであなたを包囲作戦❤❤❤"
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
            <Link href="/character-selection">
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