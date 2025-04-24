// ==UserScript==
// @name         ヤマレコプロフィール補足情報表示
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  ヤマレコのユーザープロフィールに補足情報を表示します
// @author       Bunatree
// @match        https://www.yamareco.com/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  // 補足情報の取得方法
  // localJson ... 当スクリプト内のuserData変数で記述（JSON形式）
  // googleSpreadsheet ... 別途Googleスプレッドシートとして作成する
  const obtainDataMethod = 'localJson'; // 'googleSpreadsheet' に変更可能

  // 補足情報の挿入位置 (before/after)
  const insertPosition = "before";

  // obtainDataMethodで「googleSpreadsheet」を指定した場合、
  // ここでスプレッドシートの公開URLまたはドキュメントIDを指定する
  const googleSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/XXXXXXXX/edit?usp=sharing';
  const googleSpreadsheetId = ''; // こちらにドキュメントIDを書く場合はgoogleSpreadsheetUrlを空にする

  const googleCsvUrl = (() => {
    const docId = googleSpreadsheetId ||
                  (googleSpreadsheetUrl.match(/spreadsheets\/d\/([^/]+)/) || [])[1];
    return docId
      ? `https://docs.google.com/spreadsheets/d/${docId}/export?format=csv`
      : null;
  })();

  // obtainDataMethodで「localJson」を指定した場合、
  // ここで補足情報をユーザーごとに定義する
  const localUserData = {
    "123": [
      { label: "名前", value: "山田太郎" },
      { label: "メモ", value: "身長が256cmあるナイスガイ。2023年8月に塔ノ岳でお会いして一緒に大倉尾根を下山。" },
      { label: "Facebook", value: "山田太郎 FB", url: "https://www.facebook.com/user/info/304904" },
      { label: "Instagram", value: "@hogehoge", url: "https://instagram.com/user/38495" },
      { label: "YAMAP", value: "YAMA DA TARO", url: "https://yamap.com/user/0000" },
      { label: "ブログ", url: "https://mydomain.com/blog/welcome.html" }
    ],
    "456": [
      { label: "名前", value: "山田花子" },
      { label: "メモ", value: "2022年6月に青ヶ岳山荘に泊まったときに一緒にブルーマウンテンを味わった。" }
    ]
  };

  const match = location.href.match(/userinfo-(\d+)-prof\.html/);
  if (!match) return;
  const userId = match[1];

  const tbody = document.querySelector('.profile_text_table tbody');
  if (!tbody) return;

  // もし補足情報が挿入済みだったら補足情報のテーブル行をすべて削除する
  // スクリプトの二重実行対策
  document.querySelectorAll('.profile_text_table .additional_info').forEach(el => el.remove());

  // 既存の最初の行を取得
  const refRow = tbody.rows[0];

  // プロフィールページに補足情報を表示
  function renderProfileInfo(info) {
    if (!info || info.length === 0) return;
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
        anchor.textContent = field.value || field.url;
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
  }

  function getLocalData(userId) {
    const info = localUserData[userId];
    if (info) {
      renderProfileInfo(info);
    }
  }

  // Googleスプレッドシートのヘッダーから改行や空白削除
  // ヘッダー文字を小文字化
  function cleanUpHeader(header) {
    return header.trim().toLowerCase();
  }

  function getSpreadsheetData(callback) {
    if (!googleCsvUrl) {
      console.error("GoogleスプレッドシートのURLまたはIDが正しく設定されていません");
      return;
    }
  
    fetch(googleCsvUrl)
      .then(res => res.text())
      .then(csvText => {
        const rows = csvText
          .trim()
          .split('\n')
          .map(row => row.split(',').map(cell => cell.trim()));
  
        const headers = rows[0].map(cleanUpHeader);
        const idxUserId = headers.indexOf('userid');
        const idxLabel = headers.indexOf('label');
        const idxValue = headers.indexOf('value');
        const idxUrl = headers.indexOf('url');
  
        if (idxUserId === -1 || idxLabel === -1 || idxValue === -1) {
          console.error("CSVヘッダーに必要な項目がありません");
          return;
        }
  
        const userData = {};
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const uid = row[idxUserId];
          if (!uid) continue;
          if (!userData[uid]) userData[uid] = [];
          userData[uid].push({
            label: row[idxLabel],
            value: row[idxValue],
            url: idxUrl !== -1 ? row[idxUrl] : undefined
          });
        }
  
        callback(userData);
      })
      .catch(err => {
        console.error("スプレッドシートの読み込みに失敗しました", err);
      });
  }

  // メイン処理実行
  if (obtainDataMethod === 'localJson') {
    const info = getLocalData(userId);
    if (info) renderProfileInfo(info);
  } else if (obtainDataMethod === 'googleSpreadsheet') {
    getSpreadsheetData(userData => {
      const info = userData[userId];
      if (info) {
        renderProfileInfo(info);
      } else {
        // console.warn('該当ユーザーのデータが見つかりませんでした。');
      }
    });
  }

})();
