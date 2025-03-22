import { fetchApi } from "./api";
import { components } from "./types/audio";
import { AudioItem, AudioUrl } from "../types/Audio";
import { Remark } from "@/types/Script";

export type AudioDataForResponse = components["schemas"]["AudioData"];
export type AudioTestResponse = components["schemas"]["AudioTestResponse"];

export const postAudio = async (
  title: string,
  description: string,
  script: Remark[],
  user_id: string,
  tts: string,
  voices: string[],
  speakers: string[],
  reference?: string[]
): Promise<AudioItem> => {
  const response: AudioDataForResponse = await fetchApi("/audio", {
    method: "POST",
    body: JSON.stringify({
      title: title,
      script: script.map((data) => ({
        speaker: data.speaker,
        text: data.text,
        caption: data.caption,
      })),
      description: description,
      user_id: "user_id",
      reference: reference,
      tts: tts,
      voices: voices,
      speakers: speakers,
    }),
  });

  const result: AudioItem = {
    id: response.id,
    audioUrl: response.url,
    imageUrl: require("./../storage/radio_icon.png"), // TODO
    title: response.title,
    description: response.description,
    createdAt: response.created_at,
    createdBy: response.created_by,
  };

  return result;
};

export const getAudioData = async (
  type?: string,
  userId?: string
): Promise<AudioItem[]> => {
  const params: Record<string, string> = {};
  if (type) {
    params.type = type;
  }
  if (userId) {
    params.user_id = userId;
  }

  const queryParams = new URLSearchParams(params).toString();

  const response: AudioDataForResponse[] = await fetchApi(
    `/audio?${queryParams}`,
    {
      method: "GET",
    }
  );

  const result: AudioItem[] = response.map((data) => ({
    id: data.id,
    audioUrl: data.url,
    imageUrl: require("./../storage/radio_icon.png"), // TODO
    title: data.title,
    description: data.description,
    createdAt: data.created_at,
    createdBy: data.created_by,
  }));

  return result;
};

export const postAudioTest = async (
  script: Remark[],
  tts: string,
  voices: string[],
  speakers: string[],
  script_id?: string
): Promise<AudioUrl> => {
  const res: AudioTestResponse = await fetchApi("/audio/test", {
    method: "POST",
    body: JSON.stringify({
      script: script.map((data) => ({
        speaker: data.speaker,
        text: data.text,
        caption: data.caption,
      })),
      tts: tts,
      voices: voices,
      speakers: speakers,
      script_id: script_id,
    }),
  });

  return {
    m3u8Url: res.m3u8_url ?? "",
    mp3Urls: res.mp3_urls ?? [],
    scriptId: res.script_id ?? "",
  };
};

export const postNewAudio = async (
  title: string,
  description: string,
  script: Remark[],
  user_id: string,
  tts: string,
  voices: string[],
  speakers: string[],
  script_id: string
): Promise<AudioItem> => {
  const response: AudioDataForResponse = await fetchApi("/audio/new", {
    method: "POST",
    body: JSON.stringify({
      title: title,
      description: description,
      script: script.map((data) => ({
        speaker: data.speaker,
        text: data.text,
        caption: data.caption,
      })),
      user_id: user_id,
      tts: tts,
      voices: voices,
      speakers: speakers,
      script_id: script_id,
    }),
  });

  const result: AudioItem = {
    id: response.id,
    audioUrl: response.url,
    imageUrl: require("./../storage/radio_icon.png"), // TODO
    title: response.title,
    description: response.description,
    createdAt: response.created_at,
    createdBy: response.created_by,
  };

  return result;
};

export const deleteNewAudio = async (script_id: string): Promise<void> => {
  await fetchApi(`/audio/new?script_id=${script_id}`, {
    method: "DELETE",
  });
  return;
};
