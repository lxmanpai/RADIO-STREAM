import { useFocus } from "../../hooks/useFocus";
import { useRadio } from "../../hooks/useRadio";
import { STREAM_ERROR } from "../../utils/constants";
import Focusable from "../Focusable/Focusable";
import { SlControlPlay } from "react-icons/sl";
import { SlControlPause } from "react-icons/sl";

import "./Player.css";
import { useEffect, useState, useRef, useMemo } from "react";

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
    const updateCurrentTime = () => {
      if (playerRef?.current) {
        const current = playerRef?.current.currentTime;
        setCurrentTime(current);
      }
    };

    const updateSeekMeta = () => {
      if (playerRef?.current?.duration) {
        if (progressRef.current) {
          progressRef.current.max = String(playerRef?.current?.duration);
        }
      }
    };

    player.addEventListener("timeupdate", updateCurrentTime);
    player.addEventListener("loadedmetadata", updateSeekMeta);

    // Cleanup event listeners on unmount
    return () => {
      player.removeEventListener("timeupdate", updateCurrentTime);
      player.removeEventListener("loadedmetadata", updateSeekMeta);
    };
  }, [playerRef, selectedStation]);

  const isPlaying = useMemo(() => {
    const player = playerRef?.current;
    return player && !player.paused && !player.ended && player.readyState > 2;
  }, [
    playerRef?.current?.paused,
    playerRef?.current?.ended,
    playerRef?.current?.readyState,
  ]);

  const handlePlayPause = () => {
    if (playerRef?.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
    }
  };

  // Handle audio error events
  const handleAudioError = (
    e: React.SyntheticEvent<HTMLAudioElement, Event>
  ) => {
    console.error("Audio failed to load", e);
    setRadioStreamError(STREAM_ERROR);
  };

  // Handle focus on the seekbar (audio element)
  const handleFocus = () => {
    setFocusedKey("play");
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
            <Focusable
              focusKey="play"
              focusStyles={false}
              isFocused={focusedKey === "play"}
              onFocus={handleFocus} // Focus the play/pause button
            >
              <div
                className={`play ${
                  focusedKey === "play" ? "focused-shadow focused-play" : ""
                }`}
                onClick={() => handlePlayPause()}
              >
                {isPlaying ? (
                  <SlControlPause
                    size={24}
                    className={focusedKey === "play" ? "focused-icon" : ""}
                  />
                ) : (
                  <SlControlPlay
                    size={24}
                    className={focusedKey === "play" ? "focused-icon" : ""}
                  />
                )}
              </div>
            </Focusable>

            {/* Time display */}
            <div className="time-display">
              <span>{formatTime(currentTime)}</span>
            </div>

            <input
              ref={progressRef}
              readOnly
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={100}
              onFocus={handleFocus}
              aria-label="Audio Progress"
              className="seekbar"
            />

            <div className="live-indicator">
              <span className="indicator">🔴</span>
              <span>LIVE</span>
            </div>
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
