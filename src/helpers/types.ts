export type Player = 'X' | 'O' | null;

export type SmallBoardState = Player[];

export type SmallWinner = {
  player: Player;
  line: number[] | null;
};

export type BigWinner = {
  player: Player;
  line: number[];
} | null;

export type BigBoardState = {
  boards: SmallBoardState[];
  winners: (SmallWinner | null)[];
};

export type GameMode = 'LOCAL' | 'AI';
