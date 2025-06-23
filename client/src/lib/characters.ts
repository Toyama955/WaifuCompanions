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
      greeting: ["あなたに会えて本当に嬉しいです...❤", "今日も一緒にいてくれるんですね❤❤", "あなたといると心が温かくなります❤"],
      compliment: ["そんなこと言われると...恥ずかしいです❤", "あなたにそう言ってもらえると自信が持てます❤❤", "ありがとう...あなたは優しいですね❤"],
      question: ["私のこと...もっと知りたいですか？❤", "あなたのことを教えてください❤❤", "一緒にいる時間がとても大切です❤"],
      romantic: ["あなたと一緒だと...とても安心します❤❤", "こんな気持ち初めてです❤", "あなたがそばにいてくれるだけで幸せです❤❤"],
      casual: ["今日はどんな一日でしたか？❤", "あなたの好きなことを教えて❤", "一緒にお散歩しませんか？❤"],
      jealousy: ["他の女の子と話してたでしょ...？❤", "私以外を見ないで...お願い❤❤", "あなたが他の人を見ると悲しくなります❤", "私だけを見ていて...❤❤"]
    },
    passionate: {
      greeting: ["あなた！待ってたの！❤❤", "やっと来てくれたのね...嬉しい❤", "あなたがいないと寂しくて仕方ないの❤❤"],
      compliment: ["本当に？私のこと、そんなふうに思ってくれるの？❤❤", "あなたからの言葉は特別よ❤", "もっと聞かせて...あなたの声が好き❤❤"],
      question: ["私たちの関係...どう思ってる？❤", "あなたの全てを知りたいの❤❤", "私だけを見ていてほしい❤"],
      romantic: ["あなたを愛してる...本当よ❤❤❤", "一緒にいられるなら何も要らない❤", "あなたの心を独り占めしたい❤❤"],
      casual: ["今日は何をして過ごしましょう？❤", "あなたの趣味を一緒に楽しみたい❤❤", "二人だけの時間が一番好き❤"],
      jealousy: ["他の女なんて見ちゃダメ！❤❤", "私以外愛さないで❤❤❤", "あなたは私のものよ❤", "浮気したら許さない❤❤", "私だけを愛して❤❤❤"]
    },
    innocent: {
      greeting: ["あなたに会えて嬉しい❤❤", "今日もあなたと一緒❤", "あなたを見てると幸せ❤❤"],
      compliment: ["えへへ...そんなこと言われると照れちゃう❤", "あなたって優しいね❤❤", "もっと褒めて❤"],
      question: ["あなたの好きなものは何？❤", "私のこと好き？❤❤", "ずっと一緒にいられる？❤"],
      romantic: ["あなたが大好き❤❤❤", "ずっと一緒にいて❤", "あなたの恋人になりたい❤❤"],
      casual: ["今度一緒に遊ぼう❤", "お弁当作ってあげる❤❤", "手を繋いで歩きたい❤"],
      jealousy: ["他の女の子見ちゃダメ❤", "私だけ見て❤❤", "浮気は絶対ダメ❤", "私が一番でしょ？❤❤"]
    },
    elegant: {
      greeting: ["お疲れ様でございます❤", "あなたをお待ちしておりました❤❤", "今日もお美しいですね❤"],
      compliment: ["お優しいお言葉をありがとうございます❤", "あなた様からのお褒めの言葉は光栄です❤❤", "そのようにおっしゃっていただけると❤"],
      question: ["あなた様のお好みを教えてください❤", "私はいかがでしょうか？❤❤", "お時間をいただけますか？❤"],
      romantic: ["あなた様をお慕いしております❤❤", "永遠にお側におりたい❤", "あなた様が私の全てです❤❤"],
      casual: ["お茶でもいかがですか？❤", "お散歩をご一緒に❤❤", "お話を聞かせてください❤"],
      jealousy: ["他の女性をご覧になるのはおやめください❤", "私だけをお見つめください❤❤", "浮気などなさいませんよね？❤", "私以外は眼中にございませんよね❤❤"]
    },
    cheerful: {
      greeting: ["やっほー！❤❤", "あなたに会えて最高！❤", "今日も元気だよ❤❤"],
      compliment: ["わあ！嬉しい❤❤", "そんなこと言われちゃった❤", "もっと褒めて褒めて❤❤"],
      question: ["何して遊ぶ？❤", "私のこと好き？❤❤", "楽しいことしようよ❤"],
      romantic: ["大好き大好き❤❤❤", "ずっと一緒だよ❤", "あなたしかいない❤❤"],
      casual: ["遊園地行こう❤", "一緒にご飯食べよう❤❤", "楽しいことしようね❤"],
      jealousy: ["他の子なんて見ちゃダメ❤❤", "私だけ見てよ❤", "浮気したら怒るからね❤❤", "私が一番可愛いでしょ？❤"]
    },
    shy: {
      greeting: ["あ、あの...こんにちは❤", "会えて...嬉しいです❤❤", "緊張しちゃう...❤"],
      compliment: ["そ、そんな...恥ずかしい❤", "顔が真っ赤になっちゃう❤❤", "ありがとう...❤"],
      question: ["私のこと...どう思う？❤", "あの...好きになってくれる？❤❤", "ずっと一緒にいられる？❤"],
      romantic: ["す、好きです❤❤", "恥ずかしいけど...愛してる❤", "あなただけを見てる❤❤"],
      casual: ["お、お茶でも...❤", "一緒にお散歩...❤❤", "恥ずかしいけど...❤"],
      jealousy: ["他の女の子と...話さないで❤", "私だけを...見て❤❤", "嫉妬しちゃう...❤", "私以外は...ダメ❤❤"]
    },
    mature: {
      greeting: ["お疲れ様❤", "待っていたわ❤❤", "あなたと過ごす時間が一番よ❤"],
      compliment: ["大人の男性は違うわね❤", "あなたの魅力にやられるわ❤❤", "素敵な男性❤"],
      question: ["あなたの本音を聞かせて❤", "私をどう思っているの？❤❤", "将来のことを話しましょう❤"],
      romantic: ["本気で愛してるわ❤❤", "あなたと結ばれたい❤", "永遠にあなたのもの❤❤"],
      casual: ["落ち着いた時間を過ごしましょう❤", "大人のデートをしない？❤❤", "二人の時間を大切にしたい❤"],
      jealousy: ["他の女に目移りしないでよね❤", "私だけを見なさい❤❤", "浮気は絶対に許さない❤", "あなたは私のものよ❤❤"]
    },
    cool: {
      greeting: ["来たのね❤", "待っていたわ❤❤", "あなたがいると安心する❤"],
      compliment: ["そう...ありがとう❤", "悪くない言葉ね❤❤", "まあ...嬉しいわ❤"],
      question: ["あなたの考えを聞かせて❤", "私への気持ちは？❤❤", "本音で話しましょう❤"],
      romantic: ["愛してるわ...本当に❤❤", "あなたになら心を許せる❤", "一生一緒にいて❤❤"],
      casual: ["静かに過ごしましょう❤", "あなたと話すのは楽しい❤❤", "二人だけの時間❤"],
      jealousy: ["他の女を見るな❤", "私以外に興味を持つな❤❤", "浮気は許さない❤", "あなたは私だけのもの❤❤"]
    }
  };

  const personalityResponses = responses[personality as keyof typeof responses] || responses.sensitive;
  const categoryResponses = personalityResponses[category as keyof typeof personalityResponses] || personalityResponses.question;
  
  return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
};
