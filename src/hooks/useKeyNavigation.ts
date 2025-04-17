import { useEffect, useState, useMemo, useCallback } from "react";
import { useFocus } from "./useFocus";
import { useRadio } from "./useRadio";
import { PLAYER_FOCUS_POINTS } from "../utils/constants";

export const useKeyNavigation = (focusableKeys: string[]) => {
  const { focusedKey, setFocusedKey } = useFocus();
  const { setSelectedStation, channels, playerRef, setRadioStreamError } =
    useRadio();

  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Memoized function to get a channel by its ID
  // This avoids recalculating the function on every render
  const getChannelById = useMemo(
    () => (id: number) => channels.find((channel) => channel.id === id) ?? null,
    [channels]
  );

  // Function to handle play/pause logic for the audio player
  const handlePlayPause = useCallback(() => {
    if (playerRef?.current) {
      const isPlaying =
        playerRef?.current &&
        !playerRef?.current.paused &&
        !playerRef?.current.ended &&
        playerRef?.current.readyState > 2;
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
    }
  }, [playerRef]);

  useEffect(() => {
    // Keydown handler to manage navigation and actions
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = focusableKeys.indexOf(focusedKey); // Get the current focus index
      let nextKey = null; // Variable to store the next focusable key

      switch (e.code) {
        case "ArrowDown":
          // Move focus down if not at the last item
          if (
            currentIndex < focusableKeys.length - 1 &&
            focusableKeys[currentIndex + 1] !== "thumbnail"
          ) {
            nextKey = focusableKeys[currentIndex + 1];
          }
          // Special case: Move focus from "thumbnail" to "play"
          if (focusedKey === "thumbnail") {
            nextKey = "play";
            if (playerRef?.current) {
              playerRef.current.focus(); // Focus the player element
            }
          }
          break;

        case "ArrowUp":
          // Move focus up if not at the first item
          if (focusedKey !== "thumbnail" && currentIndex > 0) {
            nextKey = focusableKeys[currentIndex - 1];
          }
          // Special case: Move focus from "play" to "thumbnail"
          if (focusedKey === "play") {
            nextKey = "thumbnail";
          }
          break;

        case "ArrowRight":
          // Move focus to the player if currently on a channel
          if (focusedKey.startsWith("channel-") && playerRef?.current) {
            setSelectedItem(focusedKey); // Save the currently selected channel
            nextKey = "thumbnail";
          }
          break;

        case "ArrowLeft":
          // Move focus back to the previously selected channel or the first channel
          if (PLAYER_FOCUS_POINTS.includes(focusedKey)) {
            nextKey = selectedItem ?? focusableKeys[0];
          }
          break;

        case "Enter":
          // Handle "Enter" key actions
          if (focusedKey.startsWith("channel-")) {
            // Select the channel and reset any stream errors
            setSelectedStation(
              getChannelById(parseInt(focusedKey.split("-")[1]))
            );
            setRadioStreamError(null); // Clear any existing stream errors
          } else if (focusedKey === "play" && playerRef?.current) {
            handlePlayPause(); // Toggle play/pause
          }
          break;

        case "Space":
          // Handle "Space" key for play/pause
          if (focusedKey === "play") {
            handlePlayPause();
          }
          break;

        default:
          return; // Early return for unhandled keys
      }

      // Update the focused key if a valid next key is determined
      if (nextKey) {
        setFocusedKey(nextKey);
      }
    };

    // Add the keydown event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on unmount
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    focusedKey,
    setFocusedKey,
    focusableKeys,
    setSelectedStation,
    selectedItem,
    getChannelById,
    handlePlayPause,
    playerRef,
    setRadioStreamError,
  ]);
};
