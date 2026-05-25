import style from "./bracketItem.module.scss";

interface BracketItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function BracketItem({
  children,
  onClick,
  className = "",
}: BracketItemProps) {
  return (
    <div
      className={`${style["bracket-item"]} ${style["bracket-item--square"]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
