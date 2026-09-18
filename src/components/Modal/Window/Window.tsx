import type {PropsWithChildren, FC} from 'react';
import {tv} from 'tailwind-variants';

import type {
  PointEventHandler,
  WindowProps as RestrictedWindowProps,
} from '../types';
import {getStyle} from './utils';
import {DEFAULT_POSITION} from './constants';

interface WindowProps extends RestrictedWindowProps {
  onPointerDown: PointEventHandler;
}

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
  dragHolder,
  children,
  onDragStart,
  onDrag,
  onDragStop,
  onPointerDown,
}) => {
  return (
    <div
      className={styleConfig({className})}
      style={getStyle(position)}
      onPointerDown={onPointerDown}
    >
      {children}
    </div>
  );
};

export default Window;
