import {useRef} from 'react';
import type {PropsWithChildren, FC, PointerEventHandler} from 'react';
import {tv} from 'tailwind-variants';
import {useToggle, useHandler} from 'react-swissbit';

import type {WindowProps as RestrictedWindowProps} from '../types';
import {getStyle, getDragEvent} from './utils';
import {DEFAULT_POSITION} from './constants';

/**
 * Internal props accepted by {@link Window}.
 *
 * `onPointerDownCapture` is supplied by {@link Modal} and marks pointer events
 * originating from the logical modal subtree before descendant handlers can
 * stop propagation.
 */
interface WindowProps extends RestrictedWindowProps {
  onPointerDownCapture: PointerEventHandler;
}

/**
 * Shared visual reset applied to structural elements of the modal window.
 *
 * Layout-specific width and display classes are intentionally kept separate,
 * because the window container and its rows have different sizing behavior.
 */
const resetClasses = [
  'ltw:m-0',
  'ltw:p-0',
  'ltw:border-0',
  'ltw:bg-transparent',
];

/**
 * Tailwind variant configuration for the outer modal window.
 *
 * The window uses a single-column grid so that its width is determined by the
 * widest row while narrower rows stretch to the resulting column width.
 */
const styleConfig = tv({
  base: ['ltw:fixed', 'ltw:grid', 'ltw:w-fit', 'ltw:h-fit', ...resetClasses],
});

/**
 * Renders the positioned modal window and manages pointer-driven drag
 * interaction.
 *
 * Dragging uses Pointer Events and pointer capture rather than the HTML Drag
 * and Drop API. Pointer capture keeps move and termination events associated
 * with the drag handle even after the pointer leaves its physical bounds.
 *
 * The component does not mutate its own position. It only emits drag lifecycle
 * events; the consumer controls movement through the `position` prop.
 *
 * This component is internal to {@link Modal}.
 */
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
  /**
   * DOM reference to the complete modal window.
   *
   * Used to measure the container during drag lifecycle callbacks.
   */
  const windowRef = useRef<HTMLDivElement>(null);

  /**
   * DOM reference to the drag handle.
   *
   * Exists only when `dragHandle` content is rendered.
   */
  const handlerRef = useRef<HTMLDivElement>(null);

  /**
   * Synchronous drag-state flag used by pointer event handlers.
   *
   * React state alone is unsuitable for guarding the pointer lifecycle because
   * state updates are asynchronous and multiple termination events such as
   * `pointerup` and `lostpointercapture` may occur within the same lifecycle.
   */
  const draggingRef = useRef<boolean>(false);
  const [dragging, {on: draggingOn, off: draggingOff}] = useToggle(false);

  /**
   * Starts a drag interaction for the primary pointer and primary button.
   *
   * Pointer capture is acquired immediately so subsequent move and termination
   * events continue to target the drag handle even when the pointer leaves it.
   */
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

  /**
   * Emits drag updates while a drag interaction is active.
   *
   * The synchronous ref is used instead of React state so movement immediately
   * following `pointerdown` cannot be missed because of render timing.
   */
  const handlePointerMove: PointerEventHandler<HTMLDivElement> = useHandler(
    (event) => {
      if (!draggingRef.current || !windowRef.current || !handlerRef.current) {
        return;
      }

      onDrag?.(
        getDragEvent(event, handlerRef.current, windowRef.current, 'drag'),
      );
    },
  );

  /**
   * Finishes the active drag interaction exactly once.
   *
   * Several pointer events can indicate termination, including
   * `pointercancel` and `lostpointercapture`. Clearing `draggingRef` before
   * invoking the callback makes subsequent termination events no-ops.
   */
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

  /**
   * Handles normal pointer release.
   *
   * The drag is finished before pointer capture is released because releasing
   * capture may synchronously produce `lostpointercapture`.
   */
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
      role="dialog"
      className={styleConfig({className})}
      style={getStyle(position)}
      onPointerDownCapture={onPointerDownCapture}
    >
      {!!dragHandle && (
        <div
          ref={handlerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={finishDragging}
          onLostPointerCapture={finishDragging}
          className={[
            dragging ? 'ltw:cursor-grabbing' : 'ltw:cursor-grab',
            'ltw:active:cursor-grabbing',
            'ltw:touch-none',
            'ltw:select-none',
            ...resetClasses,
          ].join(' ')}
        >
          {dragHandle}
        </div>
      )}
      <div className={resetClasses.join(' ')}>{children}</div>
    </div>
  );
};

export default Window;
