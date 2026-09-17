import type {PropsWithChildren, FC} from 'react';
import {tv} from 'tailwind-variants';

import type {WindowProps} from '../types';
import {getStyle} from './utils';
import {DEFAULT_POSITION} from './constants';

const styleConfig = tv({
  base: [
    'ltw:fixed',
    'ltw:w-fit',
    'ltw:h-fit',
    'ltw:m-0',
    'ltw:p-0',
    'ltw:border-0',
    'ltw:bg-transparent',
  ],
});

const Window: FC<PropsWithChildren<WindowProps>> = ({
  className,
  position = DEFAULT_POSITION,
  autoCloseable,
  dragHolder,
  children,
  onClose,
  onDragStart,
  onDrag,
  onDrop,
}) => {
  return (
    <div className={styleConfig(className)} style={getStyle(position)}>
      {children}
    </div>
  );
};

export default Window;
