# ヤマレコ プロフィール補足情報表示

ヤマレコのユーザープロフィールページに、事前に定義した補足情報（名前、SNSリンク、メモなど）を表示する Tampermonkey スクリプトです。

## 💡 機能

- 指定したユーザーIDごとに補足情報を定義可能
- 補足情報は、プロフィール表の冒頭または末尾に挿入
- 表示項目はラベルと値（リンクの場合はリンク表示）
- `Instagram`、`Facebook`、`YAMAP` などの外部リンクにも対応

## ⚙️ 利用方法

1. ブラウザー拡張機能の [Tampermonkey](https://www.tampermonkey.net/) をインストールしてください。
2. Chrome の場合、拡張機能の管理画面の「デベロッパーモード」をONにしてください。
3. Tampermonkey のダッシュボードから新規スクリプトを開き、userscript.js の内容をコピー＆ペーストしてください。
4. スクリプト内の `userData` に表示したいユーザーIDと情報を編集・追加してください。
5. 必要に応じて、補足情報の追加位置を `insertPosition` で指定します。（値は `before` または `after` を指定）

ユーザーIDは、プロフィールページURLの「NNNN」の部分です。
https://www.yamareco.com/modules/yamareco/userinfo-NNNN-prof.html

下記は、IDが「1234」と「5678」の2名のユーザーに関する設定例です。

- `label` ... プロフィール表の左側セルに見出しとして表示されます。
- `value` ... プロフィール表の右側セルにその内容として表示されます。
- `url` ... valueで指定された内容をリンクとして表示します。

```js
const userData = {
  "1234": [
    {
      label: "お名前",
      value: "山田太郎"
    },
    {
      label: "メモ",
      value: "2024年3月に蛭ヶ岳で出会った。"
    },
    {
      label: "Instagram",
      value: "taro_yama",
      url: "https://instagram.com/taro_yama"
    }
  ],
  "5678": [
    {
      label: "お名前",
      value: "山田花子"
    },
    {
      label: "コラボ山行履歴",
      value: "2024年8月 モロクボ沢、9月 檜洞沢"
    }
  ]
};
```

## 🛠️ 開発の経緯

ヤマレコのユーザーといつどこでお会いしたのか忘れてしまうことはありませんか？ 私自身が忘れっぽいことに加えて、ヤマレコのユーザー名が Facebook や YAMAP など他のSNSのユーザー名と異なるため、混乱することも多いです。

「いつどこでお会いしたのか」「他のSNSのどのユーザーとつながっているのか」を一元管理できるデータベースのようなものが欲しいと考えました。ヤマレコのプロフィールページに補足情報を追加することで、これを実現できるのではないかと思い、このスクリプトを開発しました。

このスクリプトを使うことで、他のユーザーとの再会時に話題をスムーズに共有できるようになると考えています。
