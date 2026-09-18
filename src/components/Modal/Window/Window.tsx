import type {PropsWithChildren, FC, PointerEventHandler} from 'react';
import {tv} from 'tailwind-variants';

import type {WindowProps as RestrictedWindowProps} from '../types';
import {getStyle} from './utils';
import {DEFAULT_POSITION} from './constants';

interface WindowProps extends RestrictedWindowProps {
  onPointerDownCapture: PointerEventHandler;
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
  onPointerDownCapture,
}) => {
  return (
    <div
      className={styleConfig({className})}
      style={getStyle(position)}
      onPointerDownCapture={onPointerDownCapture}
    >
      {children}
    </div>
  );
};

export default Window;
