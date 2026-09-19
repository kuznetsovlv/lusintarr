import type {PropsWithChildren, FC, PointerEventHandler} from 'react';
import {useRef} from 'react';
import {tv} from 'tailwind-variants';
import {useToggle, useHandler} from 'react-swissbit';

import type {WindowProps as RestrictedWindowProps} from '../types';
import {getStyle, getDragEvent} from './utils';
import {DEFAULT_POSITION} from './constants';

interface WindowProps extends RestrictedWindowProps {
  onPointerDownCapture: PointerEventHandler;
}

const baseClasses = [
  'ltw:w-fit',
  'ltw:h-fit',
  'ltw:m-0',
  'ltw:p-0',
  'ltw:border-0',
  'ltw:bg-transparent',
];

const styleConfig = tv({
  base: ['ltw:fixed', ...baseClasses],
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
  const windowRef = useRef<HTMLDivElement>(null);
  const handlerRef = useRef<HTMLDivElement>(null);
  const [dragging, {on: draggingOn, off: dragginOff}] = useToggle(false);

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = useHandler(
    (event) => {
      if (!windowRef.current || !handlerRef.current) {
        return;
      }

      event.currentTarget.setPointerCapture(event.pointerId);
      draggingOn();
      onDragStart?.(
        getDragEvent(event, handlerRef.current, windowRef.current, 'start'),
      );
    },
  );

  const handlerPointerMove: PointerEventHandler<HTMLDivElement> = useHandler(
    (event) => {
      if (!dragging || !windowRef.current || !handlerRef.current) {
        return;
      }

      onDrag?.(
        getDragEvent(event, handlerRef.current, windowRef.current, 'drag'),
      );
    },
  );

  const handlePointerUp: PointerEventHandler<HTMLDivElement> = useHandler(
    (event) => {
      if (!dragging || !windowRef.current || !handlerRef.current) {
        return;
      }

      event.currentTarget.releasePointerCapture(event.pointerId);
      dragginOff();
      onDragStop?.(
        getDragEvent(event, handlerRef.current, windowRef.current, 'end'),
      );
    },
  );

  return (
    <div
      ref={windowRef}
      className={styleConfig({className})}
      style={getStyle(position)}
      onPointerDownCapture={onPointerDownCapture}
    >
      {!!dragHolder && (
        <div
          ref={handlerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlerPointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onLostPointerCapture={handlePointerUp}
          className={[
            dragging ? 'ltw:cursor-grabbing' : 'ltw:cursor-grab',
            'ltw:active:cursor-grabbing',
            'ltw:w-full',
            ...baseClasses,
          ].join(' ')}
        >
          {dragHolder}
        </div>
      )}
      <div className={baseClasses.join(' ')}>{children}</div>
    </div>
  );
};

export default Window;
