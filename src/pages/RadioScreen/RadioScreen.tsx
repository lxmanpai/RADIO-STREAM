import { useEffect, useMemo } from "react";
import { useKeyNavigation } from "../../hooks/useKeyNavigation";

import ChannelList from "../../components/ChannelList/ChannelList";
import Player from "../../components/Player/Player";

import "./RadioScreen.css";
import { useFocus } from "../../hooks/useFocus";
import { useRadio } from "../../hooks/useRadio";

const RadioScreen = () => {
  const { setFocusedKey } = useFocus();
  const { channels } = useRadio();

  // Memoize focusable keys to avoid recalculating them on every render
  const focusableKeys = useMemo(
    () => [
      ...channels.map((chl) => `channel-${chl.id}`),
      "player-button",
      "seeker",
    ],
    [channels]
  );

  useEffect(() => {
    // Set the initial focus to the first focusable key if available
    if (focusableKeys.length > 0) {
      setFocusedKey(focusableKeys[0]);
    }
  }, [focusableKeys, setFocusedKey]);

  // Enable key navigation for the focusable elements
  useKeyNavigation(focusableKeys);

  return (
    <div className="radio-screen">
      {/* Render the list of channels */}
      <ChannelList channels={channels} />
      {/* Render the player */}
      <Player />
    </div>
  );
};

export default RadioScreen;
