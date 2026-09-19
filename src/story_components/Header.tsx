import type {PropsWithChildren, FC} from 'react';

/**
 * Shared top-level heading used by Storybook demonstrations.
 *
 * Keeps typography consistent between component stories.
 *
 * This component exists only for stories and is not part of the public
 * Lusintarr API.
 */
export const Header: FC<PropsWithChildren> = ({children}) => (
  <h1 className="ltw:mb-4 ltw:text-3xl ltw:font-semibold ltw:text-(--lus-demo-heading)">
    {children}
  </h1>
);
