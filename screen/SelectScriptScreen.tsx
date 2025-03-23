import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SelectScriptScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handlePromptOption = () => {
    router.push({
      pathname: "/(tabs)/post/generate_script",
    });
  };

  const handleArticleOption = () => {
    router.push({
      pathname: "/(tabs)/post/convert_script",
    });
  };

  return (
    <View className="flex-1 bg-gray-900">
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <Text className="text-3xl font-extrabold text-white text-center mb-8 mt-8">
          スクリプト生成方法を選択
        </Text>
        <View className="flex flex-col items-center gap-10 mt-10">
          <TouchableOpacity
            onPress={handlePromptOption}
            className=" w-96 bg-indigo-600 py-4 rounded-xl shadow-lg px-8"
          >
            <View>
              <Text className="text-white text-2xl font-bold text-center">
                プロンプトによる自動生成
              </Text>
              <Text className="text-white text-sm text-center mt-2">
                あなたが入力したプロンプトをもとに、AIがスクリプトを自動生成します。
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleArticleOption}
            className="w-96 bg-indigo-600 py-4 rounded-xl shadow-lg px-8"
          >
            <View>
              <Text className="text-white text-2xl font-bold text-center">
                文書データをスクリプトに変換
              </Text>
              <Text className="text-white text-sm text-center mt-2">
                記事や論文などのテキストを解析し、スクリプトとして変換します。
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SelectScriptScreen;
