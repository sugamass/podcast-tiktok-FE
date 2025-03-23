import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import Slider from "@react-native-community/slider";
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

const Podcast: React.FC<PostProps> = (props) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPause, setIsPause] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  // Animated.Value を用いてアイコンのフェードアウトを実装
  const [iconOpacity] = useState(new Animated.Value(1));
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

      // 再生状況の更新を監視
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis);
          setDuration(status.durationMillis ?? 0);
          if (status.didJustFinish && !status.isLooping) {
            props.onAudioEnd();
          }
        }
      });
    }
    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function handleFocusChange() {
      if (sound) {
        if (!isFocused) {
          // タブからフォーカスが外れたら一時停止
          await sound.pauseAsync();
        } else if (props.isActive && !isPause && isFocused) {
          await sound.playAsync();
        }
      }
    }
    handleFocusChange();
  }, [isFocused, sound, props.isActive, isPause]);

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
  }, [props.isActive, isPause, sound, isFocused]);

  // isPause の変更時に、アイコンの表示（フェードイン→フェードアウト）を実行
  useEffect(() => {
    // 初期表示（すぐに 1 に設定）
    iconOpacity.setValue(1);
    Animated.timing(iconOpacity, {
      toValue: 0,
      duration: 1000,
      delay: 500,
      useNativeDriver: true,
    }).start();
  }, [isPause, iconOpacity]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setIsPause((prev) => !prev)}
      className="flex-1 bg-black"
    >
      <View className="h-full w-full flex items-start justify-start">
        <View style={{ height: topHeight }} />
        <Image
          source={props.imageUrl}
          className="w-full h-full"
          style={{ height: imageHeight }}
        />

        <View className="absolute z-10 inset-0">
          {/* 中央にフェードアウトする再生／一時停止アイコン */}
          <Animated.View
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: [{ translateX: -20 }, { translateY: -20 }],
              opacity: iconOpacity,
            }}
          >
            {isPause ? (
              <Ionicons name="stop-circle-outline" size={70} color="white" />
            ) : (
              <Ionicons name="play-circle-outline" size={70} color="white" />
            )}
          </Animated.View>

          <View className="absolute bottom-56 left-4 right-12">
            <Text className="font-bold text-white mb-1 text-xl">
              {props.title}
            </Text>
            <Text className="text-white mb-1">作成日 {createdAt}</Text>
            <Text className="text-white mb-1">{props.description}</Text>
          </View>

          <View className="absolute bottom-40 right-2 items-center">
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

          {/* シークバーの実装 */}
          <View
            style={{
              position: "absolute",
              bottom: 90,
              left: 20,
              right: 20,
            }}
          >
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              onSlidingComplete={async (value) => {
                if (sound) {
                  await sound.setPositionAsync(value);
                }
              }}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ color: "#fff" }}>
                {(position / 1000).toFixed(0)}s
              </Text>
              <Text style={{ color: "#fff" }}>
                {(duration / 1000).toFixed(0)}s
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Podcast;
