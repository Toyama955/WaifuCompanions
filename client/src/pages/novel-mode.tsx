import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { characterImages } from "@/lib/characters";
import { Link } from "wouter";
import { ArrowLeft, BookOpen, Heart, Star, Clock } from "lucide-react";

interface NovelChapter {
  id: number;
  title: string;
  description: string;
  estimatedTime: number; // minutes
  isUnlocked: boolean;
  isCompleted: boolean;
  characters: string[];
  scenes: NovelScene[];
}

interface NovelScene {
  id: number;
  backgroundImage?: string;
  character?: string;
  characterExpression?: string;
  dialogue: string;
  speaker: string;
  choices?: NovelChoice[];
  affectionChanges?: { [character: string]: number };
  nextScene?: number;
}

interface NovelChoice {
  id: number;
  text: string;
  nextScene: number;
  affectionChanges?: { [character: string]: number };
  requirements?: { [character: string]: number };
}

export default function NovelMode() {
  const [currentChapter, setCurrentChapter] = useState<number | null>(null);
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [completedScenes, setCompletedScenes] = useState<number[]>([]);
  const [characterAffection, setCharacterAffection] = useState<{ [key: string]: number }>({});
  const [totalPlayTime, setTotalPlayTime] = useState<number>(0);
  const [unlockedChapters, setUnlockedChapters] = useState<number[]>([1]);
  const [isAutoMode, setIsAutoMode] = useState<boolean>(false);

  const chapters: NovelChapter[] = [
    {
      id: 1,
      title: "春の出会い",
      description: "新学期が始まり、クラスメイトたちとの初めての出会いを体験します。",
      estimatedTime: 25,
      isUnlocked: true,
      isCompleted: false,
      characters: ["さくら", "あい", "ゆい"],
      scenes: [
        {
          id: 1,
          speaker: "ナレーター",
          dialogue: "春の暖かい陽射しが差し込む教室で、新学期が始まった。新しいクラスメイトたちとの出会いが待っている。",
          nextScene: 2
        },
        {
          id: 2,
          character: "さくら",
          speaker: "さくら",
          dialogue: "あの...初めまして。桜井さくらです❤ よろしくお願いします。",
          choices: [
            { id: 1, text: "こちらこそよろしく", nextScene: 3, affectionChanges: { "さくら": 2 } },
            { id: 2, text: "可愛い名前だね", nextScene: 4, affectionChanges: { "さくら": 3 } },
            { id: 3, text: "一緒に頑張ろう", nextScene: 5, affectionChanges: { "さくら": 1 } }
          ]
        },
        {
          id: 3,
          character: "さくら",
          speaker: "さくら",
          dialogue: "えへへ...優しいんですね❤ 今日から同じクラスだから、仲良くしてください。",
          nextScene: 6
        },
        {
          id: 4,
          character: "さくら",
          speaker: "さくら",
          dialogue: "そ、そんな...恥ずかしいです❤❤ でも、ありがとうございます。嬉しい。",
          nextScene: 6
        },
        {
          id: 5,
          character: "さくら",
          speaker: "さくら",
          dialogue: "はい！一緒に頑張りましょう❤ あなたがいてくれると心強いです。",
          nextScene: 6
        },
        {
          id: 6,
          character: "あい",
          speaker: "あい",
          dialogue: "あら、新しい子？私は愛美よ❤ みんなからは「あい」って呼ばれてるの。",
          choices: [
            { id: 1, text: "美人だね", nextScene: 7, affectionChanges: { "あい": 3 } },
            { id: 2, text: "よろしくね", nextScene: 8, affectionChanges: { "あい": 2 } },
            { id: 3, text: "いい名前だ", nextScene: 9, affectionChanges: { "あい": 1 } }
          ]
        },
        {
          id: 7,
          character: "あい",
          speaker: "あい",
          dialogue: "もう❤ そんなこと言われちゃうと照れちゃうじゃない。でも嬉しいわ❤❤",
          nextScene: 10
        },
        {
          id: 8,
          character: "あい",
          speaker: "あい",
          dialogue: "こちらこそ❤ 今度一緒にお昼食べない？おすすめのお店があるの。",
          nextScene: 10
        },
        {
          id: 9,
          character: "あい",
          speaker: "あい",
          dialogue: "ありがとう❤ 両親が愛を込めて付けてくれた名前なの。大切にしてるわ。",
          nextScene: 10
        },
        {
          id: 10,
          character: "ゆい",
          speaker: "ゆい",
          dialogue: "わあ❤ 新しい人だ！私、田中ゆいです❤ みんなで仲良くしましょうね！",
          nextScene: 11
        },
        {
          id: 11,
          speaker: "ナレーター",
          dialogue: "こうして、素敵なクラスメイトたちとの新しい学校生活が始まった。これからどんな物語が待っているのだろうか...",
          nextScene: -1
        }
      ]
    },
    {
      id: 2,
      title: "放課後の約束",
      description: "放課後、クラスメイトたちとの距離が縮まる特別な時間を過ごします。",
      estimatedTime: 35,
      isUnlocked: false,
      isCompleted: false,
      characters: ["みお", "かえで", "ちさと"],
      scenes: [
        {
          id: 12,
          speaker: "ナレーター",
          dialogue: "放課後の教室。夕日が差し込む中、まだ残っているクラスメイトたちと話す機会が生まれた。",
          nextScene: 13
        },
        {
          id: 13,
          character: "みお",
          speaker: "みお",
          dialogue: "あなたもまだ残ってるんですね❤ 私、図書委員の仕事があるんです。一緒に図書室に行きませんか？",
          choices: [
            { id: 1, text: "喜んで一緒に行く", nextScene: 14, affectionChanges: { "みお": 4 } },
            { id: 2, text: "図書委員なんだ、偉いね", nextScene: 15, affectionChanges: { "みお": 2 } },
            { id: 3, text: "また今度お願いします", nextScene: 16, affectionChanges: { "みお": -1 } }
          ]
        },
        {
          id: 14,
          character: "みお",
          speaker: "みお",
          dialogue: "本当ですか❤❤ 嬉しい！一緒だと楽しく作業できます。あなたがいてくれると心強いです❤",
          nextScene: 17
        },
        {
          id: 15,
          character: "みお",
          speaker: "みお",
          dialogue: "そんな...恥ずかしいです❤ でも、本が好きだから苦にならないんです。",
          nextScene: 17
        },
        {
          id: 16,
          character: "みお",
          speaker: "みお",
          dialogue: "そうですか...残念です。でも、いつでも声をかけてくださいね❤",
          nextScene: 18
        },
        {
          id: 17,
          speaker: "ナレーター",
          dialogue: "図書室で静かに過ごす時間。みおちゃんの真面目で優しい一面を見ることができた。",
          nextScene: 18
        },
        {
          id: 18,
          character: "かえで",
          speaker: "かえで",
          dialogue: "あ、お疲れ様❤ 私、生徒会の仕事で遅くなっちゃって。あなたも残ってたんですね。",
          choices: [
            { id: 1, text: "生徒会、頑張ってるね", nextScene: 19, affectionChanges: { "かえで": 3 } },
            { id: 2, text: "一緒に帰ろうか", nextScene: 20, affectionChanges: { "かえで": 4 } },
            { id: 3, text: "お疲れ様", nextScene: 21, affectionChanges: { "かえで": 1 } }
          ]
        },
        {
          id: 19,
          character: "かえで",
          speaker: "かえで",
          dialogue: "ありがとう❤ みんなのために頑張ってるの。あなたに認めてもらえて嬉しいです❤❤",
          nextScene: 22
        },
        {
          id: 20,
          character: "かえで",
          speaker: "かえで",
          dialogue: "本当に？❤❤ 嬉しい！一緒に帰れるなんて、今日は特別な日になりそうです❤",
          nextScene: 22
        },
        {
          id: 21,
          character: "かえで",
          speaker: "かえで",
          dialogue: "ありがとうございます❤ あなたも今日一日お疲れ様でした。",
          nextScene: 22
        },
        {
          id: 22,
          character: "ちさと",
          speaker: "ちさと",
          dialogue: "あら、まだいたのね❤ 私も部活が終わったところよ。一緒にいると安心するわ❤",
          nextScene: 23
        },
        {
          id: 23,
          speaker: "ナレーター",
          dialogue: "夕暮れの学校で、クラスメイトたちとの絆が深まった一日だった。明日も楽しみになってきた。",
          nextScene: -1
        }
      ]
    },
    {
      id: 3,
      title: "学園祭準備",
      description: "学園祭の準備を通じて、クラスメイトたちとの協力と友情を深めます。",
      estimatedTime: 40,
      isUnlocked: false,
      isCompleted: false,
      characters: ["はるか", "まり", "りん", "みれい"],
      scenes: [
        {
          id: 24,
          speaker: "ナレーター",
          dialogue: "学園祭が近づいてきた。クラス全体で準備に取り組む中、バンドメンバーたちとの交流が深まっていく。",
          nextScene: 25
        },
        {
          id: 25,
          character: "はるか",
          speaker: "はるか",
          dialogue: "学園祭でライブをするの❤ あなたも聞きに来てくれる？私たちの演奏、聞いてほしいな❤❤",
          choices: [
            { id: 1, text: "絶対に聞きに行く", nextScene: 26, affectionChanges: { "はるか": 5 } },
            { id: 2, text: "楽しみにしてる", nextScene: 27, affectionChanges: { "はるか": 3 } },
            { id: 3, text: "頑張って", nextScene: 28, affectionChanges: { "はるか": 1 } }
          ]
        },
        {
          id: 26,
          character: "はるか",
          speaker: "はるか",
          dialogue: "本当に？❤❤❤ 嬉しい！あなたのために特別に頑張っちゃう❤ 絶対に感動させてあげる！",
          nextScene: 29
        },
        {
          id: 27,
          character: "はるか",
          speaker: "はるか",
          dialogue: "ありがとう❤ あなたに楽しんでもらえるように、練習頑張るね❤❤",
          nextScene: 29
        },
        {
          id: 28,
          character: "はるか",
          speaker: "はるか",
          dialogue: "うん、頑張る❤ あなたの応援があると力が湧いてくるよ❤",
          nextScene: 29
        },
        {
          id: 29,
          character: "まり",
          speaker: "まり",
          dialogue: "私もドラムで参加するの❤ リズムに合わせて体を動かすの、楽しいのよ❤❤",
          choices: [
            { id: 1, text: "かっこいいね", nextScene: 30, affectionChanges: { "まり": 4 } },
            { id: 2, text: "見てみたい", nextScene: 31, affectionChanges: { "まり": 3 } },
            { id: 3, text: "頑張って", nextScene: 32, affectionChanges: { "まり": 1 } }
          ]
        },
        {
          id: 30,
          character: "まり",
          speaker: "まり",
          dialogue: "えへへ❤❤ かっこいいって言われちゃった！あなたに認めてもらえて嬉しいわ❤",
          nextScene: 33
        },
        {
          id: 31,
          character: "まり",
          speaker: "まり",
          dialogue: "本当に？❤ じゃあ、今度練習を見学しに来ない？あなたのために特別に演奏してあげる❤❤",
          nextScene: 33
        },
        {
          id: 32,
          character: "まり",
          speaker: "まり",
          dialogue: "ありがとう❤ あなたの応援があると頑張れる❤",
          nextScene: 33
        },
        {
          id: 33,
          character: "りん",
          speaker: "りん",
          dialogue: "私はベースを担当してるの❤ 低音で皆を支えるのが私の役目よ❤❤",
          nextScene: 34
        },
        {
          id: 34,
          character: "みれい",
          speaker: "みれい",
          dialogue: "私はキーボードね❤ メロディーを彩るのが得意なの❤ あなたのために素敵な曲を奏でるわ❤❤",
          nextScene: 35
        },
        {
          id: 35,
          speaker: "ナレーター",
          dialogue: "バンドメンバーたちの情熱を感じながら、学園祭への期待が高まっていく。",
          nextScene: -1
        }
      ]
    },
    {
      id: 4,
      title: "夏の思い出",
      description: "夏休みの特別なイベントで、より深い関係を築いていきます。",
      estimatedTime: 45,
      isUnlocked: false,
      isCompleted: false,
      characters: ["なな", "りさ", "あおい", "まゆ"],
      scenes: [
        {
          id: 36,
          speaker: "ナレーター",
          dialogue: "夏休みが始まった。クラスメイトたちとの特別な時間を過ごす機会がやってきた。",
          nextScene: 37
        },
        // 夏の思い出シーンを追加...
        {
          id: 37,
          character: "なな",
          speaker: "なな",
          dialogue: "夏祭りに一緒に行きませんか？❤ 浴衣を着て、花火を見ましょう❤❤",
          choices: [
            { id: 1, text: "ぜひ一緒に行こう", nextScene: 38, affectionChanges: { "なな": 5 } },
            { id: 2, text: "浴衣姿、楽しみだ", nextScene: 39, affectionChanges: { "なな": 4 } },
            { id: 3, text: "花火いいね", nextScene: 40, affectionChanges: { "なな": 2 } }
          ]
        },
        {
          id: 38,
          character: "なな",
          speaker: "なな",
          dialogue: "本当に？❤❤❤ 嬉しい！あなたと一緒なら、きっと素敵な夏祭りになりますね❤",
          nextScene: 41
        },
        {
          id: 39,
          character: "なな",
          speaker: "なな",
          dialogue: "そんな...恥ずかしいです❤❤ でも、あなたに見てもらいたくて、特別な浴衣を選んだんです❤",
          nextScene: 41
        },
        {
          id: 40,
          character: "なな",
          speaker: "なな",
          dialogue: "はい❤ 二人で見る花火は、きっと特別な思い出になりますね❤❤",
          nextScene: 41
        },
        {
          id: 41,
          character: "りさ",
          speaker: "りさ",
          dialogue: "あら、夏祭りの話？私も行くつもりなの❤ 一緒に金魚すくいでもしましょうか？❤❤",
          choices: [
            { id: 1, text: "みんなで行こう", nextScene: 42, affectionChanges: { "りさ": 3, "なな": 2 } },
            { id: 2, text: "金魚すくい上手そう", nextScene: 43, affectionChanges: { "りさ": 4 } },
            { id: 3, text: "楽しそうだね", nextScene: 44, affectionChanges: { "りさ": 2 } }
          ]
        },
        {
          id: 42,
          character: "りさ",
          speaker: "りさ",
          dialogue: "素敵❤ みんなで行けば、もっと楽しくなりそうね❤❤ あなたがいてくれると安心します❤",
          nextScene: 45
        },
        {
          id: 43,
          character: "りさ",
          speaker: "りさ",
          dialogue: "えへへ❤ 実は小さい頃からの特技なの❤ あなたにも教えてあげるから、一緒に挑戦しましょう❤❤",
          nextScene: 45
        },
        {
          id: 44,
          character: "りさ",
          speaker: "りさ",
          dialogue: "でしょ？❤ あなたと一緒だと、どんなことでも楽しくなっちゃう❤❤",
          nextScene: 45
        },
        {
          id: 45,
          character: "あおい",
          speaker: "あおい",
          dialogue: "私も夏祭り参加したいです❤ みんなでたこ焼きやかき氷を食べませんか？❤❤",
          nextScene: 46
        },
        {
          id: 46,
          character: "まゆ",
          speaker: "まゆ",
          dialogue: "素敵な夏の思い出になりそうですね❤ 私、写真を撮るのが好きなので、皆さんの笑顔をたくさん撮らせてください❤❤",
          nextScene: 47
        },
        {
          id: 47,
          speaker: "ナレーター",
          dialogue: "夏祭りの夜、浴衣を着たクラスメイトたちと過ごした時間は、忘れられない思い出となった。花火が夜空を彩る中、新しい絆が生まれていく。",
          nextScene: -1
        }
      ]
    },
    {
      id: 5,
      title: "文化祭の奇跡",
      description: "文化祭での感動的な出来事と告白シーンが待っています。",
      estimatedTime: 50,
      isUnlocked: false,
      isCompleted: false,
      characters: ["さき", "のぞみ", "あかり", "ひより"],
      scenes: [
        {
          id: 48,
          speaker: "ナレーター",
          dialogue: "ついに文化祭の日がやってきた。校内は多くの人で賑わい、特別な雰囲気に包まれている。",
          nextScene: 49
        },
        {
          id: 49,
          character: "さき",
          speaker: "さき",
          dialogue: "あなた！来てくれたんですね❤ 私たちのクラスの出し物、見に来てください❤❤",
          choices: [
            { id: 1, text: "楽しみにしてたよ", nextScene: 50, affectionChanges: { "さき": 4 } },
            { id: 2, text: "何をするの？", nextScene: 51, affectionChanges: { "さき": 2 } },
            { id: 3, text: "頑張ってね", nextScene: 52, affectionChanges: { "さき": 1 } }
          ]
        },
        {
          id: 50,
          character: "さき",
          speaker: "さき",
          dialogue: "本当ですか？❤❤ 嬉しい！あなたのために特別に頑張っちゃいます❤",
          nextScene: 53
        },
        {
          id: 51,
          character: "さき",
          speaker: "さき",
          dialogue: "演劇をするんです❤ 私、主役なんですよ❤❤ あなたに見てもらえて光栄です❤",
          nextScene: 53
        },
        {
          id: 52,
          character: "さき",
          speaker: "さき",
          dialogue: "ありがとうございます❤ あなたの応援があると力が湧いてきます❤❤",
          nextScene: 53
        },
        {
          id: 53,
          character: "のぞみ",
          speaker: "のぞみ",
          dialogue: "あなたも文化祭を楽しんでいるようですね❤ 私は美術部の展示を担当しているんです❤❤",
          choices: [
            { id: 1, text: "見せてもらいたい", nextScene: 54, affectionChanges: { "のぞみ": 5 } },
            { id: 2, text: "芸術的だね", nextScene: 55, affectionChanges: { "のぞみ": 3 } },
            { id: 3, text: "頑張ってるね", nextScene: 56, affectionChanges: { "のぞみ": 2 } }
          ]
        },
        {
          id: 54,
          character: "のぞみ",
          speaker: "のぞみ",
          dialogue: "本当に？❤❤❤ 嬉しいです！あなたに私の作品を見てもらえるなんて、夢みたい❤",
          nextScene: 57
        },
        {
          id: 55,
          character: "のぞみ",
          speaker: "のぞみ",
          dialogue: "ありがとうございます❤❤ あなたのような感性のある人に認められると自信が持てます❤",
          nextScene: 57
        },
        {
          id: 56,
          character: "のぞみ",
          speaker: "のぞみ",
          dialogue: "はい❤ あなたのために素敵な作品を作ったんです❤❤",
          nextScene: 57
        },
        {
          id: 57,
          character: "あかり",
          speaker: "あかり",
          dialogue: "みなさん、お疲れ様です❤ 私は文化祭実行委員として、今日の成功のために頑張っています❤❤",
          nextScene: 58
        },
        {
          id: 58,
          character: "ひより",
          speaker: "ひより",
          dialogue: "文化祭、とても盛り上がってますね❤ あなたと一緒だと、普通の文化祭も特別な思い出になります❤❤",
          choices: [
            { id: 1, text: "君といると楽しい", nextScene: 59, affectionChanges: { "ひより": 6 } },
            { id: 2, text: "特別な日だね", nextScene: 60, affectionChanges: { "ひより": 4 } },
            { id: 3, text: "いい思い出になるね", nextScene: 61, affectionChanges: { "ひより": 3 } }
          ]
        },
        {
          id: 59,
          character: "ひより",
          speaker: "ひより",
          dialogue: "私も...あなたといると毎日が楽しいです❤❤❤ ずっと一緒にいたい❤",
          nextScene: 62
        },
        {
          id: 60,
          character: "ひより",
          speaker: "ひより",
          dialogue: "はい❤❤ あなたがいてくれるから、今日は本当に特別な日になりました❤",
          nextScene: 62
        },
        {
          id: 61,
          character: "ひより",
          speaker: "ひより",
          dialogue: "きっと忘れられない思い出になりますね❤❤ あなたと過ごした時間はすべて宝物です❤",
          nextScene: 62
        },
        {
          id: 62,
          speaker: "ナレーター",
          dialogue: "文化祭の夜、屋上で花火を見上げながら、クラスメイトたちとの絆はさらに深まった。この瞬間が永遠に続けばいいのに、そんな想いが心に宿る。",
          nextScene: 63
        },
        {
          id: 63,
          speaker: "ナレーター",
          dialogue: "文化祭の最後に、みんなで撮った写真は一生の宝物になった。こうして、忘れられない学園生活の一ページが刻まれた。",
          nextScene: -1
        }
      ]
    },
    {
      id: 6,
      title: "冬の告白",
      description: "雪の降る冬の日、ついに運命の告白の時が訪れます。",
      estimatedTime: 40,
      isUnlocked: false,
      isCompleted: false,
      characters: ["さくら", "あい", "みお", "ゆい"],
      scenes: [
        {
          id: 64,
          speaker: "ナレーター",
          dialogue: "雪が舞い散る冬の日。長い間築いてきた関係に、ついに変化の時が訪れようとしている。",
          nextScene: 65
        },
        {
          id: 65,
          character: "さくら",
          speaker: "さくら",
          dialogue: "あの...お話があるんです❤ 放課後、校庭で待っていてもらえませんか？❤❤",
          choices: [
            { id: 1, text: "もちろん", nextScene: 66, affectionChanges: { "さくら": 5 } },
            { id: 2, text: "何の話？", nextScene: 67, affectionChanges: { "さくら": 2 } },
            { id: 3, text: "大切な話？", nextScene: 68, affectionChanges: { "さくら": 3 } }
          ]
        },
        {
          id: 66,
          character: "さくら",
          speaker: "さくら",
          dialogue: "ありがとうございます❤❤ あなたに伝えたいことがあるんです...大切なお話です❤",
          nextScene: 69
        },
        {
          id: 67,
          character: "さくら",
          speaker: "さくら",
          dialogue: "それは...その時に❤ でも、とても大切なお話なんです❤❤",
          nextScene: 69
        },
        {
          id: 68,
          character: "さくら",
          speaker: "さくら",
          dialogue: "はい...私にとってとても大切なお話です❤❤ 勇気を出して言わなければ❤",
          nextScene: 69
        },
        {
          id: 69,
          speaker: "ナレーター",
          dialogue: "放課後、雪化粧した校庭でさくらが待っていた。彼女の頬は寒さか緊張で赤く染まっている。",
          nextScene: 70
        },
        {
          id: 70,
          character: "さくら",
          speaker: "さくら",
          dialogue: "あの...今まで一緒にいてくれて、ありがとうございました❤ 私...あなたのことが...❤❤",
          choices: [
            { id: 1, text: "僕も君が好きだ", nextScene: 71, affectionChanges: { "さくら": 10 } },
            { id: 2, text: "続けて", nextScene: 72, affectionChanges: { "さくら": 3 } },
            { id: 3, text: "落ち着いて", nextScene: 73, affectionChanges: { "さくら": 2 } }
          ]
        },
        {
          id: 71,
          character: "さくら",
          speaker: "さくら",
          dialogue: "本当ですか？❤❤❤ 嬉しい...こんなに嬉しいことはありません❤ ずっと一緒にいてください❤❤",
          nextScene: 74
        },
        {
          id: 72,
          character: "さくら",
          speaker: "さくら",
          dialogue: "あなたのことが...大好きです❤❤ 私の気持ち、受け取ってもらえますか？❤",
          nextScene: 75
        },
        {
          id: 73,
          character: "さくら",
          speaker: "さくら",
          dialogue: "はい...でも言わせてください❤ あなたが大好きです❤❤ 私と付き合ってください❤",
          nextScene: 75
        },
        {
          id: 74,
          speaker: "ナレーター",
          dialogue: "雪の中で交わした愛の誓いは、二人にとって最も美しい瞬間となった。",
          nextScene: -1
        },
        {
          id: 75,
          speaker: "ナレーター",
          dialogue: "告白を受けた主人公の答えが、この物語の結末を決める重要な瞬間だった。",
          nextScene: -1
        }
      ]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTotalPlayTime(prev => prev + 1);
    }, 60000); // 1分ごと

    return () => clearInterval(timer);
  }, []);

  const handleSceneChoice = (choice: NovelChoice) => {
    if (choice.affectionChanges) {
      setCharacterAffection(prev => {
        const updated = { ...prev };
        Object.entries(choice.affectionChanges!).forEach(([char, change]) => {
          updated[char] = (updated[char] || 0) + change;
        });
        return updated;
      });
    }
    
    setCompletedScenes(prev => [...prev, currentScene]);
    setCurrentScene(choice.nextScene);
  };

  const handleNextScene = () => {
    const chapter = chapters.find(c => c.id === currentChapter);
    if (!chapter) return;
    
    const scene = chapter.scenes.find(s => s.id === currentScene);
    if (!scene || !scene.nextScene) return;
    
    if (scene.nextScene === -1) {
      // 章終了
      setCurrentChapter(null);
      setCurrentScene(0);
      // 次の章をアンロック
      if (currentChapter && currentChapter < chapters.length) {
        setUnlockedChapters(prev => [...prev, currentChapter + 1]);
      }
      return;
    }
    
    setCompletedScenes(prev => [...prev, currentScene]);
    setCurrentScene(scene.nextScene);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}時間${mins}分` : `${mins}分`;
  };

  const getTotalEstimatedTime = () => {
    return chapters.reduce((total, chapter) => total + chapter.estimatedTime, 0);
  };

  const getCompletedTime = () => {
    return chapters
      .filter(c => c.isCompleted)
      .reduce((total, chapter) => total + chapter.estimatedTime, 0);
  };

  const characterNameToImageKey = (charName: string): keyof typeof characterImages | null => {
    const mapping: Record<string, keyof typeof characterImages> = {
      'さくら': 1, 'あい': 2, 'みお': 3, 'ゆい': 4, 'かえで': 5, 'ちさと': 6,
      'はるか': 7, 'まり': 8, 'りん': 9, 'みれい': 10, 'なな': 11, 'りさ': 12,
      'あおい': 13, 'まゆ': 14, 'さき': 15, 'のぞみ': 16, 'あかり': 17, 'ひより': 18
    };
    return mapping[charName] || null;
  };

  if (currentChapter !== null) {
    const chapter = chapters.find(c => c.id === currentChapter);
    const scene = chapter?.scenes.find(s => s.id === currentScene);
    
    if (!chapter || !scene) {
      return <div>エラー：シーンが見つかりません</div>;
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-6">
            <Button 
              onClick={() => setCurrentChapter(null)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              章選択に戻る
            </Button>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(totalPlayTime)}
              </Badge>
              <Button
                onClick={() => setIsAutoMode(!isAutoMode)}
                variant={isAutoMode ? "default" : "outline"}
                size="sm"
              >
                AUTO
              </Button>
            </div>
          </div>

          {/* ストーリー表示エリア */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">
                {chapter.title} - シーン {currentScene}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* キャラクター画像 */}
              {scene.character && (
                <div className="flex justify-center mb-6">
                  <img 
                    src={characterImages[characterNameToImageKey(scene.character) || 1] || "/api/placeholder/300/400"} 
                    alt={scene.character}
                    className="w-48 h-64 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* 対話 */}
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">{scene.speaker}</Badge>
                </div>
                <p className="text-lg leading-relaxed">{scene.dialogue}</p>
              </div>

              {/* 選択肢 */}
              {scene.choices ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    選択してください：
                  </p>
                  {scene.choices.map((choice) => (
                    <Button
                      key={choice.id}
                      onClick={() => handleSceneChoice(choice)}
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-4"
                    >
                      {choice.text}
                      {choice.affectionChanges && (
                        <div className="ml-auto flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-500" />
                          <span className="text-xs">
                            {Object.entries(choice.affectionChanges).map(([char, change]) => (
                              <span key={char} className={change > 0 ? "text-green-500" : "text-red-500"}>
                                {char}({change > 0 ? '+' : ''}{change})
                              </span>
                            ))}
                          </span>
                        </div>
                      )}
                    </Button>
                  ))}
                </div>
              ) : (
                <Button 
                  onClick={handleNextScene}
                  className="w-full"
                >
                  次へ
                </Button>
              )}
            </CardContent>
          </Card>

          {/* 好感度表示 */}
          {Object.keys(characterAffection).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">好感度</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(characterAffection).map(([char, affection]) => (
                    <div key={char} className="flex items-center gap-2">
                      <span className="text-sm font-medium">{char}</span>
                      <div className="flex-1">
                        <Progress value={Math.min(affection, 100)} className="h-2" />
                      </div>
                      <span className="text-xs text-gray-500">{affection}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                メインに戻る
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-600" />
              <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200">
                ノベルモード
              </h1>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              総プレイ時間: {formatTime(totalPlayTime)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              推定時間: {formatTime(getTotalEstimatedTime())}
            </div>
          </div>
        </div>

        {/* 進行状況 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              ストーリー進行状況
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>全体の進行状況</span>
                <span>{getCompletedTime()}/{getTotalEstimatedTime()}分</span>
              </div>
              <Progress 
                value={(getCompletedTime() / getTotalEstimatedTime()) * 100} 
                className="h-3" 
              />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              完了した章: {chapters.filter(c => c.isCompleted).length}/{chapters.length}
            </div>
          </CardContent>
        </Card>

        {/* 章選択 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chapters.map((chapter) => (
            <Card 
              key={chapter.id} 
              className={`cursor-pointer transition-all duration-200 ${
                unlockedChapters.includes(chapter.id) 
                  ? 'hover:shadow-lg hover:scale-105' 
                  : 'opacity-50 cursor-not-allowed'
              } ${chapter.isCompleted ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}`}
              onClick={() => {
                if (unlockedChapters.includes(chapter.id)) {
                  setCurrentChapter(chapter.id);
                  setCurrentScene(chapter.scenes[0]?.id || 1);
                }
              }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{chapter.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    {chapter.isCompleted && (
                      <Badge variant="default" className="bg-green-500">
                        完了
                      </Badge>
                    )}
                    {!unlockedChapters.includes(chapter.id) && (
                      <Badge variant="secondary">
                        未解放
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {chapter.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      約{formatTime(chapter.estimatedTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-500">
                      {chapter.characters.length}人登場
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {chapter.characters.map((char) => (
                    <Badge key={char} variant="outline" className="text-xs">
                      {char}
                    </Badge>
                  ))}
                </div>

                {unlockedChapters.includes(chapter.id) && (
                  <Separator className="my-4" />
                )}
                
                {unlockedChapters.includes(chapter.id) && (
                  <Button className="w-full" variant="outline">
                    {chapter.isCompleted ? '再読' : '読む'}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 好感度一覧 */}
        {Object.keys(characterAffection).length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                キャラクター好感度
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(characterAffection).map(([char, affection]) => (
                  <div key={char} className="text-center">
                    <div className="text-sm font-medium mb-2">{char}</div>
                    <Progress value={Math.min(affection, 100)} className="h-2 mb-1" />
                    <div className="text-xs text-gray-500">{affection}/100</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}