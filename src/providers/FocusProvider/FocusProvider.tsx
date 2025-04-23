import React, { useEffect, useMemo, useState } from "react";
import { FocusContext } from "../../contexts/FocusContext";
import { useKeyNavigation } from "../../hooks/useKeyNavigation";
import { useRadio } from "../../hooks/useRadio";
import { PLAYER_FOCUS_POINTS } from "../../utils/constants";

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State to track the currently focused key
  const [focusedKey, setFocusedKey] = useState("channel-0");

  // Get the list of available channels from the radio context
  const { channels } = useRadio();

  // Memoized context value to avoid unnecessary re-renders
  const contextValue = React.useMemo(
    () => ({
      focusedKey,
      setFocusedKey,
    }),
    [focusedKey, setFocusedKey]
  );

  // Generate a list of focusable keys based on the available channels
  // Includes "thumbnail" and "play" as additional focusable elements
  const focusableKeys = useMemo(
    () => [
      ...channels.map((chl) => `channel-${chl.id}`),
      ...PLAYER_FOCUS_POINTS,
    ],
    [channels]
  );

  // Hook to handle key navigation between focusable elements
  useKeyNavigation(focusableKeys);

  useEffect(() => {
    // Set the initial focus to the first focusable key (e.g., the first channel)
    if (focusableKeys.length > 0) {
      setFocusedKey(focusableKeys[0]);
    }
  }, [focusableKeys, setFocusedKey]);

  return (
    // Provide the focus context to all child components
    <FocusContext.Provider value={contextValue}>
      {children}
    </FocusContext.Provider>
  );
};
