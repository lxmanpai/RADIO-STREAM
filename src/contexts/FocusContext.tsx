import { createContext } from "react";

type FocusContextType = {
  focusedKey: string;
  setFocusedKey: (key: string) => void;
};

export const FocusContext = createContext<FocusContextType>({
  focusedKey: "",
  setFocusedKey: () => {},
});
