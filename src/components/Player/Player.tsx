import { useFocus } from "../../hooks/useFocus";
import { useRadio } from "../../hooks/useRadio";
import { STREAM_ERROR } from "../../utils/constants";
import Focusable from "../Focusable/Focusable";

import "./Player.css";
import { useEffect, useState, useRef } from "react";

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const Player = () => {
  const { focusedKey, setFocusedKey } = useFocus();
  const { selectedStation, playerRef, streamError, setRadioStreamError } =
    useRadio();
  const [currentTime, setCurrentTime] = useState(0);
  const progressRef = useRef<HTMLInputElement>(null);

  // Set up the play/pause state when the audio element changes
  useEffect(() => {
    const player = playerRef?.current;
    if (!player) return;

    // Update progress bar as the audio plays
    const updateProgressBar = () => {
      if (playerRef?.current) {
        const current = playerRef?.current.currentTime;

        // Set the progress bar to loop after reaching the end
        if (current === playerRef?.current.duration) {
          playerRef.current.currentTime = 0;
        }
        setCurrentTime(current);
        if (progressRef.current) {
          progressRef.current.value = String(current);
        }
      }
    };

    const updateSeekMeta = () => {
      if (playerRef?.current?.duration) {
        if (progressRef.current) {
          progressRef.current.max = String(playerRef?.current?.duration);
        }
      }
    };

    player.addEventListener("timeupdate", updateProgressBar);
    player.addEventListener("loadedmetadata", updateSeekMeta);

    // Cleanup event listeners on unmount
    return () => {
      player.removeEventListener("timeupdate", updateProgressBar);
      player.removeEventListener("loadedmetadata", updateSeekMeta);
    };
  }, [playerRef, selectedStation]);

  // Handle audio error events
  const handleAudioError = (
    e: React.SyntheticEvent<HTMLAudioElement, Event>
  ) => {
    console.error("Audio failed to load", e);
    setRadioStreamError(STREAM_ERROR);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (playerRef?.current) {
      const newTime = parseFloat(e.target.value);
      playerRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Handle focus on the seekbar (audio element)
  const handleFocus = () => {
    setFocusedKey("seeker");

    // Focus the audio element (seeker)
    if (progressRef?.current) {
      progressRef?.current.focus();
    }
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

          {/*Hidden audio player*/}
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

          <div className="controls">
            {/* Time display */}
            <div className="time-display">
              <span>{formatTime(currentTime)}</span>
            </div>

            <Focusable
              focusKey="seeker"
              focusStyles={false}
              customClassname="seeker-focusable"
              isFocused={focusedKey === "seeker"}
              onFocus={handleFocus} // Focus the seekbar on focus
            >
              <input
                ref={progressRef}
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={currentTime}
                onChange={handleProgressChange}
                onFocus={handleFocus}
                aria-label="Audio Progress"
                className={`seekbar ${
                  focusedKey === "seeker" ? "focused-shadow" : ""
                }`}
              />
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
