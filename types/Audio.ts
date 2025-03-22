export type AudioItem = {
  id: string;
  // audioUrl: number;
  audioUrl: string; //BEとの接続が完了したらstringのみにする
  imageUrl: number; // BEで画像対応できたらstringにする
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
};

export type AudioUrl = {
  m3u8Url: string;
  mp3Urls: string[];
  scriptId: string;
};
