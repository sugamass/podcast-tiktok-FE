import { Stack } from "expo-router";

export default function PostLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "SelectScript" }} />
      <Stack.Screen
        name="generate_script"
        options={{ title: "GenerateScript" }}
      />
      <Stack.Screen
        name="convert_script"
        options={{ title: "ConvertScript" }}
      />
      <Stack.Screen name="set_audio" options={{ title: "AudioSetting" }} />
    </Stack>
  );
}
