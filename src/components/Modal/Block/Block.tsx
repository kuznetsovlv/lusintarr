import type {PropsWithChildren, FC} from 'react';

import type {BlockProps} from '../types';
import {DEFAULT_BACKGROUND_COLOR} from '../constants';

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
