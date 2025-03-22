import { GraphData } from "graphai";
import { PromptScriptData, Remark } from "@/types/Script";
import { useState, useMemo, useRef, version } from "react";
import { GraphAI, AgentFunctionContext } from "graphai";
import {
  stringTemplateAgent,
  copyAgent,
  pushAgent,
  nestedAgent,
  mapAgent,
} from "@graphai/vanilla";
import fetchAgentRN from "@/graphAI/agent/fetch_agent_rn";
import { openAIAgent } from "@graphai/openai_agent";
import { streamAgentFilterGenerator } from "@graphai/agent_filters";
import openAIAgentRN from "@/graphAI/agent/openai_agent_rn";

const messageContent = `次に与えるトピックについて、内容全てを高校生にも分かるように、複数人の登場人物による会話形式、あるいはナレーターによるナレーション形式の台本を作って。ただし要点はしっかりと押さえて。
最初の一言は、Announcerによるトピックの紹介にして。
以下に別のトピックに関するサンプルを貼り付けます。このJSONフォーマットに従って。JSON以外は何も出力しないで。

  [
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
  ]`;

export const useGenerateScript = (
  prompt: string,
  previousScript?: PromptScriptData[],
  reference?: string[],
  isSearch?: boolean,
  speakers?: string[]
) => {
  const tabityApiKey = process.env.EXPO_PUBLIC_TAVILY_API_KEY;
  const openAIAPIKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  const [streamingData, setStreamingData] = useState<Record<string, unknown>>(
    {}
  );
  const [result, setResult] = useState<Remark[]>([]);

  const messages = [{ role: "system", content: messageContent }];

  if (speakers && speakers.length > 0) {
    const speakerMessage = `台本には、以下の人物だけを登場させて。\n${speakers.join(
      ","
    )}`;
    messages.push({ role: "system", content: speakerMessage });
  } else {
    const speakerMessage = `台本には、以下の人物だけを登場させて。\nAnnouncer,Student,Teacher`;
    messages.push({ role: "system", content: speakerMessage });
  }

  // 4-oは文字数タスク苦手で、文字数指定はまだ難しそうなので保留。
  // if (script.wordCount) {
  //   const wordCountMessage = `台本の文字数は、${script.wordCount}文字程度にしてください。`;
  //   messages.push({ role: "system", content: wordCountMessage });
  // }

  if (previousScript && previousScript.length > 0) {
    previousScript.forEach((s) => {
      messages.push({ role: "user", content: s.prompt });
      messages.push({ role: "assistant", content: JSON.stringify(s.script) });
    });
  }

  const today = new Date();
  const formattedDate = `${today.getFullYear()}/${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${today.getDate().toString().padStart(2, "0")}`;

  const searchMessages = [
    { role: "system", content: messageContent },
    {
      role: "system",
      content: `必要に応じて、searchTavity apiを叩いて情報を取得して。ちなみに、今日の日付は${formattedDate}です。`,
    },
  ];

  if (isSearch && previousScript) {
    previousScript.forEach((s) => {
      searchMessages.push({ role: "user", content: s.prompt });
      searchMessages.push({
        role: "assistant",
        content: JSON.stringify(s.script),
      });
    });
  }

  const tools = [
    {
      type: "function",
      function: {
        name: "searchTavity",
        description:
          "必要に応じてTavityAPIを実行してweb検索し、関連する情報を取得する",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "検索クエリ" },
            max_results: {
              type: "integer",
              description: "検索結果の数(デフォルトは3)",
              default: 3,
            },
          },
          required: ["query"],
        },
      },
    },
  ];

  const webSearchGraph = {
    version: 1.0,
    nodes: {
      fetch: {
        agent: "fetchAgent",
        inputs: {
          url: "https://api.tavily.com/search",
          headers: {
            Authorization: `Bearer ${tabityApiKey}`,
            "Content-Type": "application/json",
          },
          body: {
            query: ":parent_tool.arguments.query",
            // max_results: ":parent_tool.arguments.max_results",
            max_results: 1,
            include_raw_content: true,
          },
        },
      },
      extractError: {
        // TODO prop: onError is not hit
        // Extract error title and detail
        agent: "stringTemplateAgent",
        inputs: {
          text: "webSearchError ${:fetch.onError.error.title}: ${:fetch.onError.error.detail}",
        },
        if: ":fetch.onError",
        console: { after: true },
      },
      searchContent: {
        agent: "mapAgent",
        inputs: { rows: ":fetch.results" },
        graph: {
          nodes: {
            formatContent: {
              agent: "copyAgent",
              inputs: {
                title: ":row.title",
                content: ":row.raw_content",
              },
              isResult: true,
            },
          },
        },
        console: { after: true },
      },
      toolMessages: {
        agent: (namedInputs: any) => {
          const { searchContent, messages, tool } = namedInputs;

          const contentList = searchContent.map(
            (con: any) => con.formatContent
          );

          const toolMessage = {
            role: "tool",
            tool_call_id: tool.id,
            name: tool.name,
            content: JSON.stringify(contentList),
          };
          const updatedMessages = messages.concat(toolMessage);
          return updatedMessages;
        },
        inputs: {
          searchContent: ":searchContent",
          messages: ":parent_messages",
          tool: ":parent_tool",
        },
        isResult: true,
      },
    },
  };

  const WebExtractGraph = {
    version: 1.0,
    nodes: {
      fetch: {
        agent: "fetchAgent",
        inputs: {
          url: "https://api.tavily.com/extract",
          headers: {
            Authorization: `Bearer ${tabityApiKey}`,
            "Content-Type": "application/json",
          },
          body: {
            urls: ":parent_reference", // []string
          },
        },
      },
      extractError: {
        // TODO prop: onError is not hit
        // Extract error title and detail
        agent: "stringTemplateAgent",
        inputs: {
          text: "webSearchError ${:fetch.onError.error.title}: ${:fetch.onError.error.detail}",
        },
        if: ":fetch.onError",
        console: { after: true },
      },
      extractContent: {
        agent: "mapAgent",
        inputs: { rows: ":fetch.results" },
        graph: {
          nodes: {
            formatContent: {
              agent: "copyAgent",
              inputs: {
                source: ":row.url",
                content: ":row.raw_content",
              },
              isResult: true,
            },
          },
        },
      },
      toolMessages: {
        agent: (namedInputs: any) => {
          const { extractContent, messages } = namedInputs;

          const contentList = extractContent.map(
            (con: any) => con.formatContent
          );

          const toolMessage = {
            role: "system",
            content:
              "web検索で得た以下の情報も、生成する台本に含めてください。\n" +
              JSON.stringify(contentList),
          };
          const updatedMessages = messages.concat(toolMessage);
          return updatedMessages;
        },
        inputs: {
          extractContent: ":extractContent",
          messages: ":parent_messages",
        },
        isResult: true,
      },
    },
  };

  const createScriptGraph: GraphData = {
    version: 1.0,
    nodes: {
      isSearch: {
        value: {},
      },
      promptInput: {
        value: {},
      },
      messages: {
        value: {},
      },
      searchMessage: {
        value: {},
      },
      reference: {
        value: {},
      },
      referenceCheck: {
        agent: (namedInputs) => {
          const { reference } = namedInputs;
          return reference.length > 0;
        },
        inputs: { reference: ":reference" },
      },
      searchCheck: {
        agent: (namedInputs) => {
          const { isSearch } = namedInputs;
          return isSearch;
        },
        inputs: { isSearch: ":isSearch" },
        unless: ":referenceCheck",
      },
      llmCall: {
        agent: "openAIAgent",
        params: { tools, apiKey: openAIAPIKey },
        inputs: {
          messages: ":searchMessage",
          prompt: ":promptInput",
        },
        if: ":searchCheck",
      },
      messageWithToolCalls: {
        agent: "pushAgent",
        inputs: {
          array: ":messages",
          items: [":llmCall.message"],
        },
        console: { after: true },
      },
      toolCalls: {
        // This node is activated if the LLM requests a tool call.
        agent: "nestedAgent",
        inputs: {
          parent_messages: ":messageWithToolCalls.array",
          parent_tool: ":llmCall.tool",
        },
        // output: { toolMessages: ":toolMessages" },
        if: ":llmCall.tool",
        graph: webSearchGraph,
        console: { after: true },
      },
      noToolCalls: {
        agent: "copyAgent",
        inputs: { data: ":messages" },
        unless: ":llmCall.tool",
      },
      referenceToolCalls: {
        agent: "nestedAgent",
        inputs: {
          parent_messages: ":messages",
          parent_reference: ":reference",
        },
        if: ":referenceCheck",
        graph: WebExtractGraph,
      },
      searchMessages: {
        agent: "copyAgent",
        anyInput: true,
        inputs: {
          array: [
            ":toolCalls.toolMessages",
            ":noToolCalls.data",
            ":referenceToolCalls.toolMessages",
          ],
        },
      },
      console1: {
        agent: (namedInputs: any) => {
          const { data, prompt } = namedInputs;
          console.log("searchMessages", data);
          console.log("prompt", prompt);
        },
        inputs: { data: ":searchMessages", prompt: ":promptInput" },
      },
      notSearchMessages: {
        agent: "copyAgent",
        inputs: { data: ":messages" },
        unless: ":searchCheck",
      },
      scriptMessages: {
        agent: "copyAgent",
        anyInput: true,
        inputs: {
          array: [":notSearchMessages.data", ":searchMessages.array.$0"],
        },
        console: { after: true },
      },
      llm: {
        agent: "openAIAgent",
        params: { apiKey: openAIAPIKey, stream: true },
        inputs: {
          messages: ":scriptMessages.array.$0",
          prompt: ":promptInput",
        },
        console: { after: true },
        isResult: true,
      },
      output: {
        agent: "copyAgent",
        inputs: { data: ":llm.text" },
        isResult: true,
      },
    },
  };

  const callback = (context: AgentFunctionContext, data: string) => {
    console.log("Data received:", data);
    const { nodeId } = context.debugInfo;
    streamingData[nodeId] = (streamingData[nodeId] ?? "") + data;
  };
  const streamAgentFilter = streamAgentFilterGenerator(callback);
  const agentFilters = [
    {
      name: "streamAgentFilter",
      agent: streamAgentFilter,
      agentIds: ["llm"],
    },
  ];

  const runGraph = async () => {
    setResult([]);
    setStreamingData({});

    const graphai = new GraphAI(
      createScriptGraph,
      {
        stringTemplateAgent,
        copyAgent,
        pushAgent,
        nestedAgent,
        openAIAgent: openAIAgentRN,
        mapAgent,
        fetchAgent: fetchAgentRN,
      },
      { agentFilters }
    );
    // graphai.registerCallback(updateCytoscape);
    graphai.injectValue("promptInput", prompt);
    graphai.injectValue("isSearch", isSearch);
    graphai.injectValue("messages", messages);
    graphai.injectValue("searchMessage", searchMessages);
    graphai.injectValue("reference", reference ?? []);

    const res = await graphai.run();
    console.log("Result:", res);

    let generatedScriptString = "";
    for (const [_, value] of Object.entries(res)) {
      if (typeof value === "object") {
        for (const [key2, value2] of Object.entries(value)) {
          if (key2 == "data") {
            generatedScriptString = value2;
          }
        }
      }
    }
    setResult(JSON.parse(generatedScriptString));
  };

  return { runGraph, streamingData, result, setResult };
};
