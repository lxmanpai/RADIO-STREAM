import { useContext } from "react";
import { RadioContext } from "../contexts/RadioContext";

export const useRadio = () => useContext(RadioContext);
