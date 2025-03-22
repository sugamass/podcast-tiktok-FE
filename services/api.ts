export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

// 共通の fetch 関数（エラーハンドリング付き）
export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const contentLength = response.headers.get("content-length");
    const contentType = response.headers.get("content-type");

    if (!contentLength || contentLength === "0") {
      return;
    }

    return await response.json();
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
};
