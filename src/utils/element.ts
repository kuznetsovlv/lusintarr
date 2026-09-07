import type {BoxSize} from '@/types';

/**
 * Returns the size of the element's content viewport in CSS pixels.
 *
 * The returned size excludes padding, borders, and the space occupied by
 * non-overlay scrollbars.
 *
 * @param element - Element whose content viewport should be measured.
 * @returns The available content width and height.
 */
export function getElementContentViewportSize(element: HTMLElement): BoxSize {
  const {paddingTop, paddingRight, paddingBottom, paddingLeft} =
    getComputedStyle(element);

  return {
    width: element.clientWidth - sumStr(paddingLeft, paddingRight),
    height: element.clientHeight - sumStr(paddingTop, paddingBottom),
  };
}

/**
 * Parses CSS numeric values and returns their sum.
 */
function sumStr(...values: string[]): number {
  return values.reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
}
