export interface Player {
  id: string;
  name: string;
}

/** A saved group of players, so names are entered only once. */
export interface Gang {
  id: string;
  name: string;
  players: Player[];
}
