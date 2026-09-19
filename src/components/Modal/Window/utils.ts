import type {
  Position,
  PositionValue,
  PointerDragEvent,
  ElementBox,
  BoxSize,
  Coords,
  DragEventType,
} from '@/types';
import type {CSSProperties, PointerEvent} from 'react';

import type {ParsedPositionValue} from './types';
import {DEFAULT_STYLE, DEFAULT_POSITION_VALUE} from './constants';

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

export function getDragEvent(
  event: PointerEvent<HTMLElement>,
  handlerElement: HTMLElement,
  containerElement: HTMLElement,
  type: DragEventType,
): PointerDragEvent {
  const view: BoxSize = {width: window.innerWidth, height: window.innerHeight};
  const cursor: Coords = {x: event.clientX, y: event.clientY};
  const dragHandle = getElementBox(handlerElement);
  const container = getElementBox(containerElement);

  return {type, view, container, cursor, dragHandle};
}

export function getElementBox(element: HTMLElement): ElementBox {
  const {top, bottom, left, right, height, width, y, x} =
    element.getBoundingClientRect();

  return {element, top, bottom, left, right, height, width, y, x};
}
