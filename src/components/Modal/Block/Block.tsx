import type {PropsWithChildren, FC} from 'react';

import type {BlockProps} from '../types';

const DEFAULT_BACKGROUND_COLOR = '#0007';

const Block: FC<PropsWithChildren<BlockProps>> = ({
  children,
  background = DEFAULT_BACKGROUND_COLOR,
}) => (
  <div
    className="ltw:fixed ltw:top-0 ltw:right-0 ltw:bottom-0 ltw:left-0 ltw:m-0 ltw:p-0 ltw:shadow-none ltw:border-0"
    style={{background}}
  >
    {children}
  </div>
);

export default Block;
