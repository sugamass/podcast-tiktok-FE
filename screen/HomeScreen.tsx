import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { AudioItem } from "@/types/Audio";
import Podcast from "@/components/Podcast";
import { useLocalSearchParams } from "expo-router";
import { getAudioData } from "@/services/audio";
import setAudio from "@/app/(tabs)/post/set_audio";
import { useFocusEffect } from "@react-navigation/native";

interface HomeScreenProps {
  newAudioData: string;
}

const HomeScreen: React.FC<HomeScreenProps> = (props) => {
  // TODO asをやめる
  let newAudioData: AudioItem | undefined = undefined;
  if (props.newAudioData) {
    newAudioData = JSON.parse(props.newAudioData) as AudioItem;
    console.log("newAudioData2:", newAudioData);
  }

  const [audioDataList, setAudioDataList] = useState<AudioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("myposts");

  const [currentVisibleIndex, setCurrentVisibleIndex] = useState<number>(0);
  const screenHeight = Dimensions.get("window").height;

  const flatListRef = useRef<FlatList<AudioItem>>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[]; changed: any[] }) => {
      if (viewableItems && viewableItems.length > 0) {
        console.log(viewableItems);
        setCurrentVisibleIndex(viewableItems[0].index);
      }
    }
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  // TODO うまくいかないので一旦保留
  const handleAudioEnd = useCallback(() => {
    const nextIndex = currentVisibleIndex + 1;
    if (nextIndex < audioDataList.length) {
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentVisibleIndex(nextIndex);
    }
  }, [currentVisibleIndex, audioDataList.length]);

  const fetchAudioData = async () => {
    try {
      setLoading(true);
      setError(null);

      let user_id = undefined;
      if (selectedTab === "myposts") {
        // TODO ログイン機能ができたらユーザーIDを取得する
        user_id = "user_id";
      }
      const response = await getAudioData(selectedTab, user_id);
      setAudioDataList(response);
      setCurrentVisibleIndex(0);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 最初の一回だけ実行する
    // TODO ユーザーが投稿を何個かスクロールしたら再度APIを叩くようにする。
    if (audioDataList.length === 0) {
      fetchAudioData();
    }
    console.log("audioDataList:", audioDataList);
  }, []);

  useEffect(() => {
    fetchAudioData();
  }, [selectedTab]);

  useFocusEffect(
    useCallback(() => {
      fetchAudioData();
    }, [selectedTab])
  );

  // const handleLoadMore = () => {
  //   if (!loading) {
  //     console.log("Loading more...");
  //     setPage((prevPage) => prevPage + 1);
  //     fetchAudioData(page + 1);
  //   }
  // };

  return (
    <View className="flex-1 bg-black">
      <View className="absolute top-20 left-0 right-0 flex-row justify-center bg-transparent py-2 z-50">
        <TouchableOpacity>
          <Text
            className={`text-base font-bold mx-2 ${selectedTab === "following" ? "text-white" : "text-gray-400"}`}
          >
            フォロー中
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            className={`text-base font-bold mx-2 ${selectedTab === "recommended" ? "text-white" : "text-gray-400"}`}
          >
            おすすめ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab("myposts")}>
          <Text
            className={`text-base font-bold mx-2 ${selectedTab === "myposts" ? "text-white" : "text-gray-400"}`}
          >
            自分の投稿
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-2">データを取得中...</Text>
        </View>
      ) : (
        <FlatList
          data={audioDataList}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={{ height: screenHeight }}>
              <Podcast
                {...item}
                isActive={index === currentVisibleIndex}
                onAudioEnd={handleAudioEnd}
              />
            </View>
          )}
          pagingEnabled
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={viewabilityConfig}
          showsVerticalScrollIndicator={false}
          // onEndReached={handleLoadMore} // 10個スクロールしたときにAPIを叩く
          // onEndReachedThreshold={10} // 10個先に到達したら発火
        />
      )}
    </View>
  );
};

export default HomeScreen;
