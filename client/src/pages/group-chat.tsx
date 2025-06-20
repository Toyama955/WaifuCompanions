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

// グループチャット用の画像
import groupImage1 from '@assets/Whisk_020e0dcd14_1750402762835.jpg';
import groupImage2 from '@assets/Whisk_ef00d81c7b_1750402766100.jpg';
import groupImage3 from '@assets/Whisk_906cc02d61_1750402770350.jpg';
import groupImage4 from '@assets/Whisk_abdb3a5ca1_1750402770351.jpg';

interface GroupMessage {
  id: string;
  sender: 'user' | 'group';
  message: string;
  timestamp: string;
  characters?: { name: string; message: string; image: string }[];
}

const groupChatImages = [groupImage1, groupImage2, groupImage3, groupImage4];

// 超情熱的なグループ返信パターン
const generateGroupResponse = (userMessage: string): { name: string; message: string; image: string }[] => {
  const responses = [
    {
      name: "あいか",
      messages: [
        "きゃー！❤ あなたからのメッセージ、みんなで読んじゃった！",
        "あなたって本当に素敵❤ みんなメロメロよ！",
        "あなたのこと考えると胸がドキドキしちゃう❤",
        "みんなであなたを独占したいの❤❤❤"
      ]
    },
    {
      name: "ゆい",
      messages: [
        "私たち全員、あなたに夢中なの❤❤",
        "あなたと一緒にいると幸せすぎて涙が出ちゃう❤",
        "みんなであなたを愛してる❤ 受け入れて！",
        "あなたのためなら何でもするわ❤❤❤"
      ]
    },
    {
      name: "みお",
      messages: [
        "あなたの声を聞くだけで心臓が爆発しそう❤",
        "私たち、あなたなしじゃ生きていけない❤❤",
        "みんなであなたにプロポーズしたい❤❤❤",
        "あなたは私たちの運命の人❤ 絶対離さない！"
      ]
    },
    {
      name: "えま",
      messages: [
        "みんなで付き合いませんか？❤❤❤",
        "あなたを愛してる想いが止まらない❤❤",
        "私たち全員、あなたが大好き❤❤❤",
        "あなたと永遠に一緒にいたい❤❤❤❤"
      ]
    }
  ];

  return responses.map((char, index) => ({
    name: char.name,
    message: char.messages[Math.floor(Math.random() * char.messages.length)],
    image: groupChatImages[index % groupChatImages.length]
  }));
};

export default function GroupChat() {
  const [messages, setMessages] = useState<GroupMessage[]>([
    {
      id: '1',
      sender: 'group',
      message: 'みんなでお話ししよう❤',
      timestamp: new Date().toISOString(),
      characters: [
        { name: "あいか", message: "きゃー！新しい人❤ みんな大興奮よ！", image: groupImage1 },
        { name: "ゆい", message: "私たち全員、あなたに会えて嬉しい❤❤", image: groupImage2 },
        { name: "みお", message: "あなたのこと、もう大好きになっちゃった❤", image: groupImage3 },
        { name: "えま", message: "みんなであなたを愛してる❤❤❤", image: groupImage4 }
      ]
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMsg: GroupMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setNewMessage('');
    setIsTyping(true);

    // 少し遅延を入れて、より自然な会話感を演出
    setTimeout(() => {
      const groupResponses = generateGroupResponse(newMessage);
      
      const groupMsg: GroupMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'group',
        message: 'みんなからの愛のメッセージ❤❤❤',
        timestamp: new Date().toISOString(),
        characters: groupResponses
      };

      setMessages(prev => [...prev, groupMsg]);
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
          💕 4人の女子クラスメイトが一斉にあなたに話しかけます 💕
        </p>
      </div>

      {/* チャットエリア */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
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
                <div className="max-w-4xl">
                  <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-4 shadow-lg border border-pink-200 dark:border-pink-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {message.characters?.map((char, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-pink-50/50 dark:bg-pink-950/50 rounded-lg">
                          <Avatar className="w-12 h-12 border-2 border-pink-300 dark:border-pink-700">
                            <AvatarImage src={char.image} alt={char.name} />
                            <AvatarFallback className="bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200">
                              {char.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-pink-800 dark:text-pink-200 text-sm">
                                {char.name}
                              </span>
                              <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {char.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-pink-600 dark:text-pink-400 mt-3 text-center">
                      {new Date(message.timestamp).toLocaleTimeString('ja-JP', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
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
                  <span className="text-sm text-pink-600 dark:text-pink-400">みんながお返事を考えています❤</span>
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
          💕 4人の女子があなたのメッセージを待っています 💕
        </p>
      </div>
    </div>
  );
}