import { useMemo } from "react";
import { useKeyNavigation } from "../../hooks/useKeyNavigation";

import ChannelList from "../../components/ChannelList/ChannelList";
import Player from "../../components/Player/Player";

import "./RadioScreen.css";
import { useRadio } from "../../hooks/useRadio";
import { PLAYER_FOCUS_POINTS } from "../../utils/constants";

const RadioScreen = () => {
  const { channels } = useRadio();

  // Memoize focusable keys to avoid recalculating them on every render
  const focusableKeys = useMemo(
    () => [
      ...channels.map((chl) => `channel-${chl.id}`),
      ...PLAYER_FOCUS_POINTS,
    ],
    [channels]
  );

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
