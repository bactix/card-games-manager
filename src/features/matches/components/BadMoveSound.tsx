import { useAudioPlayer } from 'expo-audio';
import { useEffect } from 'react';

// To use your own sound, replace this file (or point this line at another file in assets/sounds).
const BAD_MOVE_SOUND = require('../../../../assets/sounds/bad-move.wav');

/** Draws nothing. Plays the "bad move" sound each time `active` turns on. */
export function BadMoveSound({ active }: { active: boolean }) {
  const player = useAudioPlayer(BAD_MOVE_SOUND);

  useEffect(() => {
    if (!active) return;
    void player.seekTo(0);
    player.play();
  }, [active, player]);

  return null;
}
