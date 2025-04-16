import React, { useState } from "react";
import { FocusContext } from "../../contexts/FocusContext";

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [focusedKey, setFocusedKey] = useState("channel-0");

  const contextValue = React.useMemo(
    () => ({
      focusedKey,
      setFocusedKey,
    }),
    [focusedKey, setFocusedKey]
  );

  return (
    <FocusContext.Provider value={contextValue}>
      {children}
    </FocusContext.Provider>
  );
};
