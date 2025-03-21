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
  Switch,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ScriptMeta, AllScriptData } from "@/types/Script";
import { postScript } from "@/services/script";
import { postAudio } from "@/services/audio";
import { Ionicons } from "@expo/vector-icons";

interface ReviseScriptScreenProps {
  originalScriptData: string;
}

const ReviseScriptScreen: React.FC<ReviseScriptScreenProps> = ({
  originalScriptData,
}) => {
  const router = useRouter();

  // TODO asをやめる
  const originalScriptDataObj = JSON.parse(originalScriptData) as ScriptMeta;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const tabBarHeight = useBottomTabBarHeight();
  const topHeight = useSafeAreaInsets().top;
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState(originalScriptDataObj.title);
  const [description, setDescription] = useState(
    originalScriptDataObj.description
  );

  const [scriptData, setScriptData] = useState<AllScriptData>(
    originalScriptDataObj.script
  );
  const [prompt, setPrompt] = useState("");
  const [references, setReferences] = useState<string[]>(
    scriptData.currentScript.reference ?? []
  );
  const [isSearch, setIsSearch] = useState(false);

  const handleReferenceChange = (index: number, value: string) => {
    const newReferences: string[] = [...references];
    newReferences[index] = value;
    setReferences(newReferences);
  };

  // 参照入力欄を追加する処理
  const addReferenceField = () => {
    setReferences([...references, ""]);
  };

  // 参照入力欄を削除する処理
  const removeReferenceField = (index: number) => {
    const newReferences = references.filter((_, i) => i !== index);
    setReferences(newReferences);
  };

  const handleRegenerateClick = async () => {
    if (
      !prompt.trim() ||
      (references.length > 0 && references.some((ref) => ref.trim() === ""))
    ) {
      setError("全ての必須項目を入力してください");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const previousScripts = scriptData.previousScript?.concat(
        scriptData.currentScript
      );
      const data = await postScript(
        prompt,
        isSearch,
        previousScripts,
        references
      );
      console.log("data", data);
      setScriptData(data);
      setPrompt("");
      setReferences(data.currentScript.reference ?? []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "スクリプトの再生成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async () => {
    // try {
    //   setLoading(true);
    //   setError(null);
    //   const res = await postAudio(
    //     title,
    //     description ?? "",
    //     scriptData.currentScript.script,
    //     "user_id",
    //     "openai",
    //     [],
    //     []
    //   );
    //   console.log("res", res);
    //   router.push({
    //     pathname: "/",
    //     params: { audioData: JSON.stringify(res) },
    //   });
    // } catch (err: any) {
    //   console.error(err);
    //   setError(err.message || "音声の作成に失敗しました");
    // } finally {
    //   setLoading(false);
    // }

    const scriptMetaData: ScriptMeta = {
      title: title,
      description: description,
      script: scriptData,
    };
    router.push({
      pathname: "/(tabs)/post/set_audio",
      params: { scriptData: JSON.stringify(scriptMetaData) },
    });
  };

  // if (loading) {
  //   return (
  //     <View className="flex-1 items-center justify-center bg-white">
  //       <ActivityIndicator size="large" color="#007AFF" />
  //     </View>
  //   );
  // }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gradient-to-br from-purple-400 to-blue-300"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {loading && (
        <View
          className="absolute top-0 left-0 right-0 bottom-0 flex-1 items-center justify-center bg-black/50"
          style={{ zIndex: 100 }}
        >
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}

      <ScrollView
        className="flex-grow p-5"
        contentContainerStyle={{
          paddingBottom: tabBarHeight + insets.bottom + 20,
        }}
      >
        <View style={{ marginTop: topHeight }}>
          <TouchableOpacity
            onPress={handleBack}
            className="flex flex-row items-center self-start"
          >
            <Ionicons name="arrow-back" size={22} color="black" />
            <Text className="text-lg">戻る</Text>
          </TouchableOpacity>
          <View className="mb-4">
            <Text className="text-3xl font-extrabold text-black text-center">
              スクリプト修正
            </Text>
          </View>
          <View className="mb-8 p-3 bg-white rounded-xl shadow-md">
            <Text className="text-lg font-bold">入力したプロンプト</Text>
            <Text className="text-base mt-1">
              {scriptData.currentScript.prompt}
            </Text>
          </View>

          {scriptData.currentScript.script.map((item, index) => (
            <View
              key={index}
              className="mb-4 p-3 bg-white rounded-xl shadow-md"
            >
              <Text className="text-lg font-bold">{item.speaker}</Text>

              <TextInput
                className="text-base mt-1 "
                value={item.text}
                onChangeText={(newText) => {
                  const updatedScript = [...scriptData.currentScript.script];
                  updatedScript[index] = {
                    ...updatedScript[index],
                    text: newText,
                  };
                  setScriptData({
                    ...scriptData,
                    currentScript: {
                      ...scriptData.currentScript,
                      script: updatedScript,
                    },
                  });
                }}
                multiline
              />

              {item.caption && (
                <Text className="text-sm text-gray-500 italic mt-1">
                  {item.caption}
                </Text>
              )}
            </View>
          ))}

          {references.map((ref, index) => (
            <View key={index} className="flex-row items-center mb-4">
              <TextInput
                className="flex-1 h-12 border border-gray-300 rounded-xl px-3 text-base bg-white shadow-md"
                placeholder="参照URL[必須]"
                value={ref}
                onChangeText={(text) => handleReferenceChange(index, text)}
              />
              <TouchableOpacity onPress={() => removeReferenceField(index)}>
                <Text className="ml-2 text-red-500">削除</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={addReferenceField}>
            <Text className="text-blue-500 mb-4">参照URLを追加する</Text>
          </TouchableOpacity>

          <TextInput
            className="flex-1 border border-gray-300 rounded-xl mb-4 px-3 text-base min-h-[200px] bg-white shadow-md"
            placeholder="修正プロンプト"
            value={prompt}
            onChangeText={setPrompt}
            multiline
            textAlignVertical="top"
          />
          <View className="flex-row items-center mb-4">
            <Text className="text-black text-xl font-bold mr-1">検索する</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor="#f4f3f4"
              ios_backgroundColor="#3e3e3e"
              onValueChange={setIsSearch}
              value={isSearch}
            />
          </View>
          <TouchableOpacity
            className="items-center self-start"
            onPress={handleRegenerateClick}
          >
            <Text className="text-black text-xl font-bold mb-4">再生成</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center self-start"
            onPress={handleSubmit}
          >
            <Text className="text-black text-xl font-bold">
              スクリプトを確定する
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ReviseScriptScreen;
