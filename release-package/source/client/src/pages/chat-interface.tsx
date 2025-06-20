import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Heart, MoreVertical, Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ChatMessage from "@/components/chat-message";
import { useState, useEffect, useRef } from "react";
import { apiRequest } from "@/lib/queryClient";
import type { Character, Conversation } from "@shared/schema";

export default function ChatInterface() {
  const [, params] = useRoute("/chat/:characterId");
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const characterId = parseInt(params?.characterId || "1");

  const { data: character } = useQuery<Character>({
    queryKey: [`/api/characters/${characterId}`],
  });

  const { data: conversation, refetch: refetchConversation } = useQuery<Conversation>({
    queryKey: [`/api/conversations/${characterId}?userId=default-user`],
  });

  const addMessageMutation = useMutation({
    mutationFn: async (messageData: { message: string; sender: 'user' | 'character'; userId?: string }) => {
      return apiRequest('POST', `/api/conversations/${characterId}/messages`, messageData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/conversations/${characterId}`] });
      refetchConversation();
    }
  });

  const generateResponseMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const response = await apiRequest('POST', `/api/characters/${characterId}/respond`, {
        message: userMessage
      });
      return response.json();
    },
    onSuccess: async (data) => {
      // Add character response to conversation
      await addMessageMutation.mutateAsync({
        message: data.response,
        sender: 'character',
        userId: 'default-user'
      });
      
      // Update character affection in cache
      queryClient.setQueryData([`/api/characters/${characterId}`], (old: Character | undefined) => {
        if (old) {
          return { ...old, affection: data.affection };
        }
        return old;
      });
      
      setIsTyping(false);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage("");
    setIsTyping(true);

    // Add user message
    await addMessageMutation.mutateAsync({
      message: userMessage,
      sender: 'user',
      userId: 'default-user'
    });

    // Generate and add character response
    setTimeout(() => {
      generateResponseMutation.mutate(userMessage);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedResponses = [
    "あなたの気持ちを聞かせてください",
    "一緒にいると安心します",
    "今日はどんな一日でしたか？",
    "あなたのことをもっと知りたいです"
  ];

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-romantic via-background to-accent/20">
      {/* Chat Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-lg border-b border-primary/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/")}
                className="text-deep hover:text-primary"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <img 
                  src={character.imageUrl} 
                  alt={character.name} 
                  className="w-12 h-12 rounded-full border-2 border-primary/30 object-cover"
                />
                <div>
                  <h3 className="font-bold text-deep japanese-heading">{character.name}</h3>
                  <p className="text-sm text-gray-600 japanese-text">あなたと話したがっています</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Heart className="text-primary h-4 w-4" />
                <span className="text-primary font-bold">{character.affection}%</span>
              </div>
              <Button variant="ghost" size="icon" className="text-deep hover:text-primary">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-4 mb-6 min-h-96">
          {conversation?.messages && Array.isArray(conversation.messages) ? (
            conversation.messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                character={character}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p className="japanese-text">会話を開始してください</p>
            </div>
          )}
          
          {isTyping && (
            <div className="flex items-start space-x-3">
              <img 
                src={character.imageUrl} 
                alt={character.name} 
                className="w-10 h-10 rounded-full border-2 border-primary/30 object-cover"
              />
              <div className="chat-bubble chat-bubble-left bg-white rounded-lg p-4 max-w-xs shadow-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Area */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg border border-primary/20">
          {/* Suggested responses */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2 japanese-text">おすすめの返答:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedResponses.map((response, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setMessage(response)}
                  className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 text-xs japanese-text"
                >
                  {response}
                </Button>
              ))}
            </div>
          </div>

          {/* Message input */}
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="メッセージを入力してください..."
                className="resize-none japanese-text"
                rows={2}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-3 text-gray-400 hover:text-primary"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || addMessageMutation.isPending}
              className="bg-primary text-white hover:bg-primary/80 px-6 py-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
