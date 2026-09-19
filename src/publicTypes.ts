/**
 * Represents the dimensions of a rectangular box in CSS pixels.
 */
export interface BoxSize {
  /** Box width in CSS pixels. */
  width: number;

  /** Box height in CSS pixels. */
  height: number;
}

export interface Coords {
  x: number;
  y: number;
}

export type PositionValue = `${number}${'' | '%'}`;
export type Position = PositionValue | `${PositionValue}:${PositionValue}`;

export interface Box extends BoxSize, Coords {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface ElementBox extends Box {
  element: HTMLElement;
}

export type DragEventType = 'start' | 'drag' | 'end';

export interface PointerDragEvent {
  type: DragEventType;
  dragHandle: ElementBox;
  container: ElementBox;
  cursor: Coords;
  view: BoxSize;
}
