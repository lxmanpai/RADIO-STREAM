import { useContext } from "react";
import { FocusContext } from "../contexts/FocusContext";

export const useFocus = () => useContext(FocusContext);
