import type {BoxSize} from '@/types';

export function getElementsContentBoxSize(element: HTMLElement): BoxSize {
  const {width: fullWidth, height: fullHeight} =
    element.getBoundingClientRect();

  const {
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
    borderLeftWidth,
  } = getComputedStyle(element);

  return {
    width:
      fullWidth -
      sumStr(paddingLeft, paddingRight, borderLeftWidth, borderRightWidth),
    height:
      fullHeight -
      sumStr(paddingTop, paddingBottom, borderTopWidth, borderBottomWidth),
  };
}

function sumStr(...s: string[]): number {
  return s.reduce((res, str) => res + parseFloat(str), 0);
}
