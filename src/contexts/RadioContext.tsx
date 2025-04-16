import { createContext } from "react";
import { ChannelItem } from "../types/channels";

type RadioContextType = {
  channels: ChannelItem[];
  selectedStation: ChannelItem | null;
  setSelectedStation: (station: ChannelItem | null) => void;
  playerRef: React.RefObject<HTMLAudioElement | null> | null;
  streamError: string | null;
  setRadioStreamError: (value: string | null) => void;
};

export const RadioContext = createContext<RadioContextType>({
  channels: [],
  selectedStation: null,
  setSelectedStation: () => {},
  playerRef: null,
  streamError: null,
  setRadioStreamError: () => {},
});
