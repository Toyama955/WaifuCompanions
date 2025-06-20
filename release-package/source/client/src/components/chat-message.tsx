import type { Character } from "@shared/schema";

interface Message {
  id: string;
  sender: 'user' | 'character';
  message: string;
  timestamp: string;
}

interface ChatMessageProps {
  message: Message;
  character: Character;
}

export default function ChatMessage({ message, character }: ChatMessageProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (message.sender === 'user') {
    return (
      <div className="flex items-start space-x-3 justify-end">
        <div className="chat-bubble chat-bubble-right bg-primary text-white rounded-lg p-4 max-w-xs shadow-md">
          <p className="japanese-text">{message.message}</p>
          <span className="text-xs text-primary-100 mt-2 block">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold japanese-text">
          あ
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3">
      <img 
        src={character.imageUrl} 
        alt={character.name} 
        className="w-10 h-10 rounded-full border-2 border-primary/30 object-cover"
      />
      <div className="chat-bubble chat-bubble-left bg-white rounded-lg p-4 max-w-xs shadow-md">
        <p className="text-deep japanese-text">{message.message}</p>
        <span className="text-xs text-gray-400 mt-2 block">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
