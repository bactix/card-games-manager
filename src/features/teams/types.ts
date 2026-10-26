/** A named team stored on the device, used as a participant in team-based games. */
export interface Team {
  id: string;
  name: string;
  playerIds: string[];
}
