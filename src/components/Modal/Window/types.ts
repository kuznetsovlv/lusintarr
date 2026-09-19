/**
 * CSS position value produced from a public {@link PositionValue}.
 *
 * Unitless public position values are normalized to pixels before being
 * applied to the DOM.
 */
export type ResultPosition = `${number}${'px' | '%'}`;

/**
 * CSS translate value used to compensate for percentage-based positioning.
 *
 * Pixel positions do not require translation and therefore use `0`.
 * Percentage positions translate the element by the opposite percentage so
 * that the corresponding point inside the element is aligned with the same
 * point in the viewport.
 */
export type ResultTranslate = '0' | `${number}${'%'}`;

/**
 * Normalized representation of a single position coordinate.
 *
 * `pos` is applied to `left` or `top`, while `translate` shifts the element
 * relative to its own dimensions.
 */
export interface ParsedPositionValue {
  /** Normalized CSS position value. */
  pos: ResultPosition;

  /** Translation required to align the element anchor point. */
  translate: ResultTranslate;
}
