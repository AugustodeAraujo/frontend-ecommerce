import type { HTMLProps } from "react";

interface ContainerProps extends HTMLProps<HTMLDivElement> {}

export function Container({ children, ...props }: ContainerProps) {
  return (
    <div className='container mx-auto px-4 md:px-0' {...props}>
      {children}
    </div>
  );
}
