export type ScriptMeta = {
  title: string;
  description?: string;
  script: AllScriptData;
};

export type AllScriptData = {
  // title: string;
  // description?: string;
  // originalPrompt: string;
  currentScript: PromptScriptData;
  previousScript?: PromptScriptData[];
  prompt?: string;
};

export type Remark = {
  speaker: string;
  text: string;
  caption?: string;
};

export type PromptScriptData = {
  prompt: string;
  script: Remark[];
  reference?: string[];
};
