/**
 * Represents the dimensions of a rectangular box in CSS pixels.
 */
export interface BoxSize {
  /** Box width in CSS pixels. */
  width: number;

  /** Box height in CSS pixels. */
  height: number;
}

/**
 * Represents a point in viewport coordinates, in CSS pixels.
 */
export interface Coords {
  /** Horizontal coordinate. */
  x: number;

  /** Vertical coordinate. */
  y: number;
}

/**
 * Represents one coordinate used to position a component.
 *
 * A numeric value without a unit is interpreted as CSS pixels.
 * A percentage aligns the same relative point of the component with the
 * corresponding relative point of the viewport.
 *
 * @example
 * ```ts
 * const pixels: PositionValue = '20';
 * const percent: PositionValue = '50%';
 * ```
 */
export type PositionValue = `${number}${'' | '%'}`;

/**
 * Represents a component position.
 *
 * A single value is applied to both horizontal and vertical coordinates.
 * Two values can be provided as `x:y`.
 *
 * Numeric values without a unit are interpreted as CSS pixels.
 *
 * Percentage values align the corresponding relative point of the component
 * with the same relative point of the viewport. For example, `50%:50%`
 * centers the component, while `100%:100%` aligns its bottom-right corner
 * with the bottom-right corner of the viewport.
 *
 * @example
 * ```ts
 * const centered: Position = '50%';
 * const pixels: Position = '20:40';
 * const mixed: Position = '20:50%';
 * ```
 */
export type Position = PositionValue | `${PositionValue}:${PositionValue}`;

/**
 * Represents the size and viewport-relative bounds of a rectangular box.
 *
 * All values are expressed in CSS pixels.
 */
export interface Box extends BoxSize, Coords {
  /** Distance from the top edge of the viewport. */
  top: number;

  /** Distance from the top edge of the viewport to the bottom edge of the box. */
  bottom: number;

  /** Distance from the left edge of the viewport. */
  left: number;

  /** Distance from the left edge of the viewport to the right edge of the box. */
  right: number;
}

/**
 * Represents the measured bounds of an HTML element.
 */
export interface ElementBox extends Box {
  /** The measured element. */
  element: HTMLElement;
}

/**
 * Identifies the phase of a pointer-driven drag interaction.
 */
export type PointerDragEventType = 'start' | 'drag' | 'end';

/**
 * Describes a pointer-driven drag interaction.
 *
 * The event contains the current pointer position together with the current
 * geometry of the drag handle, draggable container, and viewport.
 *
 * The component emitting this event does not necessarily move itself.
 * Consumers can use these values to calculate and apply a new position.
 */
export interface PointerDragEvent {
  /** Current phase of the drag interaction. */
  type: PointerDragEventType;

  /** Current bounds of the element used as the drag handle. */
  dragHandle: ElementBox;

  /** Current bounds of the draggable container. */
  container: ElementBox;

  /** Current pointer position in viewport coordinates. */
  cursor: Coords;

  /** Current viewport dimensions. */
  view: BoxSize;
}
