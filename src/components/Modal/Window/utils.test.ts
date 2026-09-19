import {describe, expect, it, vi, afterEach} from 'vitest';
import type {PointerEvent as ReactPointerEvent} from 'react';

import type {Position} from '@/types';
import {getDragEvent, getElementBox, getStyle} from './utils';

function createRect({
  x,
  y,
  width,
  height,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
}): DOMRect {
  return {
    x,
    y,
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    toJSON: () => ({}),
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('getStyle', () => {
  it('uses the same pixel value for both axes when one value is provided', () => {
    expect(getStyle('20')).toEqual({
      left: '20px',
      top: '20px',
      translate: '0 0',
    });
  });

  it('uses separate pixel values for both axes', () => {
    expect(getStyle('20:40')).toEqual({
      left: '20px',
      top: '40px',
      translate: '0 0',
    });
  });

  it('uses percentage translation to align the corresponding element point', () => {
    expect(getStyle('50%')).toEqual({
      left: '50%',
      top: '50%',
      translate: '-50% -50%',
    });
  });

  it('supports mixed pixel and percentage coordinates', () => {
    expect(getStyle('20:75%')).toEqual({
      left: '20px',
      top: '75%',
      translate: '0 -75%',
    });
  });

  it('supports viewport edge alignment', () => {
    expect(getStyle('100%:0')).toEqual({
      left: '100%',
      top: '0px',
      translate: '-100% 0',
    });
  });

  it('falls back to the default position for an invalid runtime value', () => {
    expect(getStyle('invalid' as Position)).toEqual({
      left: '50%',
      top: '50%',
      translate: '-50% -50%',
    });
  });
});

describe('getElementBox', () => {
  it('returns the element together with its current viewport bounds', () => {
    const element = document.createElement('div');

    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(
      createRect({
        x: 10,
        y: 20,
        width: 300,
        height: 150,
      }),
    );

    expect(getElementBox(element)).toEqual({
      element,
      x: 10,
      y: 20,
      left: 10,
      top: 20,
      right: 310,
      bottom: 170,
      width: 300,
      height: 150,
    });
  });
});

describe('getDragEvent', () => {
  it('creates a snapshot of pointer, handle, container, and viewport geometry', () => {
    const handlerElement = document.createElement('div');
    const containerElement = document.createElement('div');

    vi.spyOn(handlerElement, 'getBoundingClientRect').mockReturnValue(
      createRect({
        x: 10,
        y: 20,
        width: 200,
        height: 30,
      }),
    );

    vi.spyOn(containerElement, 'getBoundingClientRect').mockReturnValue(
      createRect({
        x: 10,
        y: 20,
        width: 400,
        height: 300,
      }),
    );

    vi.stubGlobal('innerWidth', 1280);
    vi.stubGlobal('innerHeight', 720);

    const pointerEvent = {
      clientX: 250,
      clientY: 160,
    } as ReactPointerEvent<HTMLElement>;

    expect(
      getDragEvent(pointerEvent, handlerElement, containerElement, 'drag'),
    ).toEqual({
      type: 'drag',
      view: {
        width: 1280,
        height: 720,
      },
      cursor: {
        x: 250,
        y: 160,
      },
      dragHandle: {
        element: handlerElement,
        x: 10,
        y: 20,
        left: 10,
        top: 20,
        right: 210,
        bottom: 50,
        width: 200,
        height: 30,
      },
      container: {
        element: containerElement,
        x: 10,
        y: 20,
        left: 10,
        top: 20,
        right: 410,
        bottom: 320,
        width: 400,
        height: 300,
      },
    });
  });
});
