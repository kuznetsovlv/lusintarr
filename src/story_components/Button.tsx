import type {CSSProperties, PropsWithChildren, FC} from 'react';
import {tv} from 'tailwind-variants';
import type {Layout} from '@/types';
import {useHandler} from 'react-swissbit';

/**
 * Props for the shared Storybook demo button.
 */
interface ButtonProps {
  /** Native button type. */
  type?: 'button' | 'submit';

  /** Additional Tailwind classes applied to the button. */
  className?: string;

  /** CSS layout mode used by the button. */
  layout?: Layout;

  /** Additional inline styles applied to the button. */
  style?: CSSProperties;

  /** Called when the button is activated. */
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

/**
 * Shared button used by Storybook demos.
 *
 * Pointer-down propagation is intentionally stopped so demo controls can be
 * embedded inside interactive components such as modal drag handles without
 * accidentally starting the parent interaction.
 *
 * This component exists only for stories and is not part of the public
 * Lusintarr API.
 */
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
