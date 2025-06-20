export const characterImages = {
  1: "/attached_assets/Whisk_557de62d0e_1750392189708.jpg",
  2: "/attached_assets/Whisk_667853873f_1750392189708.jpg", 
  3: "/attached_assets/Whisk_a7b850c577_1750392189709.jpg",
  4: "/attached_assets/Whisk_db75933b6f_1750392189709.jpg",
  5: "/attached_assets/Whisk_f10f501e8c_1750392189709.jpg",
  6: "/attached_assets/Whisk_f18b10378a_1750392189709.jpg"
} as const;

export const personalityDescriptions = {
  sensitive: "繊細で感情豊か",
  passionate: "情熱的で一途",
  innocent: "純真で可愛らしい", 
  elegant: "上品で知的",
  cheerful: "明るく元気",
  emotional: "感情豊かで繊細"
} as const;

export const generateCharacterResponse = (personality: string, category: string, userMessage: string): string => {
  const responses = {
    sensitive: {
      greeting: ["あなたに会えて本当に嬉しいです...", "今日も一緒にいてくれるんですね", "あなたといると心が温かくなります"],
      compliment: ["そんなこと言われると...恥ずかしいです", "あなたにそう言ってもらえると自信が持てます", "ありがとう...あなたは優しいですね"],
      question: ["私のこと...もっと知りたいですか？", "あなたのことを教えてください", "一緒にいる時間がとても大切です"],
      romantic: ["あなたと一緒だと...とても安心します", "こんな気持ち初めてです", "あなたがそばにいてくれるだけで幸せです"],
      casual: ["今日はどんな一日でしたか？", "あなたの好きなことを教えて", "一緒にお散歩しませんか？"]
    },
    passionate: {
      greeting: ["あなた！待ってたの！", "やっと来てくれたのね...嬉しい", "あなたがいないと寂しくて仕方ないの"],
      compliment: ["本当に？私のこと、そんなふうに思ってくれるの？", "あなたからの言葉は特別よ", "もっと聞かせて...あなたの声が好き"],
      question: ["私たちの関係...どう思ってる？", "あなたの全てを知りたいの", "私だけを見ていてほしい"],
      romantic: ["あなたを愛してる...本当よ", "一緒にいられるなら何も要らない", "あなたの心を独り占めしたい"],
      casual: ["今日は何をして過ごしましょう？", "あなたの趣味を一緒に楽しみたい", "二人だけの時間が一番好き"]
    }
  };

  const personalityResponses = responses[personality as keyof typeof responses] || responses.sensitive;
  const categoryResponses = personalityResponses[category as keyof typeof personalityResponses] || personalityResponses.question;
  
  return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
};
