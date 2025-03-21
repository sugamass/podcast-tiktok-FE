import SetAudioScreen from "@/screen/SetAudioScreen";
import { useLocalSearchParams } from "expo-router";

export default function setAudio() {
  const { scriptData } = useLocalSearchParams();

  const normalizedScriptData =
    typeof scriptData === "string" ? scriptData : (scriptData?.[0] ?? "");

  return <SetAudioScreen originalScriptData={normalizedScriptData} />;
}
