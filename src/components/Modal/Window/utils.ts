import type {
  Position,
  PositionValue,
  PointerDragEvent,
  ElementBox,
  BoxSize,
  Coords,
  PointerDragEventType,
} from '@/types';
import type {CSSProperties, PointerEvent} from 'react';

import type {ParsedPositionValue} from './types';
import {DEFAULT_STYLE, DEFAULT_POSITION_VALUE} from './constants';

/**
 * Converts a public modal position into CSS positioning properties.
 *
 * A single position value is applied to both axes. Unitless values are
 * normalized to pixels.
 *
 * Percentage values use an equal negative translation so that the specified
 * relative point inside the element is aligned with the same relative point
 * in the viewport.
 *
 * @param position - Position to convert.
 * @returns CSS properties containing `left`, `top`, and `translate`.
 *
 * @example
 * ```ts
 * getStyle('20');
 * // {
 * //   left: '20px',
 * //   top: '20px',
 * //   translate: '0 0',
 * // }
 *
 * getStyle('50%');
 * // {
 * //   left: '50%',
 * //   top: '50%',
 * //   translate: '-50% -50%',
 * // }
 * ```
 */
export function getStyle(position: Position): CSSProperties {
  if (!position) {
    return DEFAULT_STYLE;
  }

  const [xValue, yValue] = position.split(':') as [
    PositionValue,
    PositionValue?,
  ];

  const x = parsePositionValue(xValue);
  const y = parsePositionValue(yValue ?? xValue);

  return {
    left: x.pos,
    top: y.pos,
    translate: `${x.translate} ${y.translate}`,
  };
}

/**
 * Converts one public position coordinate into normalized CSS values.
 *
 * Unitless values are converted to pixels. Percentage values retain their
 * unit and produce an opposite percentage translation used to align the
 * corresponding point inside the element.
 *
 * @param value - Position coordinate to parse.
 * @returns Normalized position and translation values.
 */
function parsePositionValue(value: PositionValue): ParsedPositionValue {
  const isPercent = value.endsWith('%');
  const num = Number(isPercent ? value.slice(0, -1) : value);

  if (Number.isNaN(num)) {
    return DEFAULT_POSITION_VALUE;
  }

  return {
    pos: `${num}${isPercent ? '%' : 'px'}`,
    translate: isPercent ? `${-num}%` : '0',
  };
}

/**
 * Creates a snapshot describing the current state of a drag interaction.
 *
 * Geometry is measured when the function is called, so the returned event
 * reflects the current DOM layout rather than the layout at drag start.
 *
 * @param event - React pointer event that triggered the drag update.
 * @param handlerElement - Element used as the drag handle.
 * @param containerElement - Draggable element controlled by the handle.
 * @param type - Current phase of the drag lifecycle.
 * @returns Drag event containing pointer, element, and viewport geometry.
 */
export function getDragEvent(
  event: PointerEvent<HTMLElement>,
  handlerElement: HTMLElement,
  containerElement: HTMLElement,
  type: PointerDragEventType,
): PointerDragEvent {
  const view: BoxSize = {width: window.innerWidth, height: window.innerHeight};
  const cursor: Coords = {x: event.clientX, y: event.clientY};
  const dragHandle = getElementBox(handlerElement);
  const container = getElementBox(containerElement);

  return {type, view, container, cursor, dragHandle};
}

/**
 * Measures an HTML element relative to the current viewport.
 *
 * The returned dimensions and coordinates are copied from
 * `Element.getBoundingClientRect()` and accompanied by the source element
 * itself.
 *
 * @param element - Element to measure.
 * @returns Snapshot of the element's viewport-relative bounds.
 */
export function getElementBox(element: HTMLElement): ElementBox {
  const {top, bottom, left, right, height, width, y, x} =
    element.getBoundingClientRect();

  return {element, top, bottom, left, right, height, width, y, x};
}
