import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { generateScriptGraph } from "@/graphAI/graph/GenerateScriptGraph";
import { postScript } from "@/services/script";
import { AllScriptData } from "@/types/Script";
import { Ionicons } from "@expo/vector-icons";

const PromptFormScreen = () => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [references, setReferences] = useState<string[]>([]);
  const [speakers, setSpeakers] = useState<string[]>([]);
  const [scriptPrompt, setScriptPrompt] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [script, setScript] = useState<AllScriptData>();

  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

  const handleReferenceChange = (index: number, value: string) => {
    const newReferences = [...references];
    newReferences[index] = value;
    setReferences(newReferences);
  };

  const addReferenceField = () => {
    setReferences([...references, ""]);
  };

  const removeReferenceField = (index: number) => {
    const newReferences = references.filter((_, i) => i !== index);
    setReferences(newReferences);
  };

  const handleSpeakerChange = (index: number, value: string) => {
    const newSpeakers = [...speakers];
    newSpeakers[index] = value;
    setSpeakers(newSpeakers);
  };

  const addSpeaker = () => {
    setSpeakers([...speakers, ""]);
  };

  const removeSpeaker = (index: number) => {
    const newSpeakers = speakers.filter((_, i) => i !== index);
    setSpeakers(newSpeakers);
  };

  const handleSwitch = () => {
    setIsSearch(!isSearch);
  };

  const handleSubmit = async () => {
    if (
      (references.length > 0 && references.some((ref) => ref.trim() === "")) ||
      (speakers.length > 0 && speakers.some((speaker) => speaker.trim() === ""))
    ) {
      setError("全ての必須項目を入力してください");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1回目はundefinedになる。2回目以降から有効になる
      const previousScripts = script?.previousScript?.concat(
        script.currentScript
      );

      const data = await postScript(
        scriptPrompt,
        isSearch,
        previousScripts,
        references,
        speakers
      );

      console.log("data", data);
      setScript(data);
      setReferences(data.currentScript.reference ?? []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "スクリプトの生成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    router.push({
      pathname: "/(tabs)/post/set_audio",
      params: { scriptData: JSON.stringify(script?.currentScript) },
    });
  };

  const handleBack = () => {
    router.back();
  };

  // if (loading) {
  //   return (
  //     <View className="flex-1 items-center justify-center bg-gray-800">
  //       <View className="bg-gray-700 p-8 rounded-3xl">
  //         <ActivityIndicator size="large" color="#FFFFFF" />
  //         <Text className="text-white text-center mt-4 font-medium">
  //           AIがスクリプトを作成中...
  //         </Text>
  //       </View>
  //     </View>
  //   );
  // }

  return (
    <View className="flex-1 bg-gray-900">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-grow"
          contentContainerStyle={{
            paddingBottom: tabBarHeight + 20,
            paddingTop: insets.top,
            paddingHorizontal: 16,
          }}
        >
          <TouchableOpacity
            onPress={handleBack}
            className="flex flex-row items-center self-start"
          >
            <Ionicons name="arrow-back" size={22} color="white" />
            <Text className="text-lg text-white ml-2">戻る</Text>
          </TouchableOpacity>
          <View className="mb-6 ">
            <Text className="text-3xl font-extrabold text-white text-center">
              スクリプト作成
            </Text>
            <View className="h-1 w-16 bg-blue-400 rounded-full mx-auto mt-2" />
          </View>

          {/* Generated Script Section */}
          {script?.currentScript.script &&
            script.currentScript.script.length > 0 && (
              <View className="mb-6">
                <Text className="text-xl font-bold text-blue-400 mb-2">
                  生成されたスクリプト
                </Text>
                <View className="bg-gray-800 rounded-xl p-2">
                  {script.currentScript.script.map((item, index) => (
                    <View
                      key={index}
                      className="mb-3 p-4 bg-gray-700 rounded-xl"
                    >
                      <Text className="text-lg font-bold text-blue-400">
                        {item.speaker}
                      </Text>
                      <TextInput
                        className="text-base mt-1 text-white"
                        value={item.text}
                        onChangeText={(newText) => {
                          const updatedScript = [
                            ...script.currentScript.script,
                          ];
                          updatedScript[index] = {
                            ...updatedScript[index],
                            text: newText,
                          };
                          setScript({
                            ...script,
                            currentScript: {
                              ...script.currentScript,
                              script: updatedScript,
                            },
                          });
                        }}
                        multiline
                      />
                      {item.caption && (
                        <Text className="text-sm text-gray-300 italic mt-1">
                          {item.caption}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}

          {/* Prompt Input Section */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-blue-400 mb-2">
              スクリプトの内容
            </Text>
            <TextInput
              className="bg-gray-800 rounded-xl p-4 text-white text-base min-h-[180px] border border-gray-700"
              placeholder="どのようなスクリプトを作成しますか？"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={scriptPrompt}
              onChangeText={setScriptPrompt}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Reference URLs Section */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-blue-400 mb-2">
              参照URL
            </Text>
            <View className="bg-gray-800 rounded-xl p-2">
              {references.map((ref, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <TextInput
                    className="flex-1 bg-gray-700 rounded-xl px-4 py-3 text-white"
                    placeholder="参照URLを入力（必須）"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={ref}
                    onChangeText={(text) => handleReferenceChange(index, text)}
                  />
                  <TouchableOpacity
                    onPress={() => removeReferenceField(index)}
                    className="ml-2 bg-red-500 w-10 h-10 rounded-full items-center justify-center"
                  >
                    <Text className="text-white text-lg font-bold">×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                onPress={addReferenceField}
                className="flex-row items-center justify-center bg-indigo-600 rounded-xl py-3 mt-2"
              >
                <Text className="text-white text-lg mr-2">+</Text>
                <Text className="text-white">参照URLを追加</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Speakers Section */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-blue-400 mb-2">
              登場人物
            </Text>
            <Text className="text-gray-300 text-sm mb-2">
              デフォルトはAnnouncer、Teacher、Student
            </Text>
            <View className="bg-gray-800 rounded-xl p-2">
              {speakers.map((speaker, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <TextInput
                    className="flex-1 bg-gray-700 rounded-xl px-4 py-3 text-white"
                    placeholder="登場人物名を入力（必須）"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={speaker}
                    onChangeText={(text) => handleSpeakerChange(index, text)}
                  />
                  <TouchableOpacity
                    onPress={() => removeSpeaker(index)}
                    className="ml-2 bg-red-500 w-10 h-10 rounded-full items-center justify-center"
                  >
                    <Text className="text-white text-lg font-bold">×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                onPress={addSpeaker}
                className="flex-row items-center justify-center bg-indigo-600 rounded-xl py-3 mt-2"
              >
                <Text className="text-white text-lg mr-2">+</Text>
                <Text className="text-white">登場人物を追加</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Option */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between bg-gray-800 rounded-xl p-4">
              <Text className="text-white text-lg font-medium">
                Web検索を利用する
              </Text>
              <Switch
                trackColor={{ false: "#3e3e3e", true: "#3b82f6" }}
                thumbColor={isSearch ? "#60a5fa" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={handleSwitch}
                value={isSearch}
              />
            </View>
          </View>

          {/* Error Message */}
          {error && <Text className="text-red-500 text-sm mb-4">{error}</Text>}

          {/* Action Buttons */}
          <View className="flex flex-col mb-6 mt-8 space-y-4 items-center">
            <TouchableOpacity
              className="bg-indigo-600 py-4 rounded-xl shadow-lg active:opacity-80 border-2 border-white w-72"
              onPress={handleSubmit}
            >
              <Text className="text-white text-lg font-bold text-center">
                AIにスクリプトの作成を依頼する
              </Text>
            </TouchableOpacity>

            {script && (
              <TouchableOpacity
                className="bg-green-600 py-4 rounded-xl shadow-lg active:opacity-80 border-2 border-white w-72 mt-4"
                onPress={handleConfirm}
              >
                <Text className="text-white text-lg font-bold text-center">
                  スクリプトを確定する
                </Text>
              </TouchableOpacity>
            )}
          </View>
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

export default PromptFormScreen;
