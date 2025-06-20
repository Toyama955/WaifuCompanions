import { Heart, Crown, Music, Flower, GraduationCap, CloudRain, Leaf, Bolt, Sun } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Character } from "@shared/schema";

interface CharacterCardProps {
  character: Character;
  onSelect: () => void;
  animationDelay?: number;
}

const personalityIcons = {
  sensitive: Heart,
  passionate: Bolt,
  innocent: Flower,
  elegant: Crown,
  cheerful: Sun,
  emotional: CloudRain,
  artistic: Music,
  nature: Leaf,
  student: GraduationCap
};

const personalityColors = {
  sensitive: "border-pink-300 bg-pink-50",
  passionate: "border-red-300 bg-red-50",
  innocent: "border-purple-300 bg-purple-50",
  elegant: "border-indigo-300 bg-indigo-50",
  cheerful: "border-yellow-300 bg-yellow-50",
  emotional: "border-blue-300 bg-blue-50",
  artistic: "border-emerald-300 bg-emerald-50",
  nature: "border-green-300 bg-green-50",
  student: "border-slate-300 bg-slate-50"
};

export default function CharacterCard({ character, onSelect, animationDelay = 0 }: CharacterCardProps) {
  const IconComponent = personalityIcons[character.personality as keyof typeof personalityIcons] || Heart;
  const colorClass = personalityColors[character.personality as keyof typeof personalityColors] || "border-primary/30 bg-primary/5";
  
  const getAffectionHearts = (affection: number) => {
    const hearts = Math.floor(affection / 20);
    return Array.from({ length: 5 }, (_, i) => (
      <Heart 
        key={i} 
        className={`w-3 h-3 ${i < hearts ? 'text-primary fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <Card 
      className={`character-card bg-white/70 hover:shadow-xl border cursor-pointer animate-float ${colorClass}`}
      onClick={onSelect}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <CardContent className="p-6 text-center">
        <div className="relative mb-4">
          <img 
            src={character.imageUrl} 
            alt={character.name} 
            className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary/30 shadow-lg"
          />
          <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
            <IconComponent className="w-4 h-4" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-deep mb-2 japanese-heading">{character.name}</h3>
        <p className="text-sm text-gray-600 mb-3 japanese-text">{character.description}</p>
        
        <div className="flex justify-center mb-3">
          <div className="flex space-x-1">
            {getAffectionHearts(character.affection)}
          </div>
        </div>
        
        <div className="space-y-2 text-xs japanese-text">
          <div className="flex justify-between">
            <span>好感度:</span>
            <span className="text-primary font-bold">{character.affection}%</span>
          </div>
          <div className="flex justify-between">
            <span>性格:</span>
            <span className="truncate ml-2">{character.traits.slice(0, 2).join('・')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
