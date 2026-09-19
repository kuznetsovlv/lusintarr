import {useRef} from 'react';
import type {PropsWithChildren, FC, PointerEventHandler} from 'react';
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
  dragHandle,
  children,
  onDragStart,
  onDrag,
  onDragStop,
  onPointerDownCapture,
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const handlerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<boolean>(false);
  const [dragging, {on: draggingOn, off: draggingOff}] = useToggle(false);

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = useHandler(
    (event) => {
      if (
        !windowRef.current ||
        !handlerRef.current ||
        event.button !== 0 ||
        !event.isPrimary
      ) {
        return;
      }

      event.currentTarget.setPointerCapture(event.pointerId);
      draggingOn();
      draggingRef.current = true;
      onDragStart?.(
        getDragEvent(event, handlerRef.current, windowRef.current, 'start'),
      );
    },
  );

  const handlerPointerMove: PointerEventHandler<HTMLDivElement> = useHandler(
    (event) => {
      if (!draggingRef.current || !windowRef.current || !handlerRef.current) {
        return;
      }

      onDrag?.(
        getDragEvent(event, handlerRef.current, windowRef.current, 'drag'),
      );
    },
  );

  const finishDragging: PointerEventHandler<HTMLDivElement> = useHandler(
    (event) => {
      if (!draggingRef.current || !windowRef.current || !handlerRef.current) {
        return;
      }

      draggingRef.current = false;
      draggingOff();

      onDragStop?.(
        getDragEvent(event, handlerRef.current, windowRef.current, 'end'),
      );
    },
  );

  const handlePointerUp: PointerEventHandler<HTMLDivElement> = useHandler(
    (event) => {
      finishDragging(event);

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
  );

  return (
    <div
      ref={windowRef}
      className={styleConfig({className})}
      style={getStyle(position)}
      onPointerDownCapture={onPointerDownCapture}
    >
      {!!dragHandle && (
        <div
          ref={handlerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlerPointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={finishDragging}
          onLostPointerCapture={finishDragging}
          className={[
            dragging ? 'ltw:cursor-grabbing' : 'ltw:cursor-grab',
            'ltw:active:cursor-grabbing',
            'ltw:touch-none',
            'ltw:select-none',
            'ltw:w-full',
            ...baseClasses,
          ].join(' ')}
        >
          {dragHandle}
        </div>
      )}
      <div className={baseClasses.join(' ')}>{children}</div>
    </div>
  );
};

export default Window;
