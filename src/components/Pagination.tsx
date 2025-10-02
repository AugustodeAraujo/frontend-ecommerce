import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type PaginationButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function PaginationButton({
  className,
  children,
  ...props
}: PaginationButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "px-3 py-1  rounded bg-blue-400 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-white font-mono",
        className
      )}
    >
      {children}
    </button>
  );
}
