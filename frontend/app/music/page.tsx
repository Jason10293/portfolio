import React from "react";
import SpotifyWidget from "../../components/SpotifyWidget";

const MusicPage = () => {
  const primaryText = "text-neutral-900 dark:text-neutral-100";
  const secondaryText = "text-neutral-500 dark:text-neutral-400";
  const accentText = "text-neutral-400 dark:text-neutral-500";

  return (
    <div className="animate-[fadeIn_0.5s_ease-in-out] space-y-12">
      <div className="mb-12">
        <h2 className={`text-4xl font-light mb-4 ${primaryText}`}>
          Listening Log
        </h2>
        <p className={secondaryText}>
          Real-time playback and monthly aggregate statistics.
        </p>
      </div>

      <SpotifyWidget variant="full" />
    </div>
  );
};

export default MusicPage;
