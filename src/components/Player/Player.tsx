import { useFocus } from "../../hooks/useFocus";
import { useRadio } from "../../hooks/useRadio";
import { STREAM_ERROR } from "../../utils/constants";
import Focusable from "../Focusable/Focusable";
import { SlControlPlay, SlControlPause } from "react-icons/sl";

import "./Player.css";
import { useEffect, useState, useMemo } from "react";

// Utility function to format time in MM:SS format
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const Player = () => {
  const { focusedKey, setFocusedKey } = useFocus();
  const { selectedStation, playerRef, streamError, setRadioStreamError } =
    useRadio();
  const [currentTime, setCurrentTime] = useState(0); // Current playback time

  // Effect to handle audio events and update progress
  useEffect(() => {
    const player = playerRef?.current;
    if (!player) return;

    // Function to update the current playback time
    const updateCurrentTime = () => {
      if (playerRef?.current) {
        setCurrentTime(playerRef.current.currentTime);
      }
    };

    // Add event listeners
    player.addEventListener("timeupdate", updateCurrentTime);

    // Call immediately to initialize the seekbar
    updateCurrentTime();

    // Cleanup event listeners on unmount
    return () => {
      player.removeEventListener("timeupdate", updateCurrentTime);
    };
  }, [playerRef, selectedStation]);

  // Memoized value to determine if the audio is playing
  const isPlaying = useMemo(() => {
    const player = playerRef?.current;
    return player && !player.paused && !player.ended && player.readyState > 2;
  }, [
    playerRef?.current?.paused,
    playerRef?.current?.ended,
    playerRef?.current?.readyState,
  ]);

  // Function to toggle play/pause
  const handlePlayPause = () => {
    if (playerRef?.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
    }
  };

  // Function to handle audio errors
  const handleAudioError = (
    e: React.SyntheticEvent<HTMLAudioElement, Event>
  ) => {
    console.error("Audio failed to load", e);
    setRadioStreamError(STREAM_ERROR);
  };

  // Function to handle focus on the seekbar
  const handleFocus = () => {
    setFocusedKey("play");
  };

  return (
    <div className="player-container">
      {selectedStation ? (
        <div>
          {/* Station name */}
          <div className="show-name">
            {selectedStation?.title || "Melody Time"}
          </div>

          {/* Thumbnail */}
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
              alt="Station Thumbnail"
            />
          </Focusable>

          {/* Hidden audio player */}
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

          {/* Controls */}
          <div className="controls">
            {/* Play/Pause button */}
            <Focusable
              focusKey="play"
              focusStyles={false}
              isFocused={focusedKey === "play"}
              onFocus={handleFocus} // Focus the play/pause button
            >
              <button
                className={`play ${
                  focusedKey === "play" ? "focused-shadow focused-play" : ""
                }`}
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <SlControlPause
                    size={28}
                    className={focusedKey === "play" ? "focused-icon" : ""}
                  />
                ) : (
                  <SlControlPlay
                    size={28}
                    className={focusedKey === "play" ? "focused-icon" : ""}
                  />
                )}
              </button>
            </Focusable>

            {/* Time display */}
            <div className="time-display">
              <span>{formatTime(currentTime)}</span>
            </div>

            {/* Seekbar */}
            <input
              readOnly
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={100} // Loop progress for live streams
              onFocus={handleFocus}
              aria-label="Audio Progress"
              className="seekbar"
            />

            {/* Live indicator */}
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
