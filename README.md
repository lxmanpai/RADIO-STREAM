# 🎧 Radio Streaming TV App

A smart TV-friendly radio streaming app built with **React**, **Vite**, and remote-friendly **arrow-key navigation**. Users can browse and play live radio streams, with support for error handling, visual focus styles, and custom audio controls.

## 🚀 Features

- 🔊 Stream internet radio (e.g. Radio Paradise)
- 🎮 Remote/keyboard navigation using custom `Focusable` components
- ⏯️ Play/Pause toggle with visual focus indicators
- ❌ Graceful error handling for stream issues
- 🧭 Auto focus handling (audio controls, seekbar)
- ⚡ Built with Vite for fast performance

## 📦 Tech Stack

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- Custom focus management (`useFocus` hook)
- Audio playback using native HTML `<audio>` tag

## 📂 Project Structure (Relevant Snippets)

/src ├── components/ │ ├── Player.tsx # Main radio player component │ ├── Focusable/Focusable # Wrapper for remote navigation ├── hooks/ │ ├── useFocus.ts # Custom focus key hook │ ├── useRadio.ts # Hook to manage radio logic and player ref ├── utils/ │ ├── constants.ts # Titles, error messages ├── styles/ │ ├── Player.css # Custom styling for focus, buttons, audio

## 🧑‍💻 Development

1. **Install dependencies**

   ```bash
   npm install
   ```

Run locally

```bash
npm run dev
```

Build for production

```bash
npm run build
```

📡 Stream Sample
This app works great with internet radio stream links like:

https://stream.radioparadise.com/mp3-128
🎨 UI Highlights
Gradient button with pink-purple styling

No default focus borders or white outlines

Audio player background removed for seamless TV UX

## 📌 TODO

- Add channel browsing UI
- Add volume control
- Add support for pause/resume with remote button
- Visual feedback on stream buffering or error

📄 License: MIT
