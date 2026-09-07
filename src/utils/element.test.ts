import {describe, expect, it} from 'vitest';

import {getElementContentViewportSize} from './element';

function setClientSize(
  element: HTMLElement,
  width: number,
  height: number,
): void {
  Object.defineProperties(element, {
    clientWidth: {
      value: width,
    },
    clientHeight: {
      value: height,
    },
  });
}

describe('getElementContentViewportSize', () => {
  it('returns client size when the element has no padding', () => {
    const element = document.createElement('div');

    element.style.padding = '0px';
    setClientSize(element, 400, 300);

    expect(getElementContentViewportSize(element)).toEqual({
      width: 400,
      height: 300,
    });
  });

  it('subtracts horizontal and vertical padding from the client size', () => {
    const element = document.createElement('div');

    element.style.paddingTop = '10px';
    element.style.paddingRight = '20px';
    element.style.paddingBottom = '30px';
    element.style.paddingLeft = '40px';

    setClientSize(element, 500, 300);

    expect(getElementContentViewportSize(element)).toEqual({
      width: 440,
      height: 260,
    });
  });

  it('supports fractional padding values', () => {
    const element = document.createElement('div');

    element.style.paddingTop = '2.5px';
    element.style.paddingRight = '3.5px';
    element.style.paddingBottom = '4.5px';
    element.style.paddingLeft = '5.5px';

    setClientSize(element, 200, 100);

    expect(getElementContentViewportSize(element)).toEqual({
      width: 191,
      height: 93,
    });
  });
});
