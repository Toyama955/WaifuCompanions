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
      estimatedTime: 75,
      isUnlocked: true,
      isCompleted: false,
      characters: ["さくら", "あい", "ゆい", "みお", "かえで", "ちさと"],
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
          character: "ゆい",
          speaker: "ゆい",
          dialogue: "わあ❤ 新しい人だ！私、田中ゆいです❤ みんなで仲良くしましょうね！",
          choices: [
            { id: 1, text: "君も可愛いね", nextScene: 12, affectionChanges: { "ゆい": 4 } },
            { id: 2, text: "よろしくね", nextScene: 13, affectionChanges: { "ゆい": 2 } },
            { id: 3, text: "元気だね", nextScene: 14, affectionChanges: { "ゆい": 3 } }
          ]
        },
        {
          id: 12,
          character: "ゆい",
          speaker: "ゆい",
          dialogue: "えへへ❤❤ そんなこと言われると恥ずかしいです❤ でも嬉しい！",
          nextScene: 15
        },
        {
          id: 13,
          character: "ゆい",
          speaker: "ゆい",
          dialogue: "はい❤ こちらこそよろしくお願いします❤❤",
          nextScene: 15
        },
        {
          id: 14,
          character: "ゆい",
          speaker: "ゆい",
          dialogue: "ありがとうございます❤ 元気が取り柄なんです❤❤",
          nextScene: 15
        },
        {
          id: 15,
          character: "みお",
          speaker: "みお",
          dialogue: "あの...私も自己紹介させてください。佐藤みおです❤ 読書が好きで...あなたは何が好きですか？❤❤",
          choices: [
            { id: 1, text: "本も好きだよ", nextScene: 16, affectionChanges: { "みお": 5 } },
            { id: 2, text: "映画が好き", nextScene: 17, affectionChanges: { "みお": 2 } },
            { id: 3, text: "君と話すのが好き", nextScene: 18, affectionChanges: { "みお": 4 } }
          ]
        },
        {
          id: 16,
          character: "みお",
          speaker: "みお",
          dialogue: "本当ですか？❤❤❤ 嬉しい！今度一緒に図書館に行きませんか？おすすめの本を教えてあげます❤",
          nextScene: 19
        },
        {
          id: 17,
          character: "みお",
          speaker: "みお",
          dialogue: "映画ですか❤ 私も最近見始めたんです。今度一緒に見に行きませんか？❤❤",
          nextScene: 19
        },
        {
          id: 18,
          character: "みお",
          speaker: "みお",
          dialogue: "そ、そんな...❤❤ 顔が真っ赤になっちゃいます...でも嬉しいです❤",
          nextScene: 19
        },
        {
          id: 19,
          character: "かえで",
          speaker: "かえで",
          dialogue: "私は生徒会長の田中かえでです❤ 学校のことで困ったことがあったら、何でも相談してくださいね❤❤",
          choices: [
            { id: 1, text: "頼りになりそう", nextScene: 20, affectionChanges: { "かえで": 4 } },
            { id: 2, text: "生徒会長すごいね", nextScene: 21, affectionChanges: { "かえで": 3 } },
            { id: 3, text: "優しいんだね", nextScene: 22, affectionChanges: { "かえで": 2 } }
          ]
        },
        {
          id: 20,
          character: "かえで",
          speaker: "かえで",
          dialogue: "ありがとうございます❤❤ あなたのお役に立てるよう頑張ります❤",
          nextScene: 23
        },
        {
          id: 21,
          character: "かえで",
          speaker: "かえで",
          dialogue: "みんなから選んでもらった大切な役職です❤ 責任を持って務めさせていただいています❤❤",
          nextScene: 23
        },
        {
          id: 22,
          character: "かえで",
          speaker: "かえで",
          dialogue: "そう言ってもらえると嬉しいです❤ あなたと話していると心が温かくなります❤❤",
          nextScene: 23
        },
        {
          id: 23,
          character: "ちさと",
          speaker: "ちさと",
          dialogue: "最後に私ですね❤ 山田ちさとです。音楽が大好きで、ピアノを弾くんです❤❤ あなたは音楽は聞きますか？",
          choices: [
            { id: 1, text: "ピアノの音色が好き", nextScene: 24, affectionChanges: { "ちさと": 5 } },
            { id: 2, text: "音楽は色々聞く", nextScene: 25, affectionChanges: { "ちさと": 3 } },
            { id: 3, text: "今度演奏聞かせて", nextScene: 26, affectionChanges: { "ちさと": 4 } }
          ]
        },
        {
          id: 24,
          character: "ちさと",
          speaker: "ちさと",
          dialogue: "本当ですか？❤❤❤ 嬉しい！今度私の演奏を聞いてください。あなたのために特別な曲を弾きます❤",
          nextScene: 27
        },
        {
          id: 25,
          character: "ちさと",
          speaker: "ちさと",
          dialogue: "そうなんですね❤ 今度一緒にコンサートに行きませんか？素敵な音楽を共有したいです❤❤",
          nextScene: 27
        },
        {
          id: 26,
          character: "ちさと",
          speaker: "ちさと",
          dialogue: "ぜひ❤❤ あなたに聞いてもらえるなんて、とても嬉しいです。練習に更に力が入ります❤",
          nextScene: 27
        },
        {
          id: 27,
          speaker: "ナレーター",
          dialogue: "昼休みになった。クラスメイトたちはそれぞれの場所へ向かっていく。",
          choices: [
            { id: 1, text: "さくらと一緒に昼食", nextScene: 28 },
            { id: 2, text: "図書室でみおと過ごす", nextScene: 35 },
            { id: 3, text: "生徒会室でかえでと話す", nextScene: 42 }
          ]
        },
        {
          id: 28,
          character: "さくら",
          speaker: "さくら",
          dialogue: "あの...一緒にお昼食べませんか？❤ 屋上が気持ちいいんです❤❤",
          nextScene: 29
        },
        {
          id: 29,
          speaker: "ナレーター",
          dialogue: "屋上での昼食。桜の花びらが舞い散る美しい景色の中で、さくらとの距離が縮まっていく。",
          nextScene: 30
        },
        {
          id: 30,
          character: "さくら",
          speaker: "さくら",
          dialogue: "この景色、とても綺麗でしょう？❤ でも...あなたと一緒だともっと綺麗に見えます❤❤",
          choices: [
            { id: 1, text: "君の方が綺麗だよ", nextScene: 31, affectionChanges: { "さくら": 6 } },
            { id: 2, text: "確かに美しいね", nextScene: 32, affectionChanges: { "さくら": 3 } },
            { id: 3, text: "君といると特別だ", nextScene: 33, affectionChanges: { "さくら": 5 } }
          ]
        },
        {
          id: 31,
          character: "さくら",
          speaker: "さくら",
          dialogue: "そ、そんな...❤❤❤ 恥ずかしいです...でも、とても嬉しい❤ あなたにそう言ってもらえるなんて❤",
          nextScene: 34
        },
        {
          id: 32,
          character: "さくら",
          speaker: "さくら",
          dialogue: "ですよね❤ でも、あなたがいてくれるから、いつもより特別に見えるんです❤❤",
          nextScene: 34
        },
        {
          id: 33,
          character: "さくら",
          speaker: "さくら",
          dialogue: "私も...あなたといると、世界が違って見えます❤❤ こんな気持ち、初めてです❤",
          nextScene: 34
        },
        {
          id: 34,
          speaker: "ナレーター",
          dialogue: "午後の授業も終わり、放課後の時間がやってきた。さくらとの距離はさらに縮まったようだ。",
          nextScene: 49
        },
        {
          id: 35,
          character: "みお",
          speaker: "みお",
          dialogue: "図書室は静かで落ち着きますね❤ あなたはどんな本がお好きですか？❤❤",
          nextScene: 36
        },
        {
          id: 36,
          speaker: "ナレーター",
          dialogue: "静かな図書室で、みおと二人きりの時間。本の話から、お互いの夢や将来について語り合う。",
          nextScene: 37
        },
        {
          id: 37,
          character: "みお",
          speaker: "みお",
          dialogue: "あなたと話していると、時間を忘れてしまいます❤ もっとあなたのことを知りたいです❤❤",
          choices: [
            { id: 1, text: "僕も君をもっと知りたい", nextScene: 38, affectionChanges: { "みお": 6 } },
            { id: 2, text: "一緒にいると楽しい", nextScene: 39, affectionChanges: { "みお": 4 } },
            { id: 3, text: "今度ゆっくり話そう", nextScene: 40, affectionChanges: { "みお": 3 } }
          ]
        },
        {
          id: 38,
          character: "みお",
          speaker: "みお",
          dialogue: "本当ですか？❤❤❤ 嬉しい...あなたと過ごす時間が、私の一番の宝物になりそうです❤",
          nextScene: 41
        },
        {
          id: 39,
          character: "みお",
          speaker: "みお",
          dialogue: "私も❤❤ あなたといると、心が軽やかになります。こんな感じは初めてです❤",
          nextScene: 41
        },
        {
          id: 40,
          character: "みお",
          speaker: "みお",
          dialogue: "はい❤ 約束ですよ❤❤ 楽しみにしています❤",
          nextScene: 41
        },
        {
          id: 41,
          speaker: "ナレーター",
          dialogue: "みおとの図書室での時間は、お互いの心の距離を大きく縮めた。",
          nextScene: 49
        },
        {
          id: 42,
          character: "かえで",
          speaker: "かえで",
          dialogue: "生徒会室へようこそ❤ いつもは一人で作業していることが多いので、あなたがいてくれると嬉しいです❤❤",
          nextScene: 43
        },
        {
          id: 43,
          speaker: "ナレーター",
          dialogue: "生徒会室で、かえでの真面目で責任感の強い一面を見ることができた。",
          nextScene: 44
        },
        {
          id: 44,
          character: "かえで",
          speaker: "かえで",
          dialogue: "いつもみんなのことを考えていると、時々疲れることもあります❤ でも、あなたと話していると元気が出ます❤❤",
          choices: [
            { id: 1, text: "頼りにしてるよ", nextScene: 45, affectionChanges: { "かえで": 5 } },
            { id: 2, text: "無理しないで", nextScene: 46, affectionChanges: { "かえで": 4 } },
            { id: 3, text: "君は素晴らしいよ", nextScene: 47, affectionChanges: { "かえで": 6 } }
          ]
        },
        {
          id: 45,
          character: "かえで",
          speaker: "かえで",
          dialogue: "ありがとうございます❤❤ あなたにそう言ってもらえると、もっと頑張れます❤",
          nextScene: 48
        },
        {
          id: 46,
          character: "かえで",
          speaker: "かえで",
          dialogue: "優しいんですね❤❤ あなたがいてくれるだけで、心が軽くなります❤",
          nextScene: 48
        },
        {
          id: 47,
          character: "かえで",
          speaker: "かえde",
          dialogue: "そんな...❤❤❤ あなたにそう言ってもらえるなんて、夢みたいです❤",
          nextScene: 48
        },
        {
          id: 48,
          speaker: "ナレーター",
          dialogue: "かえでとの時間は、彼女の本当の姿を知る貴重な機会となった。",
          nextScene: 49
        },
        {
          id: 49,
          speaker: "ナレーター",
          dialogue: "放課後、教室で偶然あいちゃんと二人きりになった。",
          nextScene: 50
        },
        {
          id: 50,
          character: "あい",
          speaker: "あい",
          dialogue: "あら、まだ残っていたのね❤ 私も忘れ物を取りに来たの❤❤ 運命的な出会いね❤",
          choices: [
            { id: 1, text: "確かに運命かもね", nextScene: 51, affectionChanges: { "あい": 5 } },
            { id: 2, text: "偶然だね", nextScene: 52, affectionChanges: { "あい": 2 } },
            { id: 3, text: "嬉しい偶然だ", nextScene: 53, affectionChanges: { "あい": 4 } }
          ]
        },
        {
          id: 51,
          character: "あい",
          speaker: "あい",
          dialogue: "そうよね❤❤❤ きっと運命が私たちを引き寄せたのよ❤ あなたと出会えて本当に良かった❤",
          nextScene: 54
        },
        {
          id: 52,
          character: "あい",
          speaker: "あい",
          dialogue: "でも、素敵な偶然よね❤❤ あなたとこうして話せるなんて❤",
          nextScene: 54
        },
        {
          id: 53,
          character: "あい",
          speaker: "あい",
          dialogue: "私も❤❤ あなたと二人きりになれて、ドキドキしちゃう❤",
          nextScene: 54
        },
        {
          id: 54,
          speaker: "ナレーター",
          dialogue: "夕日が差し込む教室で、あいとの特別な時間を過ごした。",
          nextScene: 55
        },
        {
          id: 55,
          character: "ゆい",
          speaker: "ゆい",
          dialogue: "あ、二人とも発見❤ 私も混ぜて❤❤ みんなで帰りませんか？❤",
          nextScene: 56
        },
        {
          id: 56,
          speaker: "ナレーター",
          dialogue: "こうして、新しいクラスメイトたちとの絆が深まった最初の一日が終わった。明日からの学校生活がさらに楽しみになった。",
          nextScene: -1
        }
      ]
    },
    {
      id: 2,
      title: "放課後の約束",
      description: "放課後、クラスメイトたちとの距離が縮まる特別な時間を過ごします。",
      estimatedTime: 90,
      isUnlocked: false,
      isCompleted: false,
      characters: ["みお", "かえで", "ちさと", "はるか", "まり", "りん", "みれい"],
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
          dialogue: "放課後の校舎で新たな出会いが待っていた。音楽室から美しいメロディーが聞こえてくる。",
          nextScene: 24
        },
        {
          id: 24,
          character: "はるか",
          speaker: "はるか",
          dialogue: "あ、誰かいるのかな？❤ 私、バンドのボーカルのはるかです❤❤ あなたも音楽は好きですか？",
          choices: [
            { id: 1, text: "歌声が美しいね", nextScene: 25, affectionChanges: { "はるか": 6 } },
            { id: 2, text: "音楽は大好きだよ", nextScene: 26, affectionChanges: { "はるか": 4 } },
            { id: 3, text: "バンド活動してるの？", nextScene: 27, affectionChanges: { "はるか": 3 } }
          ]
        },
        {
          id: 25,
          character: "はるか",
          speaker: "はるか",
          dialogue: "本当ですか？❤❤❤ そんなこと言ってもらえると、もっと歌いたくなっちゃいます❤ あなたのために特別な歌を歌いますね❤",
          nextScene: 28
        },
        {
          id: 26,
          character: "はるか",
          speaker: "はるか",
          dialogue: "嬉しい❤❤ 今度一緒にライブを見に行きませんか？私たちの演奏も聞いてほしいです❤",
          nextScene: 28
        },
        {
          id: 27,
          character: "はるか",
          speaker: "はるか",
          dialogue: "はい❤ 4人組のバンドでボーカルをしています❤❤ みんなとても仲良しなんですよ❤",
          nextScene: 28
        },
        {
          id: 28,
          character: "まり",
          speaker: "まり",
          dialogue: "はるかちゃん、誰かお友達？❤ 私はドラムのまりです❤❤ リズムに合わせて体を動かすのが大好き❤",
          choices: [
            { id: 1, text: "ドラム、かっこいいね", nextScene: 29, affectionChanges: { "まり": 5 } },
            { id: 2, text: "リズム感良さそう", nextScene: 30, affectionChanges: { "まり": 4 } },
            { id: 3, text: "みんな仲良しなんだね", nextScene: 31, affectionChanges: { "まり": 3 } }
          ]
        },
        {
          id: 29,
          character: "まり",
          speaker: "まり",
          dialogue: "ありがとう❤❤ ドラムを叩いてる時の私、本当にかっこいいでしょ？❤ 今度演奏を見せてあげる❤",
          nextScene: 32
        },
        {
          id: 30,
          character: "まり",
          speaker: "まり",
          dialogue: "えへへ❤ 子供の頃からダンスをやってたから❤❤ あなたも一緒に踊りませんか？❤",
          nextScene: 32
        },
        {
          id: 31,
          character: "まり",
          speaker: "まり",
          dialogue: "そうなの❤ みんな個性的で面白いメンバーなの❤❤ あなたも仲間に入らない？❤",
          nextScene: 32
        },
        {
          id: 32,
          character: "りん",
          speaker: "りん",
          dialogue: "ベースのりんです❤ 低音で皆を支えるのが私の役目❤❤ あなたの心も支えたいな❤",
          choices: [
            { id: 1, text: "頼りになりそう", nextScene: 33, affectionChanges: { "りん": 5 } },
            { id: 2, text: "ベース、渋いね", nextScene: 34, affectionChanges: { "りん": 4 } },
            { id: 3, text: "優しそうだね", nextScene: 35, affectionChanges: { "りん": 6 } }
          ]
        },
        {
          id: 33,
          character: "りん",
          speaker: "りん",
          dialogue: "そう言ってもらえると嬉しい❤❤ あなたが困った時は、いつでも私に頼って❤",
          nextScene: 36
        },
        {
          id: 34,
          character: "りん",
          speaker: "りん",
          dialogue: "でしょ？❤ 派手じゃないけど、とても大切なパートなの❤❤ あなたの人生のベースにもなりたい❤",
          nextScene: 36
        },
        {
          id: 35,
          character: "りん",
          speaker: "りん",
          dialogue: "ありがとう❤❤❤ あなたにそう言ってもらえると、心が温かくなります❤",
          nextScene: 36
        },
        {
          id: 36,
          character: "みれい",
          speaker: "みれい",
          dialogue: "最後に私、キーボードのみれいです❤ メロディーを美しく彩るのが得意❤❤ あなたの心も美しく彩りたいです❤",
          choices: [
            { id: 1, text: "君の音色を聞きたい", nextScene: 37, affectionChanges: { "みれい": 6 } },
            { id: 2, text: "キーボード上手そう", nextScene: 38, affectionChanges: { "みれい": 4 } },
            { id: 3, text: "みんな素敵だね", nextScene: 39, affectionChanges: { "みれい": 3 } }
          ]
        },
        {
          id: 37,
          character: "みれい",
          speaker: "みれい",
          dialogue: "本当ですか？❤❤❤ あなたのために特別な曲を作ります❤ 私の気持ちを込めて❤",
          nextScene: 40
        },
        {
          id: 38,
          character: "みれい",
          speaker: "みれい",
          dialogue: "ありがとうございます❤❤ 小さい頃からピアノを習っていたの❤ あなたと連弾してみたいです❤",
          nextScene: 40
        },
        {
          id: 39,
          character: "みれい",
          speaker: "みれい",
          dialogue: "嬉しい❤ でも、あなたが一番素敵です❤❤ 私たちの音楽を聞いてくれますか？❤",
          nextScene: 40
        },
        {
          id: 40,
          speaker: "ナレーター",
          dialogue: "バンドメンバーたちとの出会いで、放課後の時間がより特別なものになった。",
          choices: [
            { id: 1, text: "図書室でみおと勉強", nextScene: 41 },
            { id: 2, text: "生徒会室でかえでを手伝う", nextScene: 55 },
            { id: 3, text: "音楽室でちさとのピアノを聞く", nextScene: 69 }
          ]
        },
        {
          id: 41,
          character: "みお",
          speaker: "みお",
          dialogue: "あ、来てくれたんですね❤ 一緒に勉強しませんか？❤❤ 数学の問題で分からないところがあるんです❤",
          nextScene: 42
        },
        {
          id: 42,
          speaker: "ナレーター",
          dialogue: "静かな図書室で、みおと並んで座り勉強をする。時々見せる困った表情が可愛らしい。",
          nextScene: 43
        },
        {
          id: 43,
          character: "みお",
          speaker: "みお",
          dialogue: "この問題、難しくて...❤ あなたはどう思いますか？❤❤ 一緒に考えてもらえると嬉しいです❤",
          choices: [
            { id: 1, text: "一緒に解いてみよう", nextScene: 44, affectionChanges: { "みお": 6 } },
            { id: 2, text: "君なら解けるよ", nextScene: 45, affectionChanges: { "みお": 4 } },
            { id: 3, text: "分からない時は聞いて", nextScene: 46, affectionChanges: { "みお": 5 } }
          ]
        },
        {
          id: 44,
          character: "みお",
          speaker: "みお",
          dialogue: "本当ですか？❤❤❤ あなたと一緒なら、どんな難しい問題も解けそうです❤ ありがとう❤",
          nextScene: 47
        },
        {
          id: 45,
          character: "みお",
          speaker: "みお",
          dialogue: "そう言ってもらえると自信が出ます❤❤ あなたが信じてくれるなら、頑張れます❤",
          nextScene: 47
        },
        {
          id: 46,
          character: "みお",
          speaker: "みお",
          dialogue: "優しいですね❤❤ あなたがいてくれると、勉強も楽しくなります❤",
          nextScene: 47
        },
        {
          id: 47,
          speaker: "ナレーター",
          dialogue: "勉強の合間に、みおの将来の夢や読書の趣味について深く話し合った。",
          nextScene: 48
        },
        {
          id: 48,
          character: "みお",
          speaker: "みお",
          dialogue: "将来は図書館司書になりたいんです❤ 本を通じてたくさんの人を幸せにしたい❤❤ あなたの夢も聞かせて❤",
          choices: [
            { id: 1, text: "素敵な夢だね", nextScene: 49, affectionChanges: { "みお": 5 } },
            { id: 2, text: "本を愛する君らしい", nextScene: 50, affectionChanges: { "みお": 6 } },
            { id: 3, text: "応援するよ", nextScene: 51, affectionChanges: { "みお": 4 } }
          ]
        },
        {
          id: 49,
          character: "みお",
          speaker: "みお",
          dialogue: "ありがとうございます❤❤ あなたにそう言ってもらえると、もっと頑張れます❤",
          nextScene: 52
        },
        {
          id: 50,
          character: "みお",
          speaker: "みお",
          dialogue: "分かってもらえて嬉しい❤❤❤ あなたと一緒なら、どんな夢も叶えられそうです❤",
          nextScene: 52
        },
        {
          id: 51,
          character: "みお",
          speaker: "みお",
          dialogue: "あなたが応援してくれるなら、絶対に夢を叶えます❤❤ ありがとう❤",
          nextScene: 52
        },
        {
          id: 52,
          speaker: "ナレーター",
          dialogue: "図書室での静かな時間は、みおとの絆を深める貴重な時間となった。",
          nextScene: 53
        },
        {
          id: 53,
          character: "みお",
          speaker: "みお",
          dialogue: "今度の休日、一緒に大きな図書館に行きませんか？❤ 私のお気に入りの場所を案内します❤❤",
          choices: [
            { id: 1, text: "ぜひ行きたい", nextScene: 54, affectionChanges: { "みお": 7 } },
            { id: 2, text: "楽しみだね", nextScene: 54, affectionChanges: { "みお": 5 } },
            { id: 3, text: "君と一緒なら", nextScene: 54, affectionChanges: { "みお": 6 } }
          ]
        },
        {
          id: 54,
          character: "みお",
          speaker: "みお",
          dialogue: "約束ですね❤❤❤ とても楽しみです❤ あなたと過ごす時間が一番幸せです❤",
          nextScene: 83
        },
        {
          id: 55,
          character: "かえで",
          speaker: "かえで",
          dialogue: "来てくれたんですね❤ 生徒会の資料整理を手伝ってもらえますか？❤❤ 一人だと大変で...❤",
          nextScene: 56
        },
        {
          id: 56,
          speaker: "ナレーター",
          dialogue: "生徒会室で、かえでと一緒に書類を整理する。彼女の真面目で責任感の強い姿が印象的だ。",
          nextScene: 57
        },
        {
          id: 57,
          character: "かえで",
          speaker: "かえで",
          dialogue: "いつもこんなに遅くまで残って作業してるんです❤ でも、あなたがいてくれると心強いです❤❤",
          choices: [
            { id: 1, text: "無理しすぎないで", nextScene: 58, affectionChanges: { "かえで": 6 } },
            { id: 2, text: "頑張り屋さんだね", nextScene: 59, affectionChanges: { "かえで": 4 } },
            { id: 3, text: "いつでも手伝うよ", nextScene: 60, affectionChanges: { "かえで": 7 } }
          ]
        },
        {
          id: 58,
          character: "かえで",
          speaker: "かえで",
          dialogue: "心配してくれてありがとう❤❤ あなたがいてくれるから、頑張れるんです❤",
          nextScene: 61
        },
        {
          id: 59,
          character: "かえで",
          speaker: "かえで",
          dialogue: "みんなのために頑張るのが私の役目ですから❤❤ でも、あなたのことを考えると力が湧きます❤",
          nextScene: 61
        },
        {
          id: 60,
          character: "かえで",
          speaker: "かえで",
          dialogue: "本当ですか？❤❤❤ あなたがそう言ってくれると、どんなに忙しくても乗り越えられます❤",
          nextScene: 61
        },
        {
          id: 61,
          speaker: "ナレーター",
          dialogue: "作業の合間に、かえでの生徒会での苦労や、リーダーとしての責任について話を聞いた。",
          nextScene: 62
        },
        {
          id: 62,
          character: "かえで",
          speaker: "かえで",
          dialogue: "時々、みんなの期待に応えられるか不安になります❤ でも、あなたと話していると自信が持てます❤❤",
          choices: [
            { id: 1, text: "君なら大丈夫", nextScene: 63, affectionChanges: { "かえで": 6 } },
            { id: 2, text: "みんな信頼してる", nextScene: 64, affectionChanges: { "かえで": 5 } },
            { id: 3, text: "僕も支えるから", nextScene: 65, affectionChanges: { "かえで": 8 } }
          ]
        },
        {
          id: 63,
          character: "かえで",
          speaker: "かえで",
          dialogue: "あなたにそう言ってもらえると、本当に心強いです❤❤ ありがとう❤",
          nextScene: 66
        },
        {
          id: 64,
          character: "かえで",
          speaker: "かえで",
          dialogue: "そうですね❤ みんなの信頼に応えられるよう、もっと頑張ります❤❤",
          nextScene: 66
        },
        {
          id: 65,
          character: "かえで",
          speaker: "かえで",
          dialogue: "あなたが支えてくれるなら、どんな困難も乗り越えられます❤❤❤ 本当にありがとう❤",
          nextScene: 66
        },
        {
          id: 66,
          speaker: "ナレーター",
          dialogue: "生徒会室での時間は、かえでの本当の気持ちを知る貴重な機会となった。",
          nextScene: 67
        },
        {
          id: 67,
          character: "かえで",
          speaker: "かえで",
          dialogue: "今度の学園祭、私の企画した催し物を見に来てもらえますか？❤ あなたに見てもらいたいんです❤❤",
          choices: [
            { id: 1, text: "絶対に見に行く", nextScene: 68, affectionChanges: { "かえで": 7 } },
            { id: 2, text: "楽しみにしてる", nextScene: 68, affectionChanges: { "かえで": 5 } },
            { id: 3, text: "君の頑張りを見たい", nextScene: 68, affectionChanges: { "かえで": 6 } }
          ]
        },
        {
          id: 68,
          character: "かえで",
          speaker: "かえで",
          dialogue: "約束ですよ❤❤❤ あなたのために特別に頑張ります❤ 期待していてくださいね❤",
          nextScene: 83
        },
        {
          id: 69,
          character: "ちさと",
          speaker: "ちさと",
          dialogue: "あら、来てくれたんですね❤ ちょうどピアノを練習していたところです❤❤ 聞いてもらえますか？❤",
          nextScene: 70
        },
        {
          id: 70,
          speaker: "ナレーター",
          dialogue: "音楽室に美しいピアノの音色が響く。ちさとの優雅な演奏に心を奪われる。",
          nextScene: 71
        },
        {
          id: 71,
          character: "ちさと",
          speaker: "ちさと",
          dialogue: "どうでしたか？❤ あなたに聞いてもらえて、いつもより上手く弾けた気がします❤❤",
          choices: [
            { id: 1, text: "とても美しかった", nextScene: 72, affectionChanges: { "ちさと": 7 } },
            { id: 2, text: "感動した", nextScene: 73, affectionChanges: { "ちさと": 6 } },
            { id: 3, text: "君の演奏が好き", nextScene: 74, affectionChanges: { "ちさと": 8 } }
          ]
        },
        {
          id: 72,
          character: "ちさと",
          speaker: "ちさと",
          dialogue: "ありがとうございます❤❤ あなたのためにもっと美しい曲を演奏したいです❤",
          nextScene: 75
        },
        {
          id: 73,
          character: "ちさと",
          speaker: "ちさと",
          dialogue: "そう言ってもらえると嬉しい❤❤ 音楽で人の心を動かせるなんて幸せです❤",
          nextScene: 75
        },
        {
          id: 74,
          character: "ちさと",
          speaker: "ちさと",
          dialogue: "あなたがそう言ってくれると、もっともっと練習したくなります❤❤❤ あなたのための特別な曲を作りたい❤",
          nextScene: 75
        },
        {
          id: 75,
          speaker: "ナレーター",
          dialogue: "ちさとの音楽への情熱と、繊細な心について深く話し合った。",
          nextScene: 76
        },
        {
          id: 76,
          character: "ちさと",
          speaker: "ちさと",
          dialogue: "音楽は私の人生そのものです❤ そして今、あなたも私の人生の大切な一部になりました❤❤",
          choices: [
            { id: 1, text: "僕にとっても君は特別", nextScene: 77, affectionChanges: { "ちさと": 8 } },
            { id: 2, text: "音楽を通じて知り合えて良かった", nextScene: 78, affectionChanges: { "ちさと": 6 } },
            { id: 3, text: "君の音楽に癒される", nextScene: 79, affectionChanges: { "ちさと": 7 } }
          ]
        },
        {
          id: 77,
          character: "ちさと",
          speaker: "ちさと",
          dialogue: "本当ですか？❤❤❤ あなたにとって特別な存在になれるなんて、夢みたいです❤",
          nextScene: 80
        },
        {
          id: 78,
          character: "ちさと",
          speaker: "ちさと",
          dialogue: "私も❤❤ 音楽が運んでくれた素敵な出会いに感謝しています❤",
          nextScene: 80
        },
        {
          id: 79,
          character: "ちさと",
          speaker: "ちさと",
          dialogue: "あなたが癒されるなら、もっともっと演奏したいです❤❤ あなたのための音楽を奏でたい❤",
          nextScene: 80
        },
        {
          id: 80,
          speaker: "ナレーター",
          dialogue: "音楽室での時間は、ちさととの心の距離を大きく縮めた。",
          nextScene: 81
        },
        {
          id: 81,
          character: "ちさと",
          speaker: "ちさと",
          dialogue: "今度のコンサートに一緒に行きませんか？❤ あなたと音楽を共有したいんです❤❤",
          choices: [
            { id: 1, text: "ぜひ一緒に行こう", nextScene: 82, affectionChanges: { "ちさと": 7 } },
            { id: 2, text: "楽しみだね", nextScene: 82, affectionChanges: { "ちさと": 5 } },
            { id: 3, text: "君と一緒なら最高", nextScene: 82, affectionChanges: { "ちさと": 8 } }
          ]
        },
        {
          id: 82,
          character: "ちさと",
          speaker: "ちさと",
          dialogue: "約束ですね❤❤❤ あなたと過ごす特別な夜を楽しみにしています❤",
          nextScene: 83
        },
        {
          id: 83,
          speaker: "ナレーター",
          dialogue: "充実した放課後の時間が終わろうとしている。クラスメイトたちとの絆はさらに深まった。",
          nextScene: -1
        }
      ]
    },
    {
      id: 3,
      title: "学園祭準備",
      description: "学園祭の準備を通じて、クラスメイトたちとの協力と友情を深めます。",
      estimatedTime: 120,
      isUnlocked: false,
      isCompleted: false,
      characters: ["はるか", "まり", "りん", "みれい", "なな", "りさ", "あおい", "まゆ"],
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
          dialogue: "学園祭の準備が本格的に始まった。各クラブが装飾や出し物の準備に追われている。",
          nextScene: 36
        },
        {
          id: 36,
          character: "なな",
          speaker: "なな",
          dialogue: "あ、お疲れ様です❤ 私は文化委員のななです❤❤ 装飾の手伝いをしてもらえませんか？❤",
          choices: [
            { id: 1, text: "喜んで手伝うよ", nextScene: 37, affectionChanges: { "なな": 6 } },
            { id: 2, text: "どんなことをするの？", nextScene: 38, affectionChanges: { "なな": 3 } },
            { id: 3, text: "君と一緒なら", nextScene: 39, affectionChanges: { "なな": 5 } }
          ]
        },
        {
          id: 37,
          character: "なな",
          speaker: "なな",
          dialogue: "本当ですか？❤❤❤ 嬉しい！あなたと一緒なら、きっと素敵な装飾ができますね❤",
          nextScene: 40
        },
        {
          id: 38,
          character: "なな",
          speaker: "なな",
          dialogue: "教室の装飾や看板作りです❤ 細かい作業ですが、やりがいがありますよ❤❤",
          nextScene: 40
        },
        {
          id: 39,
          character: "なな",
          speaker: "なな",
          dialogue: "そんな...恥ずかしいです❤❤ でも、あなたと一緒だと作業も楽しくなりそう❤",
          nextScene: 40
        },
        {
          id: 40,
          speaker: "ナレーター",
          dialogue: "ななと一緒に装飾作業をしていると、他の委員メンバーも集まってきた。",
          nextScene: 41
        },
        {
          id: 41,
          character: "りさ",
          speaker: "りさ",
          dialogue: "あら、新しい助っ人さん？❤ 私は料理部のりさです❤❤ 模擬店の準備も大変なんですよ❤",
          choices: [
            { id: 1, text: "料理も手伝いたい", nextScene: 42, affectionChanges: { "りさ": 5 } },
            { id: 2, text: "何を作るの？", nextScene: 43, affectionChanges: { "りさ": 3 } },
            { id: 3, text: "君の料理食べてみたい", nextScene: 44, affectionChanges: { "りさ": 6 } }
          ]
        },
        {
          id: 42,
          character: "りさ",
          speaker: "りさ",
          dialogue: "本当？❤❤ 嬉しいわ！一緒にお料理しましょう❤ あなたのために特別なメニューを作ってあげる❤",
          nextScene: 45
        },
        {
          id: 43,
          character: "りさ",
          speaker: "りさ",
          dialogue: "クレープとたこ焼きを予定しています❤ どちらも自信作なんですよ❤❤",
          nextScene: 45
        },
        {
          id: 44,
          character: "りさ",
          speaker: "りさ",
          dialogue: "そう言ってもらえると作り甲斐があります❤❤❤ あなたの笑顔のために腕を振るいますね❤",
          nextScene: 45
        },
        {
          id: 45,
          character: "あおい",
          speaker: "あおい",
          dialogue: "みなさん、お疲れ様です❤ 私は演劇部のあおいです❤❤ 舞台の準備も手伝ってもらえますか？❤",
          choices: [
            { id: 1, text: "演劇も興味ある", nextScene: 46, affectionChanges: { "あおい": 5 } },
            { id: 2, text: "どんな劇をするの？", nextScene: 47, affectionChanges: { "あおい": 4 } },
            { id: 3, text: "君の演技見てみたい", nextScene: 48, affectionChanges: { "あおい": 6 } }
          ]
        },
        {
          id: 46,
          character: "あおい",
          speaker: "あおい",
          dialogue: "本当ですか？❤❤ 嬉しいです！今度一緒に演技の練習をしませんか？❤",
          nextScene: 49
        },
        {
          id: 47,
          character: "あおい",
          speaker: "あおい",
          dialogue: "ロミオとジュリエットです❤ 私はジュリエット役なんです❤❤ 緊張しますが頑張ります❤",
          nextScene: 49
        },
        {
          id: 48,
          character: "あおい",
          speaker: "あおい",
          dialogue: "ありがとうございます❤❤❤ あなたに見てもらえるなら、きっと良い演技ができます❤",
          nextScene: 49
        },
        {
          id: 49,
          character: "まゆ",
          speaker: "まゆ",
          dialogue: "お疲れ様です❤ 写真部のまゆです❤❤ 学園祭の記録係をしているんです❤ あなたの写真も撮らせてください❤",
          choices: [
            { id: 1, text: "いいよ、撮って", nextScene: 50, affectionChanges: { "まゆ": 4 } },
            { id: 2, text: "恥ずかしいな", nextScene: 51, affectionChanges: { "まゆ": 5 } },
            { id: 3, text: "君も一緒に撮ろう", nextScene: 52, affectionChanges: { "まゆ": 7 } }
          ]
        },
        {
          id: 50,
          character: "まゆ",
          speaker: "まゆ",
          dialogue: "ありがとうございます❤❤ 素敵な写真を撮らせていただきますね❤",
          nextScene: 53
        },
        {
          id: 51,
          character: "まゆ",
          speaker: "まゆ",
          dialogue: "大丈夫ですよ❤ 自然な表情が一番美しいんです❤❤ リラックスして❤",
          nextScene: 53
        },
        {
          id: 52,
          character: "まゆ",
          speaker: "まゆ",
          dialogue: "え？私も？❤❤❤ 嬉しいです！二人で素敵な思い出を作りましょう❤",
          nextScene: 53
        },
        {
          id: 53,
          speaker: "ナレーター",
          dialogue: "学園祭の準備は順調に進んでいく。みんなで協力する中で、新たな絆が生まれていた。",
          choices: [
            { id: 1, text: "バンドの練習を見る", nextScene: 54 },
            { id: 2, text: "料理の準備を手伝う", nextScene: 70 },
            { id: 3, text: "演劇の練習に参加", nextScene: 86 },
            { id: 4, text: "装飾作業を続ける", nextScene: 102 }
          ]
        },
        {
          id: 54,
          speaker: "ナレーター",
          dialogue: "音楽室では、バンドメンバーたちが熱心に練習に取り組んでいた。",
          nextScene: 55
        },
        {
          id: 55,
          character: "はるか",
          speaker: "はるか",
          dialogue: "あ、来てくれたんですね❤ 練習を見てもらえると嬉しいです❤❤ 私たちの演奏、どうですか？❤",
          choices: [
            { id: 1, text: "とても素晴らしい", nextScene: 56, affectionChanges: { "はるか": 6 } },
            { id: 2, text: "もっと聞きたい", nextScene: 57, affectionChanges: { "はるか": 5 } },
            { id: 3, text: "君の歌声が好き", nextScene: 58, affectionChanges: { "はるか": 7 } }
          ]
        },
        {
          id: 56,
          character: "はるか",
          speaker: "はるか",
          dialogue: "本当ですか？❤❤❤ あなたに褒めてもらえると、もっと頑張れます❤",
          nextScene: 59
        },
        {
          id: 57,
          character: "はるか",
          speaker: "はるか",
          dialogue: "ありがとう❤❤ あなたのために特別な曲も用意しているんです❤",
          nextScene: 59
        },
        {
          id: 58,
          character: "はるか",
          speaker: "はるか",
          dialogue: "そんな...❤❤❤ 嬉しくて歌詞を忘れちゃいそうです❤ あなたのためだけに歌いたい❤",
          nextScene: 59
        },
        {
          id: 59,
          character: "まり",
          speaker: "まり",
          dialogue: "私のドラムテクニックも見て❤ このリズム、体に響くでしょ？❤❤",
          choices: [
            { id: 1, text: "迫力があるね", nextScene: 60, affectionChanges: { "まり": 5 } },
            { id: 2, text: "リズムが心地いい", nextScene: 61, affectionChanges: { "まり": 4 } },
            { id: 3, text: "君のエネルギーが伝わる", nextScene: 62, affectionChanges: { "まり": 6 } }
          ]
        },
        {
          id: 60,
          character: "まり",
          speaker: "まり",
          dialogue: "でしょ？❤❤ このパワフルさが私の売りなの❤ あなたの心も揺さぶっちゃう❤",
          nextScene: 63
        },
        {
          id: 61,
          character: "まり",
          speaker: "まり",
          dialogue: "ありがとう❤ このリズムで、あなたの鼓動も合わせたいな❤❤",
          nextScene: 63
        },
        {
          id: 62,
          character: "まり",
          speaker: "まり",
          dialogue: "本当？❤❤❤ あなたに私の気持ちが伝わったなら嬉しい❤",
          nextScene: 63
        },
        {
          id: 63,
          character: "りん",
          speaker: "りん",
          dialogue: "ベースラインも聞いて❤ 地味だけど、とても大切なパートなの❤❤",
          choices: [
            { id: 1, text: "渋くてかっこいい", nextScene: 64, affectionChanges: { "りん": 6 } },
            { id: 2, text: "安定感がある", nextScene: 65, affectionChanges: { "りん": 5 } },
            { id: 3, text: "君らしい音だね", nextScene: 66, affectionChanges: { "りん": 7 } }
          ]
        },
        {
          id: 64,
          character: "りん",
          speaker: "りん",
          dialogue: "そう言ってもらえると嬉しい❤❤ あなたの人生も私が支えたいな❤",
          nextScene: 67
        },
        {
          id: 65,
          character: "りん",
          speaker: "りん",
          dialogue: "ありがとう❤ いつでもあなたの支えになりたい❤❤",
          nextScene: 67
        },
        {
          id: 66,
          character: "りん",
          speaker: "りん",
          dialogue: "私らしい...❤❤❤ あなたが私を理解してくれて嬉しい❤",
          nextScene: 67
        },
        {
          id: 67,
          character: "みれい",
          speaker: "みれい",
          dialogue: "私のキーボードも聞いてください❤ メロディーに色を添えるのが得意なんです❤❤",
          choices: [
            { id: 1, text: "美しいメロディー", nextScene: 68, affectionChanges: { "みれい": 6 } },
            { id: 2, text: "技術がすごい", nextScene: 68, affectionChanges: { "みれい": 5 } },
            { id: 3, text: "君の心が聞こえる", nextScene: 69, affectionChanges: { "みれい": 8 } }
          ]
        },
        {
          id: 68,
          character: "みれい",
          speaker: "みれい",
          dialogue: "ありがとうございます❤❤ あなたのために特別な曲を作りたくなりました❤",
          nextScene: 118
        },
        {
          id: 69,
          character: "みれい",
          speaker: "みれい",
          dialogue: "そんな...❤❤❤ あなたに私の気持ちが伝わるなんて、夢みたいです❤",
          nextScene: 118
        },
        {
          id: 70,
          speaker: "ナレーター",
          dialogue: "調理室では、りさが模擬店の準備に忙しく取り組んでいた。",
          nextScene: 71
        },
        {
          id: 71,
          character: "りさ",
          speaker: "りさ",
          dialogue: "あ、手伝いに来てくれたんですね❤ エプロンをどうぞ❤❤ 一緒にお料理しましょう❤",
          nextScene: 72
        },
        {
          id: 72,
          speaker: "ナレーター",
          dialogue: "りさと並んで料理をする。彼女の手際の良さと、料理への愛情を感じる。",
          nextScene: 73
        },
        {
          id: 73,
          character: "りさ",
          speaker: "りさ",
          dialogue: "お料理は愛情が一番大切なの❤ あなたと一緒だと、いつもより美味しく作れそう❤❤",
          choices: [
            { id: 1, text: "君の愛情を感じる", nextScene: 74, affectionChanges: { "りさ": 7 } },
            { id: 2, text: "とても美味しそう", nextScene: 75, affectionChanges: { "りさ": 5 } },
            { id: 3, text: "一緒に作ると楽しい", nextScene: 76, affectionChanges: { "りさ": 6 } }
          ]
        },
        {
          id: 74,
          character: "りさ",
          speaker: "りさ",
          dialogue: "本当ですか？❤❤❤ あなたにそう言ってもらえると、もっと愛情込めて作れます❤",
          nextScene: 77
        },
        {
          id: 75,
          character: "りさ",
          speaker: "りさ",
          dialogue: "ありがとう❤❤ 味見もしてもらえますか？あなたの感想が一番知りたいの❤",
          nextScene: 77
        },
        {
          id: 76,
          character: "りさ",
          speaker: "りさ",
          dialogue: "私も❤ あなたと一緒だと、お料理がもっと楽しくなります❤❤",
          nextScene: 77
        },
        {
          id: 77,
          speaker: "ナレーター",
          dialogue: "料理の合間に、りさの家族や将来の夢について話を聞いた。",
          nextScene: 78
        },
        {
          id: 78,
          character: "りさ",
          speaker: "りさ",
          dialogue: "将来はレストランを開きたいんです❤ みんなを笑顔にする料理を作りたい❤❤ あなたにも毎日作ってあげたいな❤",
          choices: [
            { id: 1, text: "素敵な夢だね", nextScene: 79, affectionChanges: { "りさ": 6 } },
            { id: 2, text: "きっと人気店になる", nextScene: 80, affectionChanges: { "りさ": 5 } },
            { id: 3, text: "僕が一番のお客さんに", nextScene: 81, affectionChanges: { "りさ": 8 } }
          ]
        },
        {
          id: 79,
          character: "りさ",
          speaker: "りさ",
          dialogue: "ありがとうございます❤❤ あなたに応援してもらえると頑張れます❤",
          nextScene: 82
        },
        {
          id: 80,
          character: "りさ",
          speaker: "りさ",
          dialogue: "そう言ってもらえると自信が持てます❤❤ あなたのためにも頑張ります❤",
          nextScene: 82
        },
        {
          id: 81,
          character: "りさ",
          speaker: "りさ",
          dialogue: "本当ですか？❤❤❤ あなたが毎日来てくれるお店にしたいです❤ 特別席を用意しておきますね❤",
          nextScene: 82
        },
        {
          id: 82,
          speaker: "ナレーター",
          dialogue: "りさとの料理時間は、お互いの心を温かくする特別な時間となった。",
          nextScene: 83
        },
        {
          id: 83,
          character: "りさ",
          speaker: "りさ",
          dialogue: "今度、私の家族のレストランに来ませんか？❤ 特別メニューでおもてなししますね❤❤",
          choices: [
            { id: 1, text: "ぜひ行かせてもらいたい", nextScene: 84, affectionChanges: { "りさ": 7 } },
            { id: 2, text: "楽しみにしてる", nextScene: 84, affectionChanges: { "りさ": 5 } },
            { id: 3, text: "君の手料理が食べたい", nextScene: 85, affectionChanges: { "りさ": 8 } }
          ]
        },
        {
          id: 84,
          character: "りさ",
          speaker: "りさ",
          dialogue: "約束ですね❤❤ とても楽しみです❤ あなたのために心を込めて作ります❤",
          nextScene: 118
        },
        {
          id: 85,
          character: "りさ",
          speaker: "りさ",
          dialogue: "そんな...❤❤❤ 嬉しくて涙が出そうです❤ あなたのためだけに作らせてください❤",
          nextScene: 118
        },
        {
          id: 86,
          speaker: "ナレーター",
          dialogue: "体育館では、演劇部のメンバーたちが舞台の練習をしていた。",
          nextScene: 87
        },
        {
          id: 87,
          character: "あおい",
          speaker: "あおい",
          dialogue: "練習を見に来てくれたんですね❤ 今、ジュリエットの有名なセリフを練習してるんです❤❤",
          nextScene: 88
        },
        {
          id: 88,
          speaker: "ナレーター",
          dialogue: "あおいの情熱的な演技に見入ってしまう。彼女の表現力の豊かさに驚かされる。",
          nextScene: 89
        },
        {
          id: 89,
          character: "あおい",
          speaker: "あおい",
          dialogue: "どうでしたか？❤ あなたに見てもらえると、いつもより気持ちが込められます❤❤",
          choices: [
            { id: 1, text: "感動的だった", nextScene: 90, affectionChanges: { "あおい": 7 } },
            { id: 2, text: "本物の女優みたい", nextScene: 91, affectionChanges: { "あおい": 6 } },
            { id: 3, text: "君の演技に引き込まれた", nextScene: 92, affectionChanges: { "あおい": 8 } }
          ]
        },
        {
          id: 90,
          character: "あおい",
          speaker: "あおい",
          dialogue: "本当ですか？❤❤❤ あなたを感動させることができて嬉しいです❤",
          nextScene: 93
        },
        {
          id: 91,
          character: "あおい",
          speaker: "あおい",
          dialogue: "そんな...❤❤ 将来は本当に女優になりたいんです❤ あなたが信じてくれると頑張れます❤",
          nextScene: 93
        },
        {
          id: 92,
          character: "あおい",
          speaker: "あおい",
          dialogue: "あなたが見てくれていると思うと、自然と演技に力が入ります❤❤❤ あなたのためだけに演じたい❤",
          nextScene: 93
        },
        {
          id: 93,
          speaker: "ナレーター",
          dialogue: "あおいと一緒に台本を読んだり、演技の練習を手伝ったりした。",
          nextScene: 94
        },
        {
          id: 94,
          character: "あおい",
          speaker: "あおい",
          dialogue: "あなたに相手役をお願いしたいです❤ ロミオ役、やってもらえませんか？❤❤",
          choices: [
            { id: 1, text: "喜んでやらせてもらう", nextScene: 95, affectionChanges: { "あおい": 8 } },
            { id: 2, text: "僕にできるかな", nextScene: 96, affectionChanges: { "あおい": 5 } },
            { id: 3, text: "君のジュリエットなら", nextScene: 97, affectionChanges: { "あおい": 9 } }
          ]
        },
        {
          id: 95,
          character: "あおい",
          speaker: "あおい",
          dialogue: "本当ですか？❤❤❤ あなたとなら、きっと素晴らしい舞台になります❤",
          nextScene: 98
        },
        {
          id: 96,
          character: "あおい",
          speaker: "あおい",
          dialogue: "大丈夫です❤ 私が教えますから❤❤ あなたとなら最高の演技ができそう❤",
          nextScene: 98
        },
        {
          id: 97,
          character: "あおい",
          speaker: "あおい",
          dialogue: "そんな...❤❤❤ あなたがロミオなら、本当に恋に落ちてしまいそうです❤",
          nextScene: 98
        },
        {
          id: 98,
          speaker: "ナレーター",
          dialogue: "あおいと一緒にロミオとジュリエットの名シーンを練習した。演技を通じて、お互いの距離が縮まっていく。",
          nextScene: 99
        },
        {
          id: 99,
          character: "あおい",
          speaker: "あおい",
          dialogue: "バルコニーのシーン、もう一度やりませんか？❤ 今度はもっと気持ちを込めて❤❤",
          choices: [
            { id: 1, text: "君のために全力で", nextScene: 100, affectionChanges: { "あおい": 8 } },
            { id: 2, text: "もちろん", nextScene: 100, affectionChanges: { "あおい": 6 } },
            { id: 3, text: "演技じゃなくて本当の気持ち", nextScene: 101, affectionChanges: { "あおい": 10 } }
          ]
        },
        {
          id: 100,
          character: "あおい",
          speaker: "あおい",
          dialogue: "ありがとう❤❤ あなたと演じると、台詞が自然に心から出てきます❤",
          nextScene: 118
        },
        {
          id: 101,
          character: "あおい",
          speaker: "あおい",
          dialogue: "え...❤❤❤ それって...本当ですか？❤ 私も...演技じゃない気持ちが込み上げてきます❤",
          nextScene: 118
        },
        {
          id: 102,
          speaker: "ナレーター",
          dialogue: "美術室では、ななが一人で黙々と装飾作業を続けていた。",
          nextScene: 103
        },
        {
          id: 103,
          character: "なな",
          speaker: "なな",
          dialogue: "あ、戻ってきてくれたんですね❤ 一人だと少し寂しかったんです❤❤",
          nextScene: 104
        },
        {
          id: 104,
          speaker: "ナレーター",
          dialogue: "ななと一緒に細かい装飾作業を続ける。彼女の丁寧で繊細な作業ぶりに感心する。",
          nextScene: 105
        },
        {
          id: 105,
          character: "なな",
          speaker: "なな",
          dialogue: "私、こういう細かい作業が好きなんです❤ あなたと一緒だと、もっと集中できます❤❤",
          choices: [
            { id: 1, text: "器用だね", nextScene: 106, affectionChanges: { "なな": 5 } },
            { id: 2, text: "とても丁寧だ", nextScene: 107, affectionChanges: { "なな": 6 } },
            { id: 3, text: "君の集中してる姿が好き", nextScene: 108, affectionChanges: { "なな": 8 } }
          ]
        },
        {
          id: 106,
          character: "なな",
          speaker: "なな",
          dialogue: "ありがとうございます❤❤ 昔から手作りが好きだったんです❤",
          nextScene: 109
        },
        {
          id: 107,
          character: "なな",
          speaker: "なな",
          dialogue: "細部まで気を配るのが大切だと思います❤❤ あなたも丁寧な方ですね❤",
          nextScene: 109
        },
        {
          id: 108,
          character: "なな",
          speaker: "なな",
          dialogue: "そんな...❤❤❤ 見られていると恥ずかしいですが、嬉しいです❤",
          nextScene: 109
        },
        {
          id: 109,
          speaker: "ナレーター",
          dialogue: "作業の合間に、ななの趣味や将来の夢について話を聞いた。",
          nextScene: 110
        },
        {
          id: 110,
          character: "なな",
          speaker: "なな",
          dialogue: "将来はインテリアデザイナーになりたいんです❤ 人の生活を美しく彩りたい❤❤ あなたのお部屋もデザインしてみたいです❤",
          choices: [
            { id: 1, text: "センスがいいもんね", nextScene: 111, affectionChanges: { "なな": 6 } },
            { id: 2, text: "ぜひお願いしたい", nextScene: 112, affectionChanges: { "なな": 8 } },
            { id: 3, text: "君らしい夢だ", nextScene: 113, affectionChanges: { "なな": 7 } }
          ]
        },
        {
          id: 111,
          character: "なな",
          speaker: "なな",
          dialogue: "そう言ってもらえると自信が持てます❤❤ あなたのために素敵な空間を作りたい❤",
          nextScene: 114
        },
        {
          id: 112,
          character: "なな",
          speaker: "なな",
          dialogue: "本当ですか？❤❤❤ 嬉しい！あなたの好みを聞いて、世界で一つだけの空間を作りますね❤",
          nextScene: 114
        },
        {
          id: 113,
          character: "なな",
          speaker: "なな",
          dialogue: "私らしい...❤❤ あなたが私のことを理解してくれて嬉しいです❤",
          nextScene: 114
        },
        {
          id: 114,
          speaker: "ナレーター",
          dialogue: "ななとの装飾作業は、お互いの価値観や美意識を共有する時間となった。",
          nextScene: 115
        },
        {
          id: 115,
          character: "なな",
          speaker: "なな",
          dialogue: "今度、一緒にインテリアショップを見に行きませんか？❤ あなたのセンスも知りたいんです❤❤",
          choices: [
            { id: 1, text: "ぜひ一緒に行こう", nextScene: 116, affectionChanges: { "なな": 7 } },
            { id: 2, text: "楽しそうだね", nextScene: 116, affectionChanges: { "なな": 5 } },
            { id: 3, text: "君と選ぶインテリア", nextScene: 117, affectionChanges: { "なな": 8 } }
          ]
        },
        {
          id: 116,
          character: "なな",
          speaker: "なな",
          dialogue: "約束ですね❤❤ とても楽しみです❤ あなたと過ごす時間が一番美しい時間です❤",
          nextScene: 118
        },
        {
          id: 117,
          character: "なな",
          speaker: "なな",
          dialogue: "そんな...❤❤❤ あなたと一緒に選んだものなら、きっと特別な思い出になりますね❤",
          nextScene: 118
        },
        {
          id: 118,
          speaker: "ナレーター",
          dialogue: "学園祭の準備を通じて、クラスメイトたちとの絆はさらに深まった。明日はいよいよ学園祭当日だ。",
          nextScene: -1
        }
      ]
    },
    {
      id: 4,
      title: "夏の思い出",
      description: "夏休みの特別なイベントで、より深い関係を築いていきます。",
      estimatedTime: 150,
      isUnlocked: false,
      isCompleted: false,
      characters: ["なな", "りさ", "あおい", "まゆ", "さき", "のぞみ", "あかり", "ひより"],
      scenes: [
        {
          id: 36,
          speaker: "ナレーター",
          dialogue: "夏休みが始まった。クラスメイトたちとの特別な時間を過ごす機会がやってきた。",
          nextScene: 37
        },
        // 夏の思い出シーンを大幅拡張...
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
          speaker: "ナレーター",
          dialogue: "夏祭りの準備が始まった。町の雰囲気も華やかになり、浴衣を着た人々が街を歩いている。",
          nextScene: 42
        },
        {
          id: 42,
          character: "りさ",
          speaker: "りさ",
          dialogue: "あら、夏祭りの話？私も行くつもりなの❤ 屋台のお手伝いもするのよ❤❤",
          choices: [
            { id: 1, text: "屋台も手伝いたい", nextScene: 43, affectionChanges: { "りさ": 6 } },
            { id: 2, text: "何の屋台？", nextScene: 44, affectionChanges: { "りさ": 3 } },
            { id: 3, text: "みんなで楽しもう", nextScene: 45, affectionChanges: { "りさ": 4 } }
          ]
        },
        {
          id: 43,
          character: "りさ",
          speaker: "りさ",
          dialogue: "本当？❤❤❤ たこ焼き屋台なの！一緒に作りましょう❤ あなたに美味しいたこ焼きを食べてもらいたい❤",
          nextScene: 46
        },
        {
          id: 44,
          character: "りさ",
          speaker: "りさ",
          dialogue: "たこ焼き屋台です❤ 家族のお店のノウハウを活かして頑張るの❤❤",
          nextScene: 46
        },
        {
          id: 45,
          character: "りさ",
          speaker: "りさ",
          dialogue: "そうね❤ みんなで協力して最高の夏祭りにしましょう❤❤",
          nextScene: 46
        },
        {
          id: 46,
          character: "あおい",
          speaker: "あおい",
          dialogue: "演劇部も夏祭りで短い劇を披露するんです❤ 浴衣で演技するのは初めてで緊張します❤❤",
          choices: [
            { id: 1, text: "きっと素敵な劇になる", nextScene: 47, affectionChanges: { "あおい": 5 } },
            { id: 2, text: "浴衣姿での演技、見たい", nextScene: 48, affectionChanges: { "あおい": 6 } },
            { id: 3, text: "応援してるよ", nextScene: 49, affectionChanges: { "あおい": 4 } }
          ]
        },
        {
          id: 47,
          character: "あおい",
          speaker: "あおい",
          dialogue: "ありがとうございます❤❤ あなたが見てくれるなら、きっと良い演技ができます❤",
          nextScene: 50
        },
        {
          id: 48,
          character: "あおい",
          speaker: "あおい",
          dialogue: "本当ですか？❤❤❤ あなたのために特別に練習しますね❤ 浴衣での演技、頑張ります❤",
          nextScene: 50
        },
        {
          id: 49,
          character: "あおい",
          speaker: "あおい",
          dialogue: "あなたの応援があると心強いです❤❤ 精一杯頑張ります❤",
          nextScene: 50
        },
        {
          id: 50,
          character: "まゆ",
          speaker: "まゆ",
          dialogue: "写真部として夏祭りの記録を撮るんです❤ あなたの浴衣姿も撮らせてもらえませんか？❤❤",
          choices: [
            { id: 1, text: "いいよ、撮って", nextScene: 51, affectionChanges: { "まゆ": 4 } },
            { id: 2, text: "みんなと一緒に", nextScene: 52, affectionChanges: { "まゆ": 6 } },
            { id: 3, text: "君も一緒に写ろう", nextScene: 53, affectionChanges: { "まゆ": 7 } }
          ]
        },
        {
          id: 51,
          character: "まゆ",
          speaker: "まゆ",
          dialogue: "ありがとうございます❤❤ 自然な笑顔で撮らせていただきますね❤",
          nextScene: 54
        },
        {
          id: 52,
          character: "まゆ",
          speaker: "まゆ",
          dialogue: "いいアイデアですね❤❤ みんなでの記念写真、素敵になりそうです❤",
          nextScene: 54
        },
        {
          id: 53,
          character: "まゆ",
          speaker: "まゆ",
          dialogue: "私も？❤❤❤ 嬉しいです！一緒に写真を撮りましょう❤ 特別な思い出になりますね❤",
          nextScene: 54
        },
        {
          id: 54,
          speaker: "ナレーター",
          dialogue: "夏祭り当日の夕方。美しい夕焼けの中、クラスメイトたちが浴衣姿で集まってきた。",
          nextScene: 55
        },
        {
          id: 55,
          character: "さき",
          speaker: "さき",
          dialogue: "みなさん、お疲れ様です❤ 夏祭り、とても楽しみですね❤❤ あなたも浴衣がお似合いです❤",
          choices: [
            { id: 1, text: "君の浴衣も素敵だね", nextScene: 56, affectionChanges: { "さき": 6 } },
            { id: 2, text: "みんな綺麗だ", nextScene: 57, affectionChanges: { "さき": 4 } },
            { id: 3, text: "楽しい夜になりそう", nextScene: 58, affectionChanges: { "さき": 3 } }
          ]
        },
        {
          id: 56,
          character: "さき",
          speaker: "さき",
          dialogue: "ありがとうございます❤❤❤ あなたにそう言ってもらえると、浴衣を選んだ甲斐があります❤",
          nextScene: 59
        },
        {
          id: 57,
          character: "さき",
          speaker: "さき",
          dialogue: "本当ですね❤❤ でも、あなたが一番素敵です❤",
          nextScene: 59
        },
        {
          id: 58,
          character: "さき",
          speaker: "さき",
          dialogue: "はい❤ あなたと一緒なら、どんな夜も特別になります❤❤",
          nextScene: 59
        },
        {
          id: 59,
          character: "のぞみ",
          speaker: "のぞみ",
          dialogue: "美術部で祭りの看板を描いたんです❤ 見に来てもらえませんか？❤❤",
          choices: [
            { id: 1, text: "ぜひ見せて", nextScene: 60, affectionChanges: { "のぞみ": 5 } },
            { id: 2, text: "君の作品楽しみ", nextScene: 61, affectionChanges: { "のぞみ": 6 } },
            { id: 3, text: "芸術的だね", nextScene: 62, affectionChanges: { "のぞみ": 7 } }
          ]
        },
        {
          id: 60,
          character: "のぞみ",
          speaker: "のぞみ",
          dialogue: "本当ですか？❤❤ あなたに見てもらえるなんて光栄です❤",
          nextScene: 63
        },
        {
          id: 61,
          character: "のぞみ",
          speaker: "のぞみ",
          dialogue: "ありがとうございます❤❤ あなたのために心を込めて描きました❤",
          nextScene: 63
        },
        {
          id: 62,
          character: "のぞみ",
          speaker: "のぞみ",
          dialogue: "そう言ってもらえると嬉しいです❤❤❤ 芸術を理解してくれる人がいると創作意欲が湧きます❤",
          nextScene: 63
        },
        {
          id: 63,
          character: "あかり",
          speaker: "あかり",
          dialogue: "夏祭り実行委員として、今日の進行を担当しています❤ みなさんに楽しんでもらえるよう頑張ります❤❤",
          choices: [
            { id: 1, text: "お疲れ様", nextScene: 64, affectionChanges: { "あかり": 4 } },
            { id: 2, text: "しっかりしてるね", nextScene: 65, affectionChanges: { "あかり": 5 } },
            { id: 3, text: "何か手伝えることは？", nextScene: 66, affectionChanges: { "あかり": 6 } }
          ]
        },
        {
          id: 64,
          character: "あかり",
          speaker: "あかり",
          dialogue: "ありがとうございます❤❤ あなたが楽しんでくれることが一番の報酬です❤",
          nextScene: 67
        },
        {
          id: 65,
          character: "あかり",
          speaker: "あかり",
          dialogue: "そう言ってもらえると嬉しいです❤❤ みんなのために頑張っています❤",
          nextScene: 67
        },
        {
          id: 66,
          character: "あかり",
          speaker: "あかり",
          dialogue: "優しいんですね❤❤❤ でも、今日はあなたに楽しんでもらいたいんです❤",
          nextScene: 67
        },
        {
          id: 67,
          character: "ひより",
          speaker: "ひより",
          dialogue: "夏祭り、本当に素敵ですね❤ あなたと一緒だと、普通の祭りも特別な思い出になります❤❤",
          choices: [
            { id: 1, text: "君といると楽しい", nextScene: 68, affectionChanges: { "ひより": 7 } },
            { id: 2, text: "特別な夜だね", nextScene: 69, affectionChanges: { "ひより": 5 } },
            { id: 3, text: "一緒に回ろう", nextScene: 70, affectionChanges: { "ひより": 6 } }
          ]
        },
        {
          id: 68,
          character: "ひより",
          speaker: "ひより",
          dialogue: "私も...あなたといると毎日が楽しいです❤❤❤ ずっと一緒にいたい❤",
          nextScene: 71
        },
        {
          id: 69,
          character: "ひより",
          speaker: "ひより",
          dialogue: "はい❤❤ あなたがいてくれるから、今夜は本当に特別な夜になりました❤",
          nextScene: 71
        },
        {
          id: 70,
          character: "ひより",
          speaker: "ひより",
          dialogue: "はい❤❤ あなたと一緒に回る夏祭り、きっと忘れられない思い出になります❤",
          nextScene: 71
        },
        {
          id: 71,
          speaker: "ナレーター",
          dialogue: "夏祭りが本格的に始まった。屋台の香り、太鼓の音、そして美しい浴衣姿のクラスメイトたち。",
          choices: [
            { id: 1, text: "屋台を回る", nextScene: 72 },
            { id: 2, text: "縁日ゲームに挑戦", nextScene: 85 },
            { id: 3, text: "演劇を見る", nextScene: 98 },
            { id: 4, text: "花火の場所を確保", nextScene: 111 }
          ]
        },
        {
          id: 72,
          speaker: "ナレーター",
          dialogue: "屋台エリアは人でにぎわっている。りさのたこ焼き屋台も大盛況だ。",
          nextScene: 73
        },
        {
          id: 73,
          character: "りさ",
          speaker: "りさ",
          dialogue: "いらっしゃいませ❤ 特別にあなたには一番美味しいたこ焼きを作らせていただきます❤❤",
          choices: [
            { id: 1, text: "ありがとう", nextScene: 74, affectionChanges: { "りさ": 4 } },
            { id: 2, text: "手伝おうか？", nextScene: 75, affectionChanges: { "りさ": 6 } },
            { id: 3, text: "君の料理が一番", nextScene: 76, affectionChanges: { "りさ": 7 } }
          ]
        },
        {
          id: 74,
          character: "りさ",
          speaker: "りさ",
          dialogue: "どういたしまして❤❤ あなたの笑顔が見たくて頑張っています❤",
          nextScene: 77
        },
        {
          id: 75,
          character: "りさ",
          speaker: "りさ",
          dialogue: "本当？❤❤❤ 嬉しい！一緒にたこ焼きを作りましょう❤ エプロンをどうぞ❤",
          nextScene: 78
        },
        {
          id: 76,
          character: "りさ",
          speaker: "りさ",
          dialogue: "そんな...❤❤❤ あなたにそう言ってもらえると、もっと美味しく作れます❤",
          nextScene: 77
        },
        {
          id: 77,
          speaker: "ナレーター",
          dialogue: "りさのたこ焼きは絶品だった。他の屋台も回ってみることにした。",
          nextScene: 79
        },
        {
          id: 78,
          speaker: "ナレーター",
          dialogue: "りさと一緒にたこ焼きを作る。息の合った連携に周りの人たちも感心している。",
          nextScene: 79
        },
        {
          id: 79,
          character: "なな",
          speaker: "なな",
          dialogue: "かき氷はいかがですか？❤ 手作りシロップで作った特別なかき氷です❤❤",
          choices: [
            { id: 1, text: "いちご味で", nextScene: 80, affectionChanges: { "なな": 3 } },
            { id: 2, text: "おすすめは？", nextScene: 81, affectionChanges: { "なな": 4 } },
            { id: 3, text: "君と一緒に食べよう", nextScene: 82, affectionChanges: { "なな": 6 } }
          ]
        },
        {
          id: 80,
          character: "なな",
          speaker: "なな",
          dialogue: "いちご味ですね❤❤ 特製いちごシロップでお作りします❤",
          nextScene: 83
        },
        {
          id: 81,
          character: "なな",
          speaker: "なな",
          dialogue: "ブルーハワイがおすすめです❤❤ 夏の空のような美しい色なんですよ❤",
          nextScene: 83
        },
        {
          id: 82,
          character: "なな",
          speaker: "なな",
          dialogue: "本当ですか？❤❤❤ 嬉しい！二人で食べるかき氷、きっと特別に美味しいですね❤",
          nextScene: 84
        },
        {
          id: 83,
          speaker: "ナレーター",
          dialogue: "ななの手作りかき氷は、暑い夏の夜に心地よい涼しさを与えてくれた。",
          nextScene: 124
        },
        {
          id: 84,
          speaker: "ナレーター",
          dialogue: "ななと一緒に食べるかき氷は格別だった。二人の笑顔が夏の夜を彩る。",
          nextScene: 124
        },
        {
          id: 85,
          speaker: "ナレーター",
          dialogue: "縁日ゲームエリアでは、様々なゲームが楽しめる。金魚すくい、射的、輪投げなど。",
          nextScene: 86
        },
        {
          id: 86,
          character: "あおい",
          speaker: "あおい",
          dialogue: "金魚すくい、やってみませんか？❤ 私、実は得意なんです❤❤",
          choices: [
            { id: 1, text: "一緒にやろう", nextScene: 87, affectionChanges: { "あおい": 5 } },
            { id: 2, text: "コツを教えて", nextScene: 88, affectionChanges: { "あおい": 4 } },
            { id: 3, text: "君のテクニック見たい", nextScene: 89, affectionChanges: { "あおい": 6 } }
          ]
        },
        {
          id: 87,
          character: "あおい",
          speaker: "あおい",
          dialogue: "はい❤❤ 一緒に挑戦しましょう❤ あなたと協力すれば、たくさん取れそうです❤",
          nextScene: 90
        },
        {
          id: 88,
          character: "あおい",
          speaker: "あおい",
          dialogue: "ポイを水平に保って、ゆっくり動かすのがコツです❤❤ あなたにも教えてあげますね❤",
          nextScene: 91
        },
        {
          id: 89,
          character: "あおい",
          speaker: "あおい",
          dialogue: "本当ですか？❤❤❤ 恥ずかしいですが、頑張って見せますね❤",
          nextScene: 92
        },
        {
          id: 90,
          speaker: "ナレーター",
          dialogue: "あおいと一緒に金魚すくいに挑戦。息を合わせて見事に金魚を捕まえることができた。",
          nextScene: 93
        },
        {
          id: 91,
          speaker: "ナレーター",
          dialogue: "あおいの丁寧な指導で、金魚すくいのコツを覚えることができた。",
          nextScene: 93
        },
        {
          id: 92,
          speaker: "ナレーター",
          dialogue: "あおいの見事な金魚すくいのテクニックに周りの人たちも拍手を送った。",
          nextScene: 93
        },
        {
          id: 93,
          character: "まゆ",
          speaker: "まゆ",
          dialogue: "射的もありますよ❤ 写真を撮りながらやってみませんか？❤❤",
          choices: [
            { id: 1, text: "やってみよう", nextScene: 94, affectionChanges: { "まゆ": 4 } },
            { id: 2, text: "君の撮影技術も見たい", nextScene: 95, affectionChanges: { "まゆ": 6 } },
            { id: 3, text: "一緒に挑戦しよう", nextScene: 96, affectionChanges: { "まゆ": 5 } }
          ]
        },
        {
          id: 94,
          character: "まゆ",
          speaker: "まゆ",
          dialogue: "頑張って❤❤ 決定的瞬間を撮らせていただきますね❤",
          nextScene: 97
        },
        {
          id: 95,
          character: "まゆ",
          speaker: "まゆ",
          dialogue: "ありがとうございます❤❤ 動きながらの撮影、得意なんです❤",
          nextScene: 97
        },
        {
          id: 96,
          character: "まゆ",
          speaker: "まゆ",
          dialogue: "はい❤❤ 一緒に楽しみましょう❤ カメラも忘れずに❤",
          nextScene: 97
        },
        {
          id: 97,
          speaker: "ナレーター",
          dialogue: "射的に挑戦し、まゆが その瞬間を見事にカメラに収めた。楽しい縁日ゲームの時間だった。",
          nextScene: 124
        },
        {
          id: 98,
          speaker: "ナレーター",
          dialogue: "特設ステージでは、あおいたち演劇部による浴衣での短編劇が始まろうとしている。",
          nextScene: 99
        },
        {
          id: 99,
          character: "あおい",
          speaker: "あおい",
          dialogue: "まもなく開演です❤ 浴衣での演技は初めてで緊張しますが、頑張ります❤❤",
          choices: [
            { id: 1, text: "応援してるよ", nextScene: 100, affectionChanges: { "あおい": 5 } },
            { id: 2, text: "きっと素晴らしい劇になる", nextScene: 101, affectionChanges: { "あおい": 6 } },
            { id: 3, text: "君なら大丈夫", nextScene: 102, affectionChanges: { "あおい": 7 } }
          ]
        },
        {
          id: 100,
          character: "あおい",
          speaker: "あおい",
          dialogue: "ありがとうございます❤❤ あなたの応援があると心強いです❤",
          nextScene: 103
        },
        {
          id: 101,
          character: "あおい",
          speaker: "あおい",
          dialogue: "そう言ってもらえると嬉しいです❤❤ あなたのために頑張ります❤",
          nextScene: 103
        },
        {
          id: 102,
          character: "あおい",
          speaker: "あおい",
          dialogue: "あなたが信じてくれるなら、きっと成功します❤❤❤ 見ていてくださいね❤",
          nextScene: 103
        },
        {
          id: 103,
          speaker: "ナレーター",
          dialogue: "あおいの浴衣での演技は見事だった。観客から大きな拍手が送られる。",
          nextScene: 104
        },
        {
          id: 104,
          character: "あおい",
          speaker: "あおい",
          dialogue: "どうでしたか？❤ あなたに見てもらえて、いつもより上手くできた気がします❤❤",
          choices: [
            { id: 1, text: "感動的だった", nextScene: 105, affectionChanges: { "あおい": 7 } },
            { id: 2, text: "浴衣がよく似合ってた", nextScene: 106, affectionChanges: { "あおい": 6 } },
            { id: 3, text: "君は本当の女優だ", nextScene: 107, affectionChanges: { "あおい": 8 } }
          ]
        },
        {
          id: 105,
          character: "あおい",
          speaker: "あおい",
          dialogue: "本当ですか？❤❤❤ あなたを感動させることができて嬉しいです❤",
          nextScene: 108
        },
        {
          id: 106,
          character: "あおい",
          speaker: "あおい",
          dialogue: "ありがとうございます❤❤ あなたに褒めてもらえると、浴衣を着た甲斐があります❤",
          nextScene: 108
        },
        {
          id: 107,
          character: "あおい",
          speaker: "あおい",
          dialogue: "そんな...❤❤❤ あなたにそう言ってもらえるなんて、夢みたいです❤",
          nextScene: 108
        },
        {
          id: 108,
          speaker: "ナレーター",
          dialogue: "演劇の後は、のぞみの美術作品展示も見学した。祭りの雰囲気を盛り上げる素晴らしい作品だった。",
          nextScene: 109
        },
        {
          id: 109,
          character: "のぞみ",
          speaker: "のぞみ",
          dialogue: "私の作品、どうでしたか？❤ 夏祭りの雰囲気に合うように描いたんです❤❤",
          choices: [
            { id: 1, text: "とても美しかった", nextScene: 110, affectionChanges: { "のぞみ": 6 } },
            { id: 2, text: "祭りにぴったり", nextScene: 110, affectionChanges: { "のぞみ": 5 } },
            { id: 3, text: "君の才能に感動", nextScene: 110, affectionChanges: { "のぞみ": 8 } }
          ]
        },
        {
          id: 110,
          character: "のぞみ",
          speaker: "のぞみ",
          dialogue: "ありがとうございます❤❤ あなたに認めてもらえて、創作活動により力が入ります❤",
          nextScene: 124
        },
        {
          id: 111,
          speaker: "ナレーター",
          dialogue: "花火の時間が近づいてきた。みんなで良い場所を確保することにした。",
          nextScene: 112
        },
        {
          id: 112,
          character: "さき",
          speaker: "さき",
          dialogue: "あそこの丘が一番よく見えそうですね❤ みんなで一緒に見ましょう❤❤",
          nextScene: 113
        },
        {
          id: 113,
          character: "ひより",
          speaker: "ひより",
          dialogue: "花火、とても楽しみです❤ あなたと一緒に見る花火は特別ですね❤❤",
          choices: [
            { id: 1, text: "君と見る花火は格別だ", nextScene: 114, affectionChanges: { "ひより": 8 } },
            { id: 2, text: "きっと綺麗だろうね", nextScene: 115, affectionChanges: { "ひより": 5 } },
            { id: 3, text: "一緒だと楽しい", nextScene: 116, affectionChanges: { "ひより": 6 } }
          ]
        },
        {
          id: 114,
          character: "ひより",
          speaker: "ひより",
          dialogue: "そんな...❤❤❤ あなたにそう言ってもらえると、花火より私の心が輝いちゃいます❤",
          nextScene: 117
        },
        {
          id: 115,
          character: "ひより",
          speaker: "ひより",
          dialogue: "はい❤❤ でも、あなたがいてくれると花火より美しい景色に見えます❤",
          nextScene: 117
        },
        {
          id: 116,
          character: "ひより",
          speaker: "ひより",
          dialogue: "私も❤❤ あなたと過ごす時間はいつも楽しいです❤",
          nextScene: 117
        },
        {
          id: 117,
          speaker: "ナレーター",
          dialogue: "ついに花火が始まった。夜空に咲く美しい花々と、クラスメイトたちの笑顔が重なり合う。",
          nextScene: 118
        },
        {
          id: 118,
          character: "あかり",
          speaker: "あかり",
          dialogue: "みなさん、今日は夏祭りに来てくださってありがとうございました❤ 楽しんでもらえましたか？❤❤",
          choices: [
            { id: 1, text: "最高の夜だった", nextScene: 119, affectionChanges: { "あかり": 6 } },
            { id: 2, text: "みんなのおかげで楽しかった", nextScene: 120, affectionChanges: { "あかり": 7 } },
            { id: 3, text: "忘れられない思い出になった", nextScene: 121, affectionChanges: { "あかり": 8 } }
          ]
        },
        {
          id: 119,
          character: "あかり",
          speaker: "あかり",
          dialogue: "本当ですか？❤❤ そう言ってもらえると、企画した甲斐があります❤",
          nextScene: 122
        },
        {
          id: 120,
          character: "あかり",
          speaker: "あかり",
          dialogue: "ありがとうございます❤❤ みんなで協力した結果ですね❤",
          nextScene: 122
        },
        {
          id: 121,
          character: "あかり",
          speaker: "あかり",
          dialogue: "そう言ってもらえると嬉しいです❤❤❤ 私たちにとっても特別な夜になりました❤",
          nextScene: 122
        },
        {
          id: 122,
          speaker: "ナレーター",
          dialogue: "花火のフィナーレと共に、素晴らしい夏祭りの夜が幕を閉じた。",
          nextScene: 123
        },
        {
          id: 123,
          speaker: "ナレーター",
          dialogue: "みんなで浴衣を着て過ごした夏祭りは、忘れることのできない特別な思い出となった。クラスメイトたちとの絆はより一層深まった。",
          nextScene: 124
        },
        {
          id: 124,
          speaker: "ナレーター",
          dialogue: "夏休みもあと少し。海水浴やキャンプなど、まだまだ夏の思い出作りは続く。",
          choices: [
            { id: 1, text: "海水浴に行く", nextScene: 125 },
            { id: 2, text: "キャンプに参加", nextScene: 140 },
            { id: 3, text: "プール遊び", nextScene: 155 },
            { id: 4, text: "星空観察", nextScene: 170 }
          ]
        },
        {
          id: 125,
          speaker: "ナレーター",
          dialogue: "クラスのみんなで海水浴に行くことになった。美しい海岸で、水着姿のクラスメイトたちと楽しい時間を過ごす。",
          nextScene: 126
        },
        // 海水浴シーンを追加（シーン126-139）
        {
          id: 139,
          speaker: "ナレーター",
          dialogue: "海水浴での楽しい一日が終わった。みんなで見た夕日は、夏の美しい思い出となった。",
          nextScene: 185
        },
        {
          id: 140,
          speaker: "ナレーター",
          dialogue: "山でのキャンプに参加することになった。大自然の中で、クラスメイトたちとの絆をさらに深める。",
          nextScene: 141
        },
        // キャンプシーンを追加（シーン141-154）
        {
          id: 154,
          speaker: "ナレーター",
          dialogue: "キャンプでの思い出は一生忘れることはないだろう。自然の中で過ごした時間は、みんなをより親密にした。",
          nextScene: 185
        },
        {
          id: 155,
          speaker: "ナレーター",
          dialogue: "学校のプールで水泳の練習をすることになった。プール遊びも楽しい夏の思い出の一つだ。",
          nextScene: 156
        },
        // プール遊びシーンを追加（シーン156-169）
        {
          id: 169,
          speaker: "ナレーター",
          dialogue: "プールでの楽しい時間が終わった。みんなの笑顔と水しぶきが夏の思い出を彩った。",
          nextScene: 185
        },
        {
          id: 170,
          speaker: "ナレーター",
          dialogue: "夏の夜、みんなで星空観察をすることになった。美しい星空の下で、ロマンチックな時間を過ごす。",
          nextScene: 171
        },
        // 星空観察シーンを追加（シーン171-184）
        {
          id: 184,
          speaker: "ナレーター",
          dialogue: "星空の下で過ごした夜は、ロマンチックで忘れられない思い出となった。",
          nextScene: 185
        },
        {
          id: 185,
          speaker: "ナレーター",
          dialogue: "充実した夏休みが終わろうとしている。たくさんの思い出と、深まった絆を胸に、新学期を迎える準備をする。",
          nextScene: -1
        }
      ]
    },
    {
      id: 5,
      title: "文化祭の奇跡",
      description: "文化祭での感動的な出来事と告白シーンが待っています。",
      estimatedTime: 180,
      isUnlocked: false,
      isCompleted: false,
      characters: ["さき", "のぞみ", "あかり", "ひより", "全キャラクター"],
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
      estimatedTime: 200,
      isUnlocked: false,
      isCompleted: false,
      characters: ["さくら", "あい", "みお", "ゆい", "全キャラクター"],
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