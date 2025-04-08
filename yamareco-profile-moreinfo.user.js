// ==UserScript==
// @name         ヤマレコプロフィール補足情報表示
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  ヤマレコのユーザープロフィールに補足情報を表示します
// @author       Bunatree
// @match        https://www.yamareco.com/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // 追加情報の挿入位置 (before/after)
  const insertPosition = "before";

  // 追加情報をユーザーごとに定義
  const userData = {
    "123": [{
      label: "名前",
      value: "山田太郎"
    }, {
      label: "メモ",
      value: "身長が256cmある背の高いダンディ男性で、いつも赤い帽子と青いTシャツを着ている。2012年3月4日に蛭ヶ岳山頂で写真を撮影した際にお話し、共通話題がたくさんあって懇意になり、連絡先を交換した。"
    }, {
      label: "Facebook",
      value: "山田太郎",
      url: "https://www.facebook.com/user/info/304904"
    }, {
      label: "Instagram",
      value: "@komorebi",
      url: "https://instagram.com/user/38495"
    }, {
      label: "YAMAP",
      value: "YAMA DA TARO",
      url: "https://yamap.com/user/84055"
    }, {
      label: "Blog",
      url: "https://mydomain.com/blog/welcome.html"
    }],
    "456": [{
      label: "名前",
      value: "山田花子"
    }, {
      label: "メモ",
      value: "2022年6月に犬越路避難小屋でお会いする。2023年5月、一緒に富士箱根トレイル縦走。8月に檜洞沢で沢登り。"
    }]

  };

  const match = location.href.match(/userinfo-(\d+)-prof\.html/);
  if (!match) return;

  const userId = match[1];
  const info = userData[userId];
  if (!info || info.length === 0) return;

  const tbody = document.querySelector('.profile_text_table tbody');
  if (!tbody) return;

  // もし追加情報が挿入済みだったら追加情報のテーブル行をすべて削除する
  // スクリプトの二重実行対策
  document.querySelectorAll('.profile_text_table tbody .additional_info').forEach(
    el => el.remove());

  // 既存の最初の行を取得
  const refRow = tbody.rows[0];

  // 追加情報をループ処理
  info.forEach(field => {

    const row = document.createElement('tr');
    row.classList.add('profile_text_line', 'additional_info');

    const th = document.createElement('th');
    th.classList.add('profile_text_header');
    th.textContent = field.label;
    row.appendChild(th);

    const td = document.createElement('td');
    if (field.url) {
      const anchor = document.createElement('a');
      anchor.classList.add('additional_info_url');
      anchor.href = field.url;
      anchor.title = field.url;
      anchor.target = "_blank";
      anchor.textContent = (field.value) ? field.value : field.url;
      td.appendChild(anchor);
    } else {
      td.textContent = field.value;
    }
    row.appendChild(td);

    if (insertPosition === "before") {
      tbody.insertBefore(row, refRow);
    } else {
      tbody.appendChild(row);
    }

  });

})();
