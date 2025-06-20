import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Heart, Star, Settings, Save, Download, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import CharacterCard from "@/components/character-card";
import SettingsModal from "@/components/settings-modal";
import SaveLoadModal from "@/components/save-load-modal";
import { useState } from "react";
import type { Character } from "@shared/schema";

export default function CharacterSelection() {
  const [, setLocation] = useLocation();
  const [showSettings, setShowSettings] = useState(false);
  const [showSaveLoad, setShowSaveLoad] = useState<'save' | 'load' | null>(null);
  const [musicEnabled, setMusicEnabled] = useState(true);

  const { data: characters, isLoading } = useQuery<Character[]>({
    queryKey: ['/api/characters'],
  });

  const handleCharacterSelect = (characterId: number) => {
    setLocation(`/chat/${characterId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="text-primary text-2xl animate-heartbeat" />
              <h1 className="text-2xl font-bold text-deep japanese-heading">恋愛クラスメイト</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowSaveLoad('save')}
                className="bg-secondary/10 border-secondary hover:bg-secondary/20"
              >
                <Save className="mr-2 h-4 w-4" />
                保存
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSaveLoad('load')}
                className="bg-accent/10 border-accent hover:bg-accent/20"
              >
                <Download className="mr-2 h-4 w-4" />
                読込
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(true)}
                className="text-deep hover:text-primary"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-deep mb-4 japanese-heading">
            あなたの運命の人を選んでください
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto japanese-text">
            美しいクラスメイトがあなたを待っています。それぞれ独特の性格と魅力を持っています。
          </p>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {characters?.map((character, index) => (
            <CharacterCard
              key={character.id}
              character={character}
              onSelect={() => handleCharacterSelect(character.id)}
              animationDelay={index * 0.5}
            />
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-deep mb-6 japanese-heading">特別な機能</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <Heart className="text-primary text-3xl mb-3" />
              <h4 className="font-bold text-deep mb-2 japanese-text">深い感情表現</h4>
              <p className="text-sm text-gray-600 japanese-text">リアルな感情と反応で真の恋愛体験</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-secondary text-3xl mb-3">💬</div>
              <h4 className="font-bold text-deep mb-2 japanese-text">自然な会話</h4>
              <p className="text-sm text-gray-600 japanese-text">個性豊かな対話システム</p>
            </div>
            <div className="flex flex-col items-center">
              <Save className="text-accent text-3xl mb-3" />
              <h4 className="font-bold text-deep mb-2 japanese-text">関係の保存</h4>
              <p className="text-sm text-gray-600 japanese-text">進歩をセーブして継続</p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Music Control */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          size="icon"
          onClick={() => setMusicEnabled(!musicEnabled)}
          className={`w-14 h-14 rounded-full shadow-lg animate-float ${
            musicEnabled 
              ? "bg-white/80 text-primary hover:bg-white/90" 
              : "bg-gray-300/80 text-gray-600 hover:bg-gray-400/80"
          }`}
        >
          <Music className="h-6 w-6" />
        </Button>
      </div>

      {/* Modals */}
      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
      <SaveLoadModal 
        open={!!showSaveLoad} 
        onOpenChange={() => setShowSaveLoad(null)}
        mode={showSaveLoad || 'save'}
      />
    </>
  );
}
