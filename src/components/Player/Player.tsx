import { useFocus } from "../../hooks/useFocus";
import { useRadio } from "../../hooks/useRadio";
import { STREAM_ERROR } from "../../utils/constants";
import Focusable from "../Focusable/Focusable";

import "./Player.css";

const Player = () => {
  const { focusedKey, setFocusedKey } = useFocus();
  const { selectedStation, playerRef, streamError, setRadioStreamError } =
    useRadio();

  // Handle audio error events
  const handleAudioError = (
    e: React.SyntheticEvent<HTMLAudioElement, Event>
  ) => {
    console.error("Audio failed to load", e);
    setRadioStreamError(STREAM_ERROR);
  };

  return (
    <div className="player-container">
      {selectedStation ? (
        <div>
          {/* Play/Pause button */}
          <div className="show-name">Melody Time</div>
          <Focusable
            focusKey="thumbnail"
            focusStyles={false}
            isFocused={focusedKey === "thumbnail"}
            onFocus={() => setFocusedKey("thumbnail")}
          >
            <img
              className={`thumbnail ${
                focusedKey === "thumbnail" ? "focused-shadow" : ""
              }`}
              src={selectedStation.thumbnail}
            />
          </Focusable>

          <div className="controls">
            <Focusable
              focusKey="seeker"
              focusStyles={false}
              customClassname={`seeker-focusable ${
                focusedKey === "seeker" ? "focused-shadow" : ""
              }`}
              isFocused={focusedKey === "seeker"}
              onFocus={() => setFocusedKey("seeker")} // Focus the seekbar on focus
            >
              <audio
                autoPlay
                ref={playerRef}
                className="audio-player"
                controls
                onError={handleAudioError}
              >
                <source src={selectedStation?.link} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </Focusable>
          </div>

          {/* Display stream error if any */}
          {streamError && <div className="stream-error">{streamError}</div>}

          {/* Station details */}
          <div className="station-details">
            <div className="title-section">
              <div className="station-title">{selectedStation?.title}</div>
              {!!selectedStation?.rating && (
                <div className="ratings">⭐{selectedStation?.rating}</div>
              )}
            </div>
            <div className="v-divider"></div>
            <div className="other-details">1 watching</div>
            <div className="v-divider"></div>
            <div className="other-details">{selectedStation?.description}</div>
          </div>
        </div>
      ) : (
        <div className="title">Please select a station</div>
      )}
    </div>
  );
};

export default Player;
