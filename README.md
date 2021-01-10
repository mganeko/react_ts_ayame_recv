# React.js/TypeScript - Ayame Labo Recieve only Example

React.js and TypeScript exmaple for [Ayame Labo](https://ayame-labo.shiguredo.jp).

これは WebRTCシグナリングサービスの[Ayame Labo](https://ayame-labo.shiguredo.jp) 向けの、React.js/TypeScript によるサンプルです。

- [ayame-web-sdk](https://github.com/OpenAyame/ayame-web-sdk) を利用しています(Apache 2.0 ライセンス)

## LICENSE / ライセンス

- MIT LICENSE / MITライセンス


# 利用方法

## 事前準備

- GitHub アカウントで、[Ayame Labo](https://ayame-labo.shiguredo.jp) にサインアップ
- シグナリングキーを取得

## GitHub Pages で実行

送信側
- ブラウザを起動、 https://mganeko.github.io/reactjs_ayame/ にアクセス
- SignalingKey: に Ayame Labo のシグナリングキーを入力
- Room: にルーム名(Channel名)を入力
  - Username@RoomID の形式 
- [Start Video]ボタンをクリック
- [Coonect]ボタンをクリックして接続

受信側

- ブラウザを起動、 https://mganeko.github.io/react_ts_ayame_recv/ にアクセス
- SignalingKey: に Ayame Labo のシグナリングキーを入力
- Room: にルーム名(Channel名)を入力
  - Username@RoomID の形式 
- [Coonect]ボタンをクリックして接続

URLを次の形式で指定することで、シグナリングキーとルーム名を指定可能

- https://mganeko.github.io/react_ts_ayame_recv/?room=ルーム名&key=シグナリングキー


## 開発環境で実行

- $ git clone https://github.com/mganeko/react_ts_ayame_recv.git
- $ cd react_ts_ayame_recv
- $ npm install 
- $ npm start
- http:localhost:3000 にブラウザでアクセス
- その後は GitHub Pages の例と同様 

## 自分のサーバーで実行

- $ git clone https://github.com/mganeko/react_ts_ayame_recv.git
- $ cd react_ts_ayame_recv
- $ npm install 
- $ npm run build
- build/ 以下をWebサーバーに配置(要https)
- 配置したWebサーバーにブラウザーでアクセス
- その後は GitHub Pages の例と同様 


