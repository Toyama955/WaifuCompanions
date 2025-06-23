export const characterImages = {
  1: "/attached_assets/Whisk_557de62d0e_1750392189708.jpg",
  2: "/attached_assets/Whisk_667853873f_1750392189708.jpg", 
  3: "/attached_assets/Whisk_6f0031099f_1750392189707.jpg",
  4: "/attached_assets/Whisk_9c345a2714_1750392189708.jpg",
  5: "/attached_assets/Whisk_a7b850c577_1750392189709.jpg",
  6: "/attached_assets/Whisk_db75933b6f_1750392189709.jpg",
  7: "/attached_assets/image_1750397062491.jpg",
  8: "/attached_assets/Whisk_64bd803a88_1750397059338.jpg",
  9: "/attached_assets/Whisk_b7d789ba6c_1750397059339.jpg",
  10: "/attached_assets/Whisk_c6c605e165_1750397059339.jpg",
  11: "/attached_assets/Whisk_0b7230111a_1750678330066.jpg",
  12: "/attached_assets/Whisk_1dbfbf354b_1750678330066.jpg",
  13: "/attached_assets/Whisk_7ffa2c9406_1750678330067.jpg",
  14: "/attached_assets/Whisk_8d85046c6b_1750678330067.jpg",
  15: "/attached_assets/Whisk_35b331e8b1_1750678330067.jpg",
  16: "/attached_assets/Whisk_87f882b40b_1750678330067.jpg",
  17: "/attached_assets/Whisk_151bce4a40_1750678330068.jpg",
  18: "/attached_assets/Whisk_9674787138_1750678330068.jpg",
  19: "/attached_assets/Whisk_a9446c3df4_1750678330068.jpg",
  20: "/attached_assets/Whisk_d7f0688d6d_1750678330068.jpg",
  21: "/attached_assets/Whisk_e9d2dc169b_1750678330069.jpg",
  22: "/attached_assets/Whisk_e833e9c856_1750678330069.jpg"
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
