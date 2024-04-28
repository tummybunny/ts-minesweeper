import bomb from "../resources/bomb.png";

export type BlockDto = {
  x: number;
  y: number;
  isMine: boolean;
  isOpen: boolean;
  num: number;
  flagged?: boolean;
};

export type BlockProps = {
  block: BlockDto;
  onBlockClick: (x: number, y: number, rightClick: Boolean) => void;
};

export const Block = ({ block, onBlockClick }: BlockProps) => {
  return (
    <span
      className={block.isOpen ? "Cell Open" : "Cell"}
      onClick={() => onBlockClick(block.x, block.y, false)}
      onContextMenu={e => {
        onBlockClick(block.x, block.y, true);
        e.preventDefault();
      }}
    >
      {block.isOpen && block.isMine ? (
        <img src={bomb} alt="bomb" className="bomb" />
      ) : !block.isOpen && block.flagged ? (
        <img src={bomb} alt="bomb" className="flag" />
        
      ) : (
        <span
          style={
            block.isOpen ? { visibility: "visible" } : { visibility: "hidden" }
          }
        >
          {block.num === 0 ? "\u00A0" : block.num}
        </span>
      )}
    </span>
  );
};
