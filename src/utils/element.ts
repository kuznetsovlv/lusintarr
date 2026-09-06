import type {BoxSize} from '@/types';

export function getElementContentViewportSize(element: HTMLElement): BoxSize {
  const {paddingTop, paddingRight, paddingBottom, paddingLeft} =
    getComputedStyle(element);

  return {
    width: element.clientWidth - sumStr(paddingLeft, paddingRight),
    height: element.clientHeight - sumStr(paddingTop, paddingBottom),
  };
}

function sumStr(...values: string[]): number {
  return values.reduce((sum, value) => sum + parseFloat(value), 0);
}
