import { GraphData } from "graphai";

export const graphData: GraphData = {
  version: 0.5,
  nodes: {
    one: {
      agent: "textInputAgent",
    },
    two: {
      agent: "textInputAgent",
      inputs: { data: ":one" },
    },
    three: {
      agent: "textInputAgent",
      inputs: { data: ":one" },
    },
    four: {
      agent: "textInputAgent",
      inputs: { data: [":two", ":three"] },
    },
    // event
    oneEvent: {
      agent: "eventAgent",
      params: { type: "button" },
    },
    twoEvent: {
      agent: "eventAgent",
      params: { type: "text" },
    },
  },
};

export const reviseScriptGraph: GraphData = {
  version: 0.6,
  nodes: {
    scriptInput: {
      agent: "textInputAgent",
    },
    llmCall: {
      agent: "openAIAgent",
      inputs: { messages: ":messages", prompt: ":scriptInput" },
      if: ":checkInput",
    },
    // event
    generateScriptEvent: {
      agent: "eventAgent",
      params: { type: "button" },
    },
    ConfirmEvent: {
      agent: "eventAgent",
      params: { type: "text" },
    },
  },
};
