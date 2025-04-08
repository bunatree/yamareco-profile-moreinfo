# yamareco-profile-moreinfo

Tampermonkey userscript that enhances user profile pages on [Yamareco](https://www.yamareco.com/) by displaying additional personal information, notes, and links for specific users.

## 📌 Features

- Adds custom info fields (e.g., name, notes, social media links) to Yamareco user profiles
- Supports rich links with clickable URLs
- Smart fallback: if display name is missing, it shows the URL itself
- Lightweight and non-intrusive
- Easy to configure per user

## 🚀 Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser.
2. [Click here to install the script](https://raw.githubusercontent.com/your-username/yamareco-profile-moreinfo/main/yamareco-profile-moreinfo.user.js)
3. Customize the script by editing the `userData` object inside the code.

## 🛠️ How to Customize

Edit the script directly in Tampermonkey to add or update entries for each user:

```js
const userData = {
  "1234": [
    {
      label: "Name",
      value: "Taro Yamada"
    },
    {
      label: "Memo",
      value: "Met at Mt. Hirugatake summit on April 5, 2023."
    },
    {
      label: "Instagram",
      value: "Komorebi-kun",
      url: "https://instagram.com/user/38495"
    }
  ],
  // Add more users by ID
};

