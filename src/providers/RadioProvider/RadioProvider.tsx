import React, { useEffect, useRef, useState, useCallback } from "react";

import { CHANNEL_DATA } from "../../data/channelData";
import { ChannelItem } from "../../types/channels";
import { RadioContext } from "../../contexts/RadioContext";

export const RadioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State to store the list of available channels
  const [channels, setChannels] = useState<ChannelItem[]>([]);

  // State to store the currently selected radio station
  const [selectedStation, setSelectedStation] = useState<ChannelItem | null>(
    null
  );

  // State to store any stream-related errors
  const [streamError, setStreamError] = useState<string | null>(null);

  // Reference to the audio player element
  const playerRef = useRef<HTMLAudioElement | null>(null);

  // Memoized function to set the radio stream error
  // This ensures the function reference remains stable across renders
  const setRadioStreamError = useCallback((error: string | null) => {
    setStreamError(error);
  }, []);

  // Update the audio player's source whenever the selected station changes
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.src = selectedStation?.link ?? ""; // Set the audio source
      playerRef.current.load(); // Reload the audio player
    }
  }, [selectedStation]);

  // Initialize the channels state with static data on component mount
  useEffect(() => {
    setChannels(CHANNEL_DATA);
  }, []);

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = React.useMemo(
    () => ({
      channels, // List of available channels
      selectedStation, // Currently selected station
      setSelectedStation, // Function to update the selected station
      playerRef, // Reference to the audio player
      streamError, // Current stream error (if any)
      setRadioStreamError, // Function to update the stream error
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
    // Provide the radio context to all child components
    <RadioContext.Provider value={contextValue}>
      {children}
    </RadioContext.Provider>
  );
};
