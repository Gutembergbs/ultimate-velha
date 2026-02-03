export type Player = "X" | "O" | null;

export type SmallBoard = Player[][];
export type BigBoard = (Player | "DRAW" | null)[];
