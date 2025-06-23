export const categorizeMessage = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // 嫉妬・束縛関連を最初にチェック
  if (lowerMessage.includes('他の') || lowerMessage.includes('浮気') || lowerMessage.includes('独占') || 
      lowerMessage.includes('私だけ') || lowerMessage.includes('嫉妬') || lowerMessage.includes('束縛') ||
      lowerMessage.includes('他の女') || lowerMessage.includes('他の子') || lowerMessage.includes('誰にも渡さない')) {
    return 'jealousy';
  }
  
  if (lowerMessage.includes('好き') || lowerMessage.includes('愛') || lowerMessage.includes('美しい') || lowerMessage.includes('可愛い')) {
    return 'compliment';
  } else if (lowerMessage.includes('こんにちは') || lowerMessage.includes('おはよう') || lowerMessage.includes('こんばんは')) {
    return 'greeting';
  } else if (lowerMessage.includes('愛してる') || lowerMessage.includes('恋') || lowerMessage.includes('キス')) {
    return 'romantic';
  } else if (lowerMessage.includes('今日') || lowerMessage.includes('天気') || lowerMessage.includes('趣味')) {
    return 'casual';
  }
  
  return 'question';
};

export const calculateAffectionIncrease = (category: string, currentAffection: number): number => {
  const baseIncrease = {
    greeting: 1,
    casual: 1,
    question: 2,
    compliment: 3,
    romantic: 4,
    jealousy: 5  // 嫉妬は最も高い愛情増加
  };

  const increase = baseIncrease[category as keyof typeof baseIncrease] || 1;
  const randomBonus = Math.floor(Math.random() * 2);
  
  // Diminishing returns at higher affection levels
  const diminishingFactor = currentAffection > 80 ? 0.5 : currentAffection > 60 ? 0.75 : 1;
  
  return Math.floor((increase + randomBonus) * diminishingFactor);
};
