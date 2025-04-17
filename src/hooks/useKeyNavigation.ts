import { useEffect, useState, useMemo, useCallback } from "react";
import { useFocus } from "./useFocus";
import { useRadio } from "./useRadio";

export const useKeyNavigation = (focusableKeys: string[]) => {
  const { focusedKey, setFocusedKey } = useFocus();
  const { setSelectedStation, channels, playerRef, setRadioStreamError } =
    useRadio();

  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Memoize the getChannelById function to avoid recalculating it on every render
  const getChannelById = useMemo(
    () => (id: number) => channels.find((channel) => channel.id === id) ?? null,
    [channels]
  );

  // Function to handle play/pause logic
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
    // Debounced keydown handler to prevent rapid key presses
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = focusableKeys.indexOf(focusedKey);
      let nextKey = null;

      switch (e.code) {
        case "ArrowDown":
          // Move focus down if not at the last item
          if (
            currentIndex < focusableKeys.length - 1 &&
            focusableKeys[currentIndex + 1] !== "thumbnail"
          ) {
            nextKey = focusableKeys[currentIndex + 1];
          }
          if (focusedKey === "thumbnail") {
            nextKey = "play";
            if (playerRef?.current) {
              playerRef.current.focus();
            }
          }
          break;

        case "ArrowUp":
          // Move focus up if not at the first item
          if (focusedKey !== "thumbnail" && currentIndex > 0) {
            nextKey = focusableKeys[currentIndex - 1];
          }
          if (focusedKey === "play") {
            nextKey = "thumbnail";
          }
          break;

        case "ArrowRight":
          // Move focus to the player if on a channel
          if (focusedKey.startsWith("channel-") && playerRef?.current) {
            setSelectedItem(focusedKey);
            nextKey = "thumbnail";
          }
          break;

        case "ArrowLeft":
          // Move focus back to the previously selected channel or the first channel
          if (focusedKey === "thumbnail") {
            nextKey = selectedItem ?? focusableKeys[0];
          }
          break;

        case "Enter":
          if (focusedKey.startsWith("channel-")) {
            // Select the channel and reset any stream errors
            setSelectedStation(
              getChannelById(parseInt(focusedKey.split("-")[1]))
            );
            setRadioStreamError(null);
          } else if (focusedKey === "play" && playerRef?.current) {
            handlePlayPause();
          }
          break;

        case "Space":
          // Play/pause logic for the player
          if (focusedKey === "play") {
            handlePlayPause();
          }
          break;

        default:
          return; // Early return for unhandled keys
      }

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
