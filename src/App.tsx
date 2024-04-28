import React, { useState } from "react";
import "./App.css";
import { Board, BlockDto } from "./comp/Board";
import { Game } from "./comp/Game";
import { mapNotNull, Nullable } from "./mod/fp";

const DEFAULT_HEIGHT = 15;
const DEFAULT_WIDTH = 40;
const DEFAULT_MINES = 75;

const checkBoard = (
  arr: BlockDto[][],
  x: number,
  y: number
): Nullable<BlockDto> => {
  if (y >= 0 && x >= 0 && y < arr.length) {
    const h = arr[y];
    return x < h.length ? h[x] : null;
  }
  return null;
};

const markMine = (b: BlockDto) => {
  if (!b.isMine) {
    b.isMine = true;
    return true;
  }
  return false;
};

const newGame = (v: number, h: number, mines: number): BlockDto[][] => {
  const arr: BlockDto[][] = [];
  const isMine = false;
  const isOpen = false;

  // initialize blank board...
  for (let y = 0; y < v; y++) {
    arr[y] = [];
    for (let x = 0; x < h; x++) {
      arr[y][x] = { x, y, isMine, isOpen, num: 0 };
    }
  }

  // setup mines
  let i = 0;
  while (i < mines) {
    const y = ~~(Math.random() * v);
    const x = ~~(Math.random() * h);
    if (mapNotNull(checkBoard(arr, x, y), markMine)) i++;
  }

  // set numbers:
  for (let y = 0; y < v; y++) {
    for (let x = 0; x < h; x++) {
      const cell = arr[y][x];
      if (!cell.isMine) {
        let num = 0;
        if (checkBoard(arr, x - 1, y - 1)?.isMine) num++;
        if (checkBoard(arr, x, y - 1)?.isMine) num++;
        if (checkBoard(arr, x + 1, y - 1)?.isMine) num++;
        if (checkBoard(arr, x - 1, y)?.isMine) num++;
        if (checkBoard(arr, x + 1, y)?.isMine) num++;
        if (checkBoard(arr, x - 1, y + 1)?.isMine) num++;
        if (checkBoard(arr, x, y + 1)?.isMine) num++;
        if (checkBoard(arr, x + 1, y + 1)?.isMine) num++;
        arr[y][x] = { ...cell, num };
      }
    }
  }
  return arr;
};

function App() {
  const [game, setGame] = useState<Game>({
    boardHeight: DEFAULT_HEIGHT,
    boardWidth: DEFAULT_WIDTH,
    mines: DEFAULT_MINES,
    state: "RUNNING",
  });

  const [blocks, setBlocks] = useState<BlockDto[][]>(() => {
    return newGame(game.boardHeight, game.boardWidth, game.mines);
  });

  const [mines, setMines] = useState<number>(DEFAULT_MINES);

  const restart = () => {
    const m = Math.min(Math.max(1, mines), 150);
    setGame((g) => ({ ...g, state: "RUNNING", mines: m }));
    setBlocks(newGame(game.boardHeight, game.boardWidth, m));
  };

  const flipAll = (x: number, y: number): Boolean => {
    const b = checkBoard(blocks, x, y);
    if (b && !b.isOpen) {
      b.isOpen = true;
      if (b.num === 0) {
        flipAll(x - 1, y - 1);
        flipAll(x, y - 1);
        flipAll(x + 1, y - 1);
        flipAll(x - 1, y);
        flipAll(x + 1, y);
        flipAll(x - 1, y + 1);
        flipAll(x, y + 1);
        flipAll(x + 1, y + 1);
      }
    }
    return false;
  };

  const checkWon = () => {
    let matches = 0;
    let flags = 0;
    let opens = 0;
    for (let y = 0; y < game.boardHeight; y++) {
      for (let x = 0; x < game.boardWidth; x++) {
        const b = blocks[y][x];
        if (b.isOpen) opens++;
        if (b.flagged) {
          flags++;
          if (b.isMine) matches++;
        }
      }
    }
    return (
      matches === game.mines &&
      flags === matches &&
      opens === game.boardHeight * game.boardWidth - game.mines
    );
  };

  const onBlockClick = (x: number, y: number, rightClick: Boolean) => {
    const b = checkBoard(blocks, x, y);
    if (b) {
      if (!b.isOpen) {
        if (rightClick) {
          b.flagged = !b.flagged;
        } else if (b.isMine) {
          b.isOpen = true;
          setGame({ ...game, state: "LOSE" });
        } else {
          flipAll(x, y);
        }
        if (checkWon()) {
          setGame((g) => ({ ...g, state: "WON" }));
        }
      }
      setBlocks([...blocks]);
    }
  };

  return (
    <div>
      <Board
        blocks={blocks}
        mines={mines}
        onRestart={restart}
        onSetMines={setMines}
        onBlockClick={onBlockClick}
      ></Board>
      {game.state === "RUNNING" ? (
        <></>
      ) : game.state === "WON" ? (
        <div className="Dialog">
          <div>You have discovered all mines!! Please click OK to restart.</div>
          <div>Increase the number of mines to step up the difficulty.</div>
          <div className="Button" onClick={restart}>
            OK
          </div>
        </div>
      ) : (
        <div className="Dialog">
          <div>You have lost, please click PLAY AGAIN to restart.</div>
          <div>Decrease the number of mines to lower the difficulty.</div>
          <div className="Button" onClick={restart}>
            PLAY AGAIN
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
