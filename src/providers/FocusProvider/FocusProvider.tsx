import React, { useEffect, useMemo, useState } from "react";
import { FocusContext } from "../../contexts/FocusContext";
import { useKeyNavigation } from "../../hooks/useKeyNavigation";
import { useRadio } from "../../hooks/useRadio";

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [focusedKey, setFocusedKey] = useState("channel-0");
  const { channels } = useRadio();

  const contextValue = React.useMemo(
    () => ({
      focusedKey,
      setFocusedKey,
    }),
    [focusedKey, setFocusedKey]
  );

  const focusableKeys = useMemo(
    () => [
      ...channels.map((chl) => `channel-${chl.id}`),
      "thumbnail",
      "seeker",
    ],
    [channels]
  );

  useKeyNavigation(focusableKeys);

  useEffect(() => {
    // Set the initial focus to the first focusable key if available
    if (focusableKeys.length > 0) {
      setFocusedKey(focusableKeys[0]);
    }
  }, [focusableKeys, setFocusedKey]);

  return (
    <FocusContext.Provider value={contextValue}>
      {children}
    </FocusContext.Provider>
  );
};
