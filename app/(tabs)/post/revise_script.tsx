import ReviseScriptScreen from "@/screen/ReviseScriptScreen";
import { useLocalSearchParams } from "expo-router";

export default function RevisePost() {
  const { scriptData } = useLocalSearchParams();

  const normalizedScriptData =
    typeof scriptData === "string" ? scriptData : (scriptData?.[0] ?? "");

  return <ReviseScriptScreen originalScriptData={normalizedScriptData} />;
}
