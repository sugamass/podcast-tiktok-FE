import { fetchApi } from "./api";
import { AllScriptData, PromptScriptData } from "../types/Script";
import { components } from "./types/script";

export type PostCreateScriptRequest =
  components["schemas"]["PostCreateScriptRequest"];
export type PostCreateScriptResponse =
  components["schemas"]["PostCreateScriptResponse"];

export const postScript = async (
  prompt: string,
  isSearch: boolean,
  previousScript?: PromptScriptData[],
  reference?: string[],
  speakers?: string[]
  // wordCount?: number
): Promise<AllScriptData> => {
  const response: PostCreateScriptResponse = await fetchApi("/script/create", {
    method: "POST",
    body: JSON.stringify({
      reference: reference ?? [],
      prompt: prompt,
      previous_script: previousScript
        ? previousScript.map((data) => ({
            prompt: data.prompt,
            script: data.script.map((s) => ({
              speaker: s.speaker,
              text: s.text,
              caption: s.caption,
            })),
            reference: data.reference,
          }))
        : undefined,
      is_search: isSearch,
      speakers: speakers,
      // word_count: wordCount,
    }),
  });

  const result: AllScriptData = {
    currentScript: {
      prompt: response.new_script.prompt,
      script:
        response.new_script.script?.map((data) => ({
          speaker: data.speaker ?? "",
          text: data.text ?? "",
          caption: data.caption ?? "",
        })) ?? [],
      reference: response.new_script.reference ?? [],
    },
    previousScript:
      response.previous_script?.map((data) => ({
        prompt: data.prompt,
        script:
          data.script?.map((data) => ({
            speaker: data.speaker ?? "",
            text: data.text ?? "",
            caption: data.caption ?? "",
          })) ?? [],
        reference: data.reference ?? [],
      })) ?? [],
  };

  return result;
};
