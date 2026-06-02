import style from "./bracketItem.module.scss";

type BracketType = "square" | "curly";

interface BracketItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  bracketType?: BracketType;
}

export function BracketItem({
  children,
  onClick,
  bracketType = "square",
}: Readonly<BracketItemProps>) {
  return (
    <div
      className={`${style["bracket-item"]} ${style[`bracket-item--${bracketType}`]}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
