import type {CSSProperties, PropsWithChildren, FC} from 'react';
import {tv} from 'tailwind-variants';
import type {Layout} from '@/types';
import {useHandler} from 'react-swissbit';

interface ButtonProps {
  type?: 'button' | 'submit';
  className?: string;
  layout?: Layout;
  style?: CSSProperties;
  onClick?: () => void;
}

const button = tv({
  base: 'ltw:rounded-md ltw:border ltw:border-[var(--lus-demo-border)] ltw:bg-[var(--lus-demo-surface)] ltw:px-3 ltw:py-2 ltw:text-left ltw:text-[var(--lus-demo-text)] ltw:shadow-sm ltw:font-sans ltw:text-sm ltw:cursor-pointer',
  variants: {
    layout: {
      inline: 'ltw:inline',
      block: 'ltw:block',
    },
  },
});

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  className,
  layout = 'block',
  type,
  style,
  onClick,
}) => (
  <button
    type={type}
    className={button({layout, className})}
    style={style}
    onClick={onClick}
    onPointerDown={useHandler((event) => event.stopPropagation())}
  >
    {children}
  </button>
);
