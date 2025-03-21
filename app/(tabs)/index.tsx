import HomeScreen from "@/screen/HomeScreen";
import { useLocalSearchParams } from "expo-router";

export default function Home() {
  const { audioData } = useLocalSearchParams();

  const normalizedAudioData =
    typeof audioData === "string" ? audioData : (audioData?.[0] ?? "");

  return <HomeScreen newAudioData={normalizedAudioData} />;
}
