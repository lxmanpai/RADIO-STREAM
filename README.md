# 🎧 Radio Streaming TV App

A smart TV-friendly radio streaming app built with **React**, **Vite**, and remote-friendly **arrow-key navigation**. This app allows users to browse and play live radio streams with support for error handling, visual focus styles, and custom audio controls. It is optimized for TV environments and remote control navigation.

---

## 🚀 Features

- **🔊 Stream Internet Radio**: Play live radio streams using URLs (e.g., Radio Paradise).
- **🎮 Remote/Keyboard Navigation**: Navigate the app using arrow keys or a remote control, thanks to custom `Focusable` components.
- **⏯️ Play/Pause Toggle**: Easily toggle playback with a single button press or by clicking the play/pause button.
- **❌ Error Handling**: Graceful handling of stream errors with visual feedback.
- **🧭 Auto Focus Management**: Automatically focus on key UI elements like the audio controls or seek bar.
- **⚡ Built with Vite**: Enjoy fast performance and a smooth development experience.

---

## 📦 Tech Stack

- **[React](https://reactjs.org/)**: For building the user interface.
- **[Vite](https://vitejs.dev/)**: For fast builds and development.
- **Custom Hooks**:
  - `useFocus`: Manages focus for remote/keyboard navigation.
  - `useRadio`: Handles radio logic and player references.
- **HTML `<audio>` Tag**: For native audio playback.

---

## 📂 Project Structure

```
/src
├── components/
│   ├── Player              # Main radio player component
│   ├── Focusable/Focusable # Wrapper for remote navigation
├── hooks/
│   ├── useFocus.ts         # Custom focus key hook
│   ├── useRadio.ts         # Hook to manage radio logic and player ref
├── providers/
│   ├── FocusProvider       # Provider for focus navigations
│   ├── RadioProvider       # Provider to handle radio data and playback
├── utils/
│   ├── constants.ts        # Titles, error messages
```

---

## 🧑‍💻 Development

### 1. **Install Dependencies**

Run the following command to install all required dependencies:

```bash
npm install
```

### 2. **Run Locally**

Start the development server:

```bash
npm run dev
```

This will launch the app locally. Open your browser and navigate to the provided URL (usually `http://localhost:3000`).

### 3. **Build for Production**

To create a production-ready build, run:

```bash
npm run build
```

This will generate optimized files in the `dist` folder.

---

## 📡 Stream Sample

This app works great with internet radio stream links. For example:

- [Radio Paradise](https://stream.radioparadise.com/mp3-128)

Simply provide a valid stream URL, and the app will handle playback.

---

## 🕹️ How to Use the App

1. **Launch the App**:

   - Open the app in your browser or deploy it to a smart TV environment.

2. **Navigate with Arrow Keys**:

   - Use the arrow keys on your keyboard or remote to move between focusable elements (e.g., channels, play button).

3. **Play a Stream**:

   - Select a channel or enter a stream URL to start playback.

4. **Control Playback**:

   - Use the "Enter" or "Space" key to toggle play/pause.
   - Alternatively, click the **Play/Pause** button on the screen to control playback.

5. **Seekbar Behavior**:

   - The seekbar is **not draggable** and always reflects the current playback progress for live audio streams.
   - Since live streams have no defined endpoint (the duration is effectively infinite), the seekbar is designed to play continuously without allowing manual seeking.

6. **Error Handling**:

   - If a stream fails to load, the app will display an error message.

---

## 📌 TODO

- Add channel browsing UI.
- Add volume control.
- Add support for pause/resume with remote button.
- Provide visual feedback for stream buffering or errors.

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute it as needed.

---

Let me know if you need further updates or additional sections!
