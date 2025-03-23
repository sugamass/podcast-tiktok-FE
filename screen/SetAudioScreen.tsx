import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ScriptMeta, AllScriptData, PromptScriptData } from "@/types/Script";
import {
  postAudio,
  postNewAudio,
  deleteNewAudio,
  postAudioTest,
} from "@/services/audio";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import AudioTest from "@/components/AudioTest";
import { Audio } from "expo-av";

interface SetAudioScreenProps {
  originalScriptData: string;
}

type VoiceType = {
  value: string;
  label: string;
};

const openaiVoices: VoiceType[] = [
  { value: "alloy", label: "alloy" },
  { value: "ash", label: "ash" },
  { value: "coral", label: "coral" },
  { value: "echo", label: "echo" },
  { value: "fable", label: "fable" },
  { value: "onyx", label: "onyx" },
  { value: "nova", label: "nova" },
  { value: "sage", label: "sage" },
  { value: "shimmer", label: "shimmer" },
];

const nijivoiceVoices: VoiceType[] = [
  { value: "asuna_mito", label: "水戸明日奈（女性）" },
  { value: "ben_carter", label: "ベン・カーター（男性）" },
  { value: "hatsune_fuyutuki", label: "冬月初音（女性）" },
  { value: "rapisu", label: "ラピス（女性）" },
  { value: "touma", label: "灯真（男性）" },
  { value: "marimo_kokemura", label: "苔村まりも（女性）" },
  { value: "aiitirou_nomoto", label: "野本藍一郎（男性）" },
  { value: "pono", label: "ぽの（女性）" },
  { value: "mizuki_asagiri", label: "朝霧瑞希（男性）" },
  {
    value: "sedorikku_e_wittomoa",
    label: "セドリック・E・ウィットモア（男性）",
  },
];

const SetAudioScreen: React.FC<SetAudioScreenProps> = ({
  originalScriptData,
}) => {
  const router = useRouter();
  const originalScriptDataObj = JSON.parse(
    originalScriptData
  ) as PromptScriptData;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const topHeight = insets.top;

  // タイトル・説明の入力フォーム用
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [voiceOptions, setVoiceOptions] = useState<VoiceType[]>(openaiVoices);
  const [scriptData, setScriptData] = useState<PromptScriptData>(
    originalScriptDataObj
  );
  const [scriptId, setScriptId] = useState<string>("");
  const [remarkAudioUrls, setRemarkAudioUrls] = useState<string[]>([]);
  const [audioUrl, setAudioUrl] = useState<string>("");

  const addedSpeakers = new Set<string>();
  const speakers: string[] = [];
  scriptData.script.forEach((remark) => {
    if (!addedSpeakers.has(remark.speaker)) {
      addedSpeakers.add(remark.speaker);
      speakers.push(remark.speaker);
    }
  });

  const [tts, setTts] = useState("openAI");
  const [voices, setVoices] = useState<string[]>(
    Array(speakers.length).fill(openaiVoices[0].value)
  );

  const [remarkSound, setRemarkSound] = useState<Audio.Sound | null>(null);

  const setOpenAITts = () => {
    setTts("openAI");
    setVoiceOptions(openaiVoices);
    setVoices(Array(speakers.length).fill(openaiVoices[0].value));
  };

  const setNijivoiceTts = () => {
    setTts("nijivoice");
    setVoiceOptions(nijivoiceVoices);
    setVoices(Array(speakers.length).fill(nijivoiceVoices[0].value));
  };

  const handleBack = () => {
    if (audioUrl) {
      // サーバーのキャッシュを削除
      try {
        deleteNewAudio(scriptId);

        // 初期化
        setScriptId("");
        setRemarkAudioUrls([]);
        setAudioUrl("");
      } catch (err: any) {
        console.error(err);
        setError(err.message || "音声の削除に失敗しました");
        return;
      }
    }
    router.back();
  };

  const handleSubmit = async () => {
    // if (
    //   title.trim() === "" ||
    //   (speakers.length > 0 && speakers.some((speaker) => speaker.trim() === ""))
    // ) {
    //   setError("全ての必須項目を入力してください");
    //   return;
    // }

    try {
      setLoading(true);
      setError(null);
      const res = await postAudioTest(
        scriptData.script,
        tts,
        voices,
        speakers,
        scriptId
      );
      console.log("res", res);

      setScriptId(res.scriptId);
      setRemarkAudioUrls(res.mp3Urls);
      setAudioUrl(res.m3u8Url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "音声の作成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (
      title.trim() === "" ||
      (speakers.length > 0 && speakers.some((speaker) => speaker.trim() === ""))
    ) {
      setError("全ての必須項目を入力してください");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await postNewAudio(
        title,
        description ?? "",
        scriptData.script,
        "user_id",
        tts,
        voices,
        speakers,
        scriptId
      );
      console.log("res", res);
      router.replace({
        pathname: "/(tabs)/post",
        // params: { audioData: JSON.stringify(res) },
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "音声の作成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleRemarkPlay = async (index: number) => {
    try {
      // 既に再生中のサウンドがあれば解放する
      if (remarkSound) {
        await remarkSound.unloadAsync();
        setRemarkSound(null);
      }
      console.log("remarkAudioUrls", remarkAudioUrls);
      const { sound } = await Audio.Sound.createAsync(
        { uri: remarkAudioUrls[index] },
        { shouldPlay: true }
      );
      setRemarkSound(sound);
    } catch (error) {
      console.error("remark 音声の再生エラー", error);
    }
  };

  return (
    <View className="flex-1 bg-gray-900">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-grow"
          contentContainerStyle={{
            paddingBottom: tabBarHeight + insets.bottom + 20,
            paddingHorizontal: 16,
          }}
        >
          <View style={{ marginTop: topHeight }}>
            <TouchableOpacity
              onPress={handleBack}
              className="flex flex-row items-center self-start"
            >
              <Ionicons name="arrow-back" size={22} color="white" />
              <Text className="text-lg text-white ml-2">戻る</Text>
            </TouchableOpacity>
            <View className="mb-4">
              <Text className="text-3xl font-extrabold text-white text-center">
                音声設定
              </Text>
              <View className="h-1 w-16 bg-blue-400 rounded-full mx-auto mt-2" />
            </View>

            {/* タイトル入力フォーム */}
            <View className="mt-5 p-4 bg-gray-800 rounded-xl">
              <Text className="text-lg font-bold text-blue-400 mb-2">
                タイトル
              </Text>
              <TextInput
                placeholder="タイトルを入力してください（必須）"
                placeholderTextColor="#A0AEC0"
                value={title}
                onChangeText={setTitle}
                className="bg-gray-700 p-3 rounded-lg text-white"
              />
            </View>

            {/* 説明入力フォーム */}
            <View className="mt-5 p-4 bg-gray-800 rounded-xl mb-5">
              <Text className="text-lg font-bold text-blue-400 mb-2">説明</Text>
              <TextInput
                placeholder="説明を入力してください"
                placeholderTextColor="#A0AEC0"
                value={description}
                onChangeText={setDescription}
                className="bg-gray-700 p-3 rounded-lg text-white"
                multiline={true}
                numberOfLines={3}
              />
            </View>

            <View>
              <Text className="text-xl font-bold text-blue-400 mb-2">
                スクリプトの内容
              </Text>
            </View>

            {/* スクリプトの表示 */}
            {scriptData.script.map((item, index) => (
              // <View key={index} className="mb-4 p-4 bg-gray-800 rounded-xl">
              <View
                key={index}
                className="relative mb-4 p-4 bg-gray-800 rounded-xl"
              >
                {remarkAudioUrls.length > index && (
                  <TouchableOpacity
                    onPress={() => handleRemarkPlay(index)}
                    className="absolute top-2 right-2"
                  >
                    <Ionicons
                      name="play-circle-outline"
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                )}
                <Text className="text-lg font-bold text-blue-400">
                  {item.speaker}
                </Text>
                <TextInput
                  value={item.text}
                  onChangeText={(text) => {
                    // スクリプト全体をコピーして対象の項目の text を更新
                    const newScript = [...scriptData.script];
                    newScript[index] = { ...newScript[index], text };
                    setScriptData({ ...scriptData, script: newScript });
                  }}
                  className="text-base mt-1 text-white"
                  multiline
                  style={{ color: "white" }}
                />
                {item.caption && (
                  <Text className="text-sm text-gray-300 italic mt-1">
                    {item.caption}
                  </Text>
                )}
              </View>
            ))}
          </View>

          <View className="mt-5 p-4 bg-gray-800 rounded-xl">
            <Text className="text-lg font-bold text-blue-400 mb-2">
              音声モデル
            </Text>
            <View className="flex-row space-x-4">
              <TouchableOpacity
                onPress={setOpenAITts}
                className={`flex-1 p-3 rounded-lg ${
                  tts === "openAI"
                    ? "bg-indigo-600 border border-indigo-500"
                    : "bg-gray-700"
                }`}
              >
                <Text className="text-center font-medium text-white">
                  OpenAI
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={setNijivoiceTts}
                className={`flex-1 p-3 rounded-lg ${
                  tts === "nijivoice"
                    ? "bg-indigo-600 border border-indigo-500"
                    : "bg-gray-700"
                }`}
              >
                <Text className="text-center font-medium text-white">
                  にじボイス
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-5 p-4 bg-gray-800 rounded-xl">
            <Text className="text-lg font-bold text-blue-400 mb-2">
              話者の音声
            </Text>
            {speakers.map((speaker, index) => (
              <View key={index} className="mb-3">
                <Text className="text-base font-medium mb-1 text-white">
                  {speaker}
                </Text>
                <View className="bg-gray-700 rounded-lg">
                  <Picker
                    selectedValue={voices[index]}
                    onValueChange={(value) => {
                      const newVoices = [...voices];
                      newVoices[index] = value;
                      setVoices(newVoices);
                    }}
                    style={{ color: "white" }}
                  >
                    {voiceOptions.map((voice) => (
                      <Picker.Item
                        key={voice.value}
                        label={voice.label}
                        value={voice.value}
                        color="white"
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            ))}
          </View>

          {error && <Text className="text-red-500 text-sm mb-4">{error}</Text>}
          <TouchableOpacity
            onPress={handleSubmit}
            className="mt-4 bg-indigo-600 rounded-xl p-3"
          >
            <Text className="text-white text-lg font-bold text-center">
              {audioUrl ? "音声を再生成" : "音声を作成"}
            </Text>
          </TouchableOpacity>
          {audioUrl ? <AudioTest url={audioUrl} /> : null}

          {audioUrl && (
            <TouchableOpacity
              onPress={handleConfirm}
              className="mt-8 bg-indigo-600 rounded-xl p-3 border-2 border-white"
            >
              <Text className="text-white text-lg font-bold text-center">
                ポッドキャストを投稿
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      {loading && (
        <View className="absolute inset-0 justify-center items-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
    </View>
  );
};

export default SetAudioScreen;
