import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AudioItem } from "@/types/Audio";
import { Audio } from "expo-av";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";

type PostProps = AudioItem & {
  isActive: boolean;
  onAudioEnd: () => void;
};

const podcast: React.FC<PostProps> = (props) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPause, setIsPause] = useState(false);
  const isFocused = useIsFocused();

  const tabBarHeight = useBottomTabBarHeight();
  const topHeight = useSafeAreaInsets().top;

  const date = new Date(props.createdAt);
  const formattedDate = date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const createdAt = `${formattedDate} ${formattedTime}`;

  const imageHeight =
    Dimensions.get("window").height - tabBarHeight - topHeight;

  useEffect(() => {
    async function loadSound() {
      const { sound } = await Audio.Sound.createAsync(
        { uri: props.audioUrl },
        { shouldPlay: false, isLooping: false }
      );
      setSound(sound);
    }
    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    async function handleFocusChange() {
      if (sound) {
        if (!isFocused) {
          // When tab loses focus, pause the audio
          await sound.pauseAsync();
        } else if (props.isActive && !isPause && isFocused) {
          // Only resume playing if this post is active, not paused, and tab is focused
          await sound.playAsync();
        }
      }
    }
    handleFocusChange();
  }, [isFocused, sound, props.isActive, isPause]);

  // isActiveの変化に合わせて再生/一時停止
  useEffect(() => {
    async function controlAudio() {
      if (sound && isFocused) {
        if (props.isActive && !isPause) {
          await sound.playAsync();
        } else {
          await sound.pauseAsync();
        }
      }
    }
    controlAudio();
  }, [props.isActive, isPause, sound]);

  // useEffect(() => {
  //   const isSound = sound ? true : false;
  //   // console.log("title", props.title);
  //   // console.log("soundeffect", isSound);
  // }, [sound]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setIsPause((prev) => !prev)}
      className="flex-1  bg-black"
    >
      <View className="h-full w-full flex items-start justify-start">
        <View style={{ height: topHeight }} />
        <Image
          source={props.imageUrl}
          className="w-full h-full"
          style={{ height: imageHeight }}
        />

        <View className="absolute z-10 inset-0">
          {!isPause && (
            <View className="absolute top-1/2 -translate-y-2 self-center">
              {/* <Ionicons
                name="ios-play"
                size={30}
                color="white"
                style={{ opacity: 0.8 }}
              /> */}
            </View>
          )}

          {/* 上部テキスト */}
          {/* <View className="flex-row items-center justify-center mt-20">
            <Text className="text-base text-white font-bold">フォロー中</Text>
            <Text className="text-base text-gray-300 font-bold ml-2">
              おすすめ
            </Text>
            <Text className="text-base text-gray-300 font-bold ml-2">
              自分の投稿
            </Text>
          </View> */}

          {/* 左下テキスト・動画情報 */}
          <View className="absolute bottom-40 left-4 right-12">
            <Text className="font-bold text-white mb-1 text-xl">
              {props.title}
            </Text>
            <Text className=" text-white mb-1">作成日 {createdAt}</Text>
            <Text className="text-white mb-1">{props.description}</Text>
          </View>

          {/* 右下の各種ボタン */}
          <View className="absolute bottom-28 right-2 items-center">
            {/* プロフィール（フォローボタン） */}
            <TouchableOpacity className="mb-5 items-center">
              <View className="border-2 border-white rounded-full">
                <Image
                  className="h-11 w-11 rounded-full"
                  source={{
                    uri: "https://placehold.jp/30/74a7fe/000000/150x150.png?text=GraphAI%0APodcast",
                  }}
                />
              </View>
              <View className="absolute top-9 left-0 right-0 items-center">
                <View className="bg-red-500 rounded-full p-0.5">
                  <Ionicons name="add-outline" size={16} color="white" />
                </View>
              </View>
              {/* <Text className="text-base text-white mt-3">
                {props.createdBy}
              </Text> */}
            </TouchableOpacity>

            <View className="mb-5 items-center">
              <TouchableOpacity>
                <Ionicons
                  name="heart-outline"
                  size={30}
                  color="white"
                  style={{ opacity: 0.8 }}
                />
              </TouchableOpacity>
              <Text className="text-white">100</Text>
            </View>
            <View className="mb-5 items-center">
              <TouchableOpacity>
                <Ionicons
                  name="chatbubble-outline"
                  size={30}
                  color="white"
                  style={{ opacity: 0.8 }}
                />
              </TouchableOpacity>
              <Text className="text-white">200</Text>
            </View>
            <View className="mb-5 items-center">
              <TouchableOpacity>
                <Ionicons
                  name="bookmark-outline"
                  size={30}
                  color="white"
                  style={{ opacity: 0.8 }}
                />
              </TouchableOpacity>
              <Text className="text-white">300</Text>
            </View>
            <View className="mb-5 items-center">
              <TouchableOpacity>
                <Ionicons
                  name="arrow-redo-outline"
                  size={30}
                  color="white"
                  style={{ opacity: 0.8 }}
                />
              </TouchableOpacity>
              <Text className="text-white">400</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default podcast;
