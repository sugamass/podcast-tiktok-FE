import { GraphData } from "graphai";

export const message = `この件について、内容全てを高校生にも分かるように、太郎くん(Student)と先生(Teacher)の会話、という形の台本をArtifactとして作って。ただし要点はしっかりと押さえて。
最初の一言は、Announcerによるトピックの紹介にし、常に、"米国で活躍するエンジニアが新しい技術やビジネスを分かりやすく解説する、中島聡のLife is beautiful。"でスタートして。
以下に別のトピックに関するサンプルを貼り付けます。このJSONフォーマットに従って。

{
  "title": "韓国の戒厳令とその日本への影響",
  "description": "韓国で最近発令された戒厳令とその可能性のある影響について、また日本の憲法に関する考慮事項との類似点を含めた洞察に満ちた議論。",
  "tts": "nijivoice",
  "voices": [
    "afd7df65-0fdc-4d31-ae8b-a29f0f5eed62",
    "a7619e48-bf6a-4f9f-843f-40485651257f",
    "bc06c63f-fef6-43b6-92f7-67f919bd5dae"
  ],
  "charactors": ["春玲", "森野颯太", "ベン・カーター"],
  "speakers": ["Announcer", "Student", "Teacher"],
  "script": [
    {
      "speaker": "Announcer",
      "text": "米国で活躍するエンジニアが、新しい技術やビジネスを分かりやすく解説する、中島聡のLife is beautiful。今日は、韓国で最近発令された戒厳令についての解説です。"
    },
    {
      "speaker": "Student",
      "text": "先生、今日は韓国で起きた戒厳令のことを教えてもらえますか？"
    },
    {
      "speaker": "Teacher",
      "text": "もちろんだよ、太郎くん。韓国で最近、大統領が「戒厳令」っていうのを突然宣言したんだ。"
    },
    {
      "speaker": "Student",
      "text": "戒厳令ってなんですか？"
    },
    {
      "speaker": "Teacher",
      "text": "簡単に言うと、国がすごく危ない状態にあるとき、軍隊を使って人々の自由を制限するためのものなんだ。たとえば、政治活動を禁止したり、人の集まりを取り締まったりするんだよ。"
    },
    {
      "speaker": "Student",
      "text": "それって怖いですね。なんでそんなことをしたんですか？"
    },
    {
      "speaker": "Teacher",
      "text": "大統領は「国会がうまく機能していないから」と言っていたけど、実際には自分の立場を守るために使ったように見えるんだ。それで、軍隊が国会に突入して、議員たちを捕まえようとしたんだ。"
    },
    {
      "speaker": "Student",
      "text": "ええっ！？国会議員を捕まえようとするなんて、すごく危ないことじゃないですか。"
    },
    {
      "speaker": "Teacher",
      "text": "その通りだよ。もし軍隊が国会を占拠していたら、国会で戒厳令を解除することもできなかったかもしれない。つまり、大統領がずっと自分の好きなように国を支配できるようになってしまうんだ。"
    },
    {
      "speaker": "Student",
      "text": "韓国ではどうなったんですか？"
    },
    {
      "speaker": "Teacher",
      "text": "幸い、野党の議員や市民たちが急いで集まって抗議して、6時間後に戒厳令は解除されたんだ。でも、ほんの少しの違いで、韓国の民主主義が大きく傷つけられるところだったんだよ。"
    },
    {
      "speaker": "Student",
      "text": "それは大変なことですね…。日本ではそんなこと起きないんですか？"
    },
    {
      "speaker": "Teacher",
      "text": "実はね、今、日本でも似たような話があるんだよ。自民党が「緊急事態宣言」を憲法に追加しようとしているんだ。"
    },
    {
      "speaker": "Student",
      "text": "緊急事態宣言って、韓国の戒厳令と同じようなものなんですか？"
    },
    {
      "speaker": "Teacher",
      "text": "似ている部分があるね。たとえば、総理大臣が「社会秩序の混乱の危険があるから」と言えば、特別な権限を使って国を動かすことができるんだ。法律と同じ力を持つ命令を出したり、地方自治体に指示を出したりすることができるんだよ。"
    },
    {
      "speaker": "Student",
      "text": "それって便利そうですけど、なんだか心配です。"
    },
    {
      "speaker": "Teacher",
      "text": "そうだね。もちろん、緊急時には素早い対応が必要だから便利な面もあるけど、その権限が濫用されると、とても危険なんだ。たとえば、総理大臣が自分に都合のいいように国を動かしたり、国民の自由を奪ったりすることができるようになってしまうかもしれない。"
    },
    {
      "speaker": "Student",
      "text": "韓国みたいに、軍隊が政治に口を出してくることもあり得るんですか？"
    },
    {
      "speaker": "Teacher",
      "text": "完全にあり得ないとは言えないからこそ、注意が必要なんだ。私たち国民は、自民党の改憲案が権力の濫用を防ぐための適切な制限を含んでいるのかをしっかり監視し、声を上げることが求められる。民主主義が損なわれるのを防ぐために、私たち一人ひとりが積極的に関心を持つことが大切なんだよ。"
    },
    {
      "speaker": "Student",
      "text": "ありがとうございます。とても良い勉強になりました。"
    },
    {
      "speaker": "Announcer",
      "text": "ご視聴、ありがとうございました。次回の放送もお楽しみに。"
    }
  ]
}`;

export const generateScriptGraph: GraphData = {
  version: 0.6,
  nodes: {
    promptInput: {
      value: {},
    },
    messages: {
      value: [
        {
          role: "system",
          content: message,
        },
      ],
    },
    llmCall: {
      agent: "openAIAgent",
      inputs: { messages: ":messages", prompt: ":promptInput" },
    },
    output: {
      agent: "copyAgent",
      inputs: { data: ":llmCall.text" },
      isResult: true,
    },
  },
};
