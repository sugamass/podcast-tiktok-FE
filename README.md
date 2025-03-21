# 📱 Podcast Tiktok

React Native + Expo を使って構築された音声ポッドキャストアプリです。ユーザーは音声コンテンツを視聴したり、自身のポッドキャストを投稿できます。

## 🚀 特徴

- Expo SDK + React Native によるクロスプラットフォーム開発（iOS / Android）
- 縦スクロールでポッドキャストを次々に再生（TikTok風UI）
- 音声プレイヤーに `expo-av` を使用

## 🛠 技術スタック

### フロントエンド
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Navigation](https://reactnavigation.org/)
- [Tailwind CSS (via NativeWind)](https://www.nativewind.dev/)
- [expo-av](https://docs.expo.dev/versions/latest/sdk/av/) - 音声再生用ライブラリ

### バックエンド

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/) - REST API 開発
- [PostgreSQL] - データベース

## 🎥 デモ
[podcast作成機能と再生機能](https://github.com/sugamass/podcast-tiktok-FE/issues/1)

## 📦 インストール方法（Mac + Xcode 編）

### 1. 前提条件

以下のソフトウェアがインストールされている必要があります：

- [Node.js (v18以上推奨)](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Xcode（iOSシミュレータ用）](https://apps.apple.com/jp/app/xcode/id497799835?mt=12)
- [Expo Go アプリ（スマホでテスト用）](https://expo.dev/client)
> 💡 Androidでテストしたい場合は Android Studio + エミュレータが必要です

[参考]  
https://deku.posstree.com/react-native/install-on-mac/  
react-nativeの環境構築の際、こちらの記事が参考になります。

https://qiita.com/hotehote/items/b4c4ba9c175547f8209a  
expo、xcode、androidStudioのインストールはこちらが参考になります。


---

### 2. このリポジトリをクローン

```sh
git clone https://github.com/sugamass/podcast-tiktok-FE.git
```

### 3. envファイルを作成

```
EXPO_PUBLIC_API_URL=http://localhost:3000
```
>実機テストをする場合はlocalhostの部分をPCのIPアドレスに変える必要があります。


## 4. アプリの起動

### 開発サーバーの起動
[BEリポジトリ](https://github.com/sugamass/podcast-tiktok-BE) を参考にAPIサーバーを立ち上げてください。

次に、以下のコマンドでアプリを起動します。
```sh
npm install
npm run start
```
