import React, { useMemo } from "react";

import Focusable from "../Focusable/Focusable";
import { useFocus } from "../../hooks/useFocus";

import "./ChannelList.css";
import { ChannelItem } from "../../types/channels";

// Defining the props type for the ChannelList component
type Props = {
  channels: ChannelItem[];
};

const ChannelList: React.FC<Props> = ({ channels }) => {
  const { focusedKey, setFocusedKey } = useFocus();

  // Memoize the rendered list of channels to avoid unnecessary re-renders
  const renderedChannels = useMemo(
    () =>
      channels.map((channel) => {
        const key = `channel-${channel.id}`; // Unique key for each channel

        // Handler for setting focus
        const handleFocus = () => setFocusedKey(key);

        return (
          <Focusable
            key={key}
            focusKey={key} // Unique focus key for the Focusable component
            focusStyles={true}
            isFocused={focusedKey === key} // Check if the current item is focused
            onFocus={handleFocus}
          >
            <div className="channel-item">
              <div className="channel-serial">{channel.serial}</div>
              <div className="channel-title">{channel.title}</div>
            </div>
          </Focusable>
        );
      }),
    [channels, focusedKey, setFocusedKey]
  );

  return (
    <div className="channel-container">
      {/* Header for the channel list */}
      <div className="channel-header">Jordan Radio</div>
      <div className="channel-list">{renderedChannels}</div>
    </div>
  );
};

export default ChannelList;
