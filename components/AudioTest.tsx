import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";

type AudioTestProps = {
  url: string;
};

const AudioTest: React.FC<AudioTestProps> = ({ url }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // オーディオを読み込みます
    const loadSound = async () => {
      try {
        const { sound: loadedSound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: false }
        );
        setSound(loadedSound);
      } catch (error) {
        console.error("サウンドの読み込みエラー", error);
      }
    };

    loadSound();

    // クリーンアップ: コンポーネントがアンマウントされる際にサウンドを解放
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [url]);

  const togglePlayback = async () => {
    if (!sound) return;
    try {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("再生切替エラー", error);
    }
  };

  return (
    <View className="p-4 bg-gray-800 rounded-xl mt-4">
      <Text className="text-lg font-bold text-blue-400 mb-2">
        音声プレビュー
      </Text>
      <TouchableOpacity
        onPress={togglePlayback}
        className="p-3 bg-indigo-600 rounded-xl"
      >
        <Text className="text-white text-center">
          {isPlaying ? "一時停止" : "再生"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AudioTest;
