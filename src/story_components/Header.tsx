import type {PropsWithChildren, FC} from 'react';

export const Header: FC<PropsWithChildren> = ({children}) => (
  <h1 className="ltw:mb-4 ltw:text-3xl ltw:font-semibold ltw:text-(--lus-demo-heading)">
    {children}
  </h1>
);
