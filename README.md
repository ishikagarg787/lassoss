# 🧩 LassoSS

A modern Chrome extension for freeform (lasso-style) screenshot cropping directly inside the browser.

LassoSS allows users to capture screenshots of webpages and crop only the required region by drawing a custom freehand shape around the desired area.

Built using React, TypeScript, and Chrome Extension APIs.

---

## ✨ Features

* ✂️ Freeform lasso screenshot cropping
* 📸 Capture screenshots from active browser tab
* 🎨 Draw custom selection shapes
* ⚡ Automatic image download after selection
* 🔒 Fully local processing (privacy-friendly)
* 🧩 Lightweight and fast Chrome extension
* ⚛️ Built with React + TypeScript

---

## 🛠️ Tech Stack

| Technology            | Purpose               |
| --------------------- | --------------------- |
| React                 | Frontend UI           |
| TypeScript            | Type-safe development |
| Vite                  | Build Tool            |
| Chrome Extension APIs | Browser integration   |
| HTML5 Canvas          | Freeform drawing      |
| CSS3                  | Styling               |

---

## 📂 Project Structure

```text
LassoSS/
│
├── dist/
│
├── public/
│
├── src/
│   ├── App.tsx
│   ├── background.ts
│   ├── content.ts
│   └── main.tsx
│
├── manifest.json
├── package.json
├── vite.config.js
│
└── README.md
```

---

## 🚀 How to Use

### 1️⃣ Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_LINK
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Build Extension

```bash
npm run build
```

This generates the:

```text
dist/
```

folder required for Chrome Extension loading.

---

### 4️⃣ Open Chrome Extensions

Go to:

```text
chrome://extensions/
```

---

### 5️⃣ Enable Developer Mode

Turn on **Developer Mode** from the top-right corner.

---

### 6️⃣ Load Extension

Click:

```text
Load Unpacked
```

and select the:

```text
dist
```

folder.

---

### 7️⃣ Start Using LassoSS

* Open any webpage
* Click the **LassoSS** extension icon
* Capture screenshot
* Draw a freeform shape around the desired area
* Close the shape to finish selection
* Cropped image downloads automatically

---

## 📌 Notes

* Works only on the active browser tab
* All processing happens locally in the browser
* No screenshots or user data are uploaded or stored

---

## ⭐ Author

ISHIKA GARG

B.Tech CSE (AI & Data Analytics) '28

---

### ⭐ If you like this project

Give this repository a star on GitHub!

