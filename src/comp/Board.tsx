import { Block, BlockDto } from "./Block";

type BoardProps = {
  blocks: BlockDto[][];
  mines: number;
  onRestart: () => void;
  onSetMines: (_: number) => void;
  onBlockClick: (x: number, y: number, rightClick: Boolean) => void;
};

export const Board = ({
  blocks,
  mines,
  onRestart,
  onSetMines,
  onBlockClick,
}: BoardProps) => {
  return (
    <div className="Board">
      <div className="Score">
        <label htmlFor="mines">
          Mines:
          <input
            type="number"
            name="mines"
            value={mines}
            onChange={(e) => {
              onSetMines(+e.target.value);
            }}
            style={{width: 50, textAlign: "left"}}
          />
        </label>
        <span onClick={onRestart} className="SmallBtn">Restart</span>
      </div>
      {blocks.map((cells, vidx) => (
        <div key={"b" + vidx + "."}>
          {cells.map((c, hidx) => (
            <Block key={"b" + vidx + "." + hidx} block={c} onBlockClick={onBlockClick}></Block>
          ))}
        </div>
      ))}
    </div>
  );
};

export type { BlockDto };
