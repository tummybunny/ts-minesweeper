export type Game = {
    boardHeight: number,
    boardWidth: number,
    mines: number,
    state: 'WON' | 'LOSE' | 'RUNNING'
}
