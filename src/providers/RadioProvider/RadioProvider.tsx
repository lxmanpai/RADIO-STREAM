import React, { useEffect, useRef, useState, useCallback } from "react";

import { CHANNEL_DATA } from "../../data/channelData";
import { ChannelItem } from "../../types/channels";
import { RadioContext } from "../../contexts/RadioContext";

export const RadioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [channels, setChannels] = useState<ChannelItem[]>([]);
  const [selectedStation, setSelectedStation] = useState<ChannelItem | null>(
    null
  );
  const [streamError, setStreamError] = useState<string | null>(null);
  const playerRef = useRef<HTMLAudioElement | null>(null);

  // Memoized function to set the radio stream error
  const setRadioStreamError = useCallback((error: string | null) => {
    setStreamError(error);
  }, []);

  // Update the audio player's source when the selected station changes
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.src = selectedStation?.link ?? "";
      playerRef.current.load();
    }
  }, [selectedStation]);

  // Initialize the channels state with static data
  useEffect(() => {
    setChannels(CHANNEL_DATA);
  }, []);

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = React.useMemo(
    () => ({
      channels,
      selectedStation,
      setSelectedStation,
      playerRef,
      streamError,
      setRadioStreamError,
    }),
    [
      channels,
      selectedStation,
      setSelectedStation,
      playerRef,
      streamError,
      setRadioStreamError,
    ]
  );

  return (
    <RadioContext.Provider value={contextValue}>
      {children}
    </RadioContext.Provider>
  );
};
