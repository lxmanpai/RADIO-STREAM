import { useFocus } from "../../hooks/useFocus";
import { useRadio } from "../../hooks/useRadio";
import { PLAYER_TITLE, STREAM_ERROR } from "../../utils/constants";
import Focusable from "../Focusable/Focusable";

import "./Player.css";
import { useEffect, useMemo, useState, useRef } from "react";

const Player = () => {
  const { focusedKey, setFocusedKey } = useFocus();
  const { selectedStation, playerRef, streamError, setRadioStreamError } =
    useRadio();
  const [isPlaying, setIsPlaying] = useState(true);

  // Use ref to focus the audio tag (seekbar)
  const audioRef = useRef<HTMLAudioElement>(null);

  // Memoize the button class name to avoid recalculating it on every render
  const buttonClassName = useMemo(
    () =>
      `player-button ${focusedKey === "player" ? "player-button-focused" : ""}`,
    [focusedKey]
  );

  // Set up the play/pause state when the audio element changes
  useEffect(() => {
    const player = playerRef?.current;
    if (!player) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    player.addEventListener("play", handlePlay);
    player.addEventListener("pause", handlePause);

    setIsPlaying(!player.paused);

    // Cleanup event listeners on unmount
    return () => {
      player.removeEventListener("play", handlePlay);
      player.removeEventListener("pause", handlePause);
    };
  }, [playerRef?.current]);

  // Handle audio error events
  const handleAudioError = (
    e: React.SyntheticEvent<HTMLAudioElement, Event>
  ) => {
    console.error("Audio failed to load", e);
    setRadioStreamError(STREAM_ERROR);
    setIsPlaying(false);
  };

  // Handle play/pause button click
  const handlePlayPause = () => {
    if (playerRef?.current) {
      if (playerRef?.current.paused) {
        playerRef?.current.play();
      } else {
        playerRef?.current.pause();
      }
    }
  };

  // Handle focus on the seekbar (audio element)
  const handleFocus = () => {
    setFocusedKey("seeker");

    // Focus the audio element (seeker)
    if (audioRef.current) {
      audioRef.current.focus();
    }
  };

  return (
    <div className="player-container">
      {selectedStation ? (
        <div>
          {/* Player title */}
          <div className="title">{PLAYER_TITLE}</div>

          {/* Play/Pause button */}
          <Focusable
            focusKey="player"
            focusStyles={false}
            isFocused={focusedKey === "player"}
            onFocus={() => setFocusedKey("player")}
          >
            <button onClick={handlePlayPause} className={buttonClassName}>
              {isPlaying ? "Pause" : "Play"}
            </button>
          </Focusable>

          {/* Audio player with focusable seekbar */}
          <Focusable
            focusKey="seeker"
            focusStyles={true}
            customClassname="audio-player-focusable"
            isFocused={focusedKey === "seeker"}
            onFocus={handleFocus} // Focus the seekbar on focus
          >
            <audio
              autoPlay
              ref={(el) => {
                if (playerRef) {
                  playerRef.current = el;
                }
                audioRef.current = el; // Set the audio ref for seeking
              }}
              className="audio-player"
              controls
              onError={handleAudioError}
              tabIndex={-1} // Optional: remove from tab order unless focused programmatically
            >
              <source src={selectedStation?.link} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </Focusable>

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
