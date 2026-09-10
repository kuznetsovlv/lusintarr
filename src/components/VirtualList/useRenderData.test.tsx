import type {FC, ReactNode} from 'react';
import {isValidElement} from 'react';
import {act, renderHook} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';

import type {VirtualListMarkerProps} from './types';
import useRenderData, {getShift, useHeightMap} from './useRenderData';

interface RenderedItemProps {
  children: ReactNode;
  index: number;
  shift: number;
  Marker?: FC<VirtualListMarkerProps>;
  position: 'inside' | 'outside';
}

function getRenderedItemProps(node: ReactNode): RenderedItemProps {
  if (!isValidElement<RenderedItemProps>(node)) {
    throw new Error('Expected a React element');
  }

  return node.props;
}

describe('useHeightMap', () => {
  it('uses the estimated height for unmeasured items', () => {
    const items: ReactNode[] = ['Mercury', 'Venus', 'Earth'];

    const {result} = renderHook(() => useHeightMap(items, 40));

    expect(result.current[0]).toEqual([40, 40, 40]);
    expect(result.current[1]).toBe(120);
  });

  it('normalizes a negative estimated height to zero', () => {
    const items: ReactNode[] = ['Mercury', 'Venus'];

    const {result} = renderHook(() => useHeightMap(items, -40));

    expect(result.current[0]).toEqual([0, 0]);
    expect(result.current[1]).toBe(0);
  });

  it('replaces an estimated height with a measured height', () => {
    const items: ReactNode[] = ['Mercury', 'Venus', 'Earth'];

    const {result} = renderHook(() => useHeightMap(items, 40));

    act(() => {
      result.current[2](64, 1);
    });

    expect(result.current[0]).toEqual([40, 64, 40]);
    expect(result.current[1]).toBe(144);
  });

  it('stores a measurement in an initially sparse height map', () => {
    const items: ReactNode[] = ['Mercury', 'Venus', 'Earth', 'Mars'];

    const {result} = renderHook(() => useHeightMap(items, 40));

    act(() => {
      result.current[2](75, 2);
    });

    expect(result.current[0]).toEqual([40, 40, 75, 40]);
    expect(result.current[1]).toBe(195);
  });

  it('updates an existing measurement', () => {
    const items: ReactNode[] = ['Mercury', 'Venus'];

    const {result} = renderHook(() => useHeightMap(items, 40));

    act(() => {
      result.current[2](60, 0);
    });

    expect(result.current[0]).toEqual([60, 40]);
    expect(result.current[1]).toBe(100);

    act(() => {
      result.current[2](80, 0);
    });

    expect(result.current[0]).toEqual([80, 40]);
    expect(result.current[1]).toBe(120);
  });

  it('keeps measured heights when the estimate changes', () => {
    const items: ReactNode[] = ['Mercury', 'Venus', 'Earth'];

    const {result, rerender} = renderHook(
      ({estimatedItemHeight}: {estimatedItemHeight: number}) =>
        useHeightMap(items, estimatedItemHeight),
      {
        initialProps: {
          estimatedItemHeight: 40,
        },
      },
    );

    act(() => {
      result.current[2](64, 1);
    });

    expect(result.current[0]).toEqual([40, 64, 40]);

    rerender({
      estimatedItemHeight: 50,
    });

    expect(result.current[0]).toEqual([50, 64, 50]);
    expect(result.current[1]).toBe(164);
  });

  it('discards measurements when the items array changes', () => {
    const firstItems: ReactNode[] = ['Mercury', 'Venus'];
    const nextItems: ReactNode[] = ['Earth', 'Mars', 'Jupiter'];

    const {result, rerender} = renderHook(
      ({items}: {items: ReactNode[]}) => useHeightMap(items, 40),
      {
        initialProps: {
          items: firstItems,
        },
      },
    );

    act(() => {
      result.current[2](75, 0);
    });

    expect(result.current[0]).toEqual([75, 40]);

    rerender({
      items: nextItems,
    });

    expect(result.current[0]).toEqual([40, 40, 40]);
    expect(result.current[1]).toBe(120);
  });

  it('stores new measurements after the items array changes', () => {
    const firstItems: ReactNode[] = ['Mercury', 'Venus'];
    const nextItems: ReactNode[] = ['Earth', 'Mars', 'Jupiter'];

    const {result, rerender} = renderHook(
      ({items}: {items: ReactNode[]}) => useHeightMap(items, 40),
      {
        initialProps: {
          items: firstItems,
        },
      },
    );

    act(() => {
      result.current[2](75, 0);
    });

    rerender({
      items: nextItems,
    });

    act(() => {
      result.current[2](90, 2);
    });

    expect(result.current[0]).toEqual([40, 40, 90]);
    expect(result.current[1]).toBe(170);
  });

  it('handles an empty items array', () => {
    const {result} = renderHook(() => useHeightMap([], 40));

    expect(result.current[0]).toEqual([]);
    expect(result.current[1]).toBe(0);
  });
});

describe('getShift', () => {
  it('returns the first item at the top of the list', () => {
    expect(getShift(0, [20, 30, 40])).toEqual([0, 0]);
  });

  it('finds the item intersecting the scroll position', () => {
    expect(getShift(35, [20, 30, 40])).toEqual([1, 20]);
  });

  it('keeps an item whose bottom edge exactly matches the scroll position', () => {
    expect(getShift(20, [20, 30, 40])).toEqual([0, 0]);
  });

  it('finds an item after several variable-height items', () => {
    expect(getShift(75, [20, 30, 40, 50])).toEqual([2, 50]);
  });

  it('returns the end of the list when scroll is beyond its full height', () => {
    expect(getShift(200, [20, 30, 40])).toEqual([3, 90]);
  });

  it('returns the end of the list when scroll matches a position beyond zero-height items', () => {
    expect(getShift(10, [0, 0, 5])).toEqual([3, 5]);
  });

  it('handles an empty height map', () => {
    expect(getShift(100, [])).toEqual([0, 0]);
  });
});

describe('useRenderData', () => {
  it('renders enough estimated items to cover the content area', () => {
    const items: ReactNode[] = Array.from(
      {length: 10},
      (_, index) => `Item ${index + 1}`,
    );

    const {result} = renderHook(() =>
      useRenderData({
        items,
        estimatedItemHeight: 40,
        scroll: 0,
        contentAreaHeight: 100,
        type: 'none',
      }),
    );

    const [list, start, fullHeight] = result.current;

    expect(list).toHaveLength(3);
    expect(start).toBe(0);
    expect(fullHeight).toBe(400);

    expect(getRenderedItemProps(list[0])).toMatchObject({
      index: 0,
      shift: 0,
      children: 'Item 1',
    });

    expect(getRenderedItemProps(list[1])).toMatchObject({
      index: 1,
      shift: 40,
      children: 'Item 2',
    });

    expect(getRenderedItemProps(list[2])).toMatchObject({
      index: 2,
      shift: 80,
      children: 'Item 3',
    });
  });

  it('starts rendering from the item intersecting the scroll position', () => {
    const items: ReactNode[] = Array.from(
      {length: 10},
      (_, index) => `Item ${index + 1}`,
    );

    const {result} = renderHook(() =>
      useRenderData({
        items,
        estimatedItemHeight: 40,
        scroll: 50,
        contentAreaHeight: 100,
        type: 'none',
      }),
    );

    const [list, start, fullHeight] = result.current;

    expect(start).toBe(1);
    expect(fullHeight).toBe(400);
    expect(list).toHaveLength(3);

    expect(getRenderedItemProps(list[0])).toMatchObject({
      index: 1,
      shift: 40,
      children: 'Item 2',
    });

    expect(getRenderedItemProps(list[1])).toMatchObject({
      index: 2,
      shift: 80,
      children: 'Item 3',
    });

    expect(getRenderedItemProps(list[2])).toMatchObject({
      index: 3,
      shift: 120,
      children: 'Item 4',
    });
  });

  it('does not render items after the end of the source array', () => {
    const items: ReactNode[] = ['Mercury', 'Venus'];

    const {result} = renderHook(() =>
      useRenderData({
        items,
        estimatedItemHeight: 40,
        scroll: 0,
        contentAreaHeight: 500,
        type: 'none',
      }),
    );

    const [list, start, fullHeight] = result.current;

    expect(list).toHaveLength(2);
    expect(start).toBe(0);
    expect(fullHeight).toBe(80);
  });

  it('returns no rendered items for an empty source', () => {
    const {result} = renderHook(() =>
      useRenderData({
        items: [],
        estimatedItemHeight: 40,
        scroll: 0,
        contentAreaHeight: 100,
        type: 'none',
      }),
    );

    const [list, start, fullHeight] = result.current;

    expect(list).toEqual([]);
    expect(start).toBe(0);
    expect(fullHeight).toBe(0);
  });

  it('returns no rendered items when scroll is beyond the list', () => {
    const items: ReactNode[] = ['Mercury', 'Venus', 'Earth'];

    const {result} = renderHook(() =>
      useRenderData({
        items,
        estimatedItemHeight: 40,
        scroll: 200,
        contentAreaHeight: 100,
        type: 'none',
      }),
    );

    const [list, start, fullHeight] = result.current;

    expect(list).toEqual([]);
    expect(start).toBe(3);
    expect(fullHeight).toBe(120);
  });

  it('uses a per-item estimated height getter for unmeasured items', () => {
    const items: ReactNode[] = ['Mercury', 'Venus', 'Earth'];
    const estimatedItemHeight = vi.fn((index: number) => 20 + index * 10);

    const {result} = renderHook(() => useHeightMap(items, estimatedItemHeight));

    expect(result.current[0]).toEqual([20, 30, 40]);
    expect(result.current[1]).toBe(90);

    expect(estimatedItemHeight).toHaveBeenCalledWith(0);
    expect(estimatedItemHeight).toHaveBeenCalledWith(1);
    expect(estimatedItemHeight).toHaveBeenCalledWith(2);
  });

  it('replaces a per-item estimate with a measured height', () => {
    const items: ReactNode[] = ['Mercury', 'Venus', 'Earth'];
    const estimatedItemHeight = (index: number) => 20 + index * 10;

    const {result} = renderHook(() => useHeightMap(items, estimatedItemHeight));

    act(() => {
      result.current[2](75, 1);
    });

    expect(result.current[0]).toEqual([20, 75, 40]);
    expect(result.current[1]).toBe(135);
  });

  it('keeps measured heights when the estimate getter changes', () => {
    const items: ReactNode[] = ['Mercury', 'Venus', 'Earth'];

    const firstEstimate = (index: number) => 20 + index * 10;
    const secondEstimate = (index: number) => 50 + index * 10;

    const {result, rerender} = renderHook(
      ({estimatedItemHeight}) => useHeightMap(items, estimatedItemHeight),
      {
        initialProps: {
          estimatedItemHeight: firstEstimate,
        },
      },
    );

    act(() => {
      result.current[2](75, 1);
    });

    expect(result.current[0]).toEqual([20, 75, 40]);

    rerender({
      estimatedItemHeight: secondEstimate,
    });

    expect(result.current[0]).toEqual([50, 75, 70]);
    expect(result.current[1]).toBe(195);
  });

  it('normalizes negative values returned by the estimate getter to zero', () => {
    const items: ReactNode[] = ['Mercury', 'Venus', 'Earth'];

    const {result} = renderHook(() =>
      useHeightMap(items, (index) => {
        if (index === 1) {
          return -20;
        }

        return 40;
      }),
    );

    expect(result.current[0]).toEqual([40, 0, 40]);
    expect(result.current[1]).toBe(80);
  });

  it('passes a custom marker to rendered items with outside positioning by default', () => {
    const items: ReactNode[] = ['Mercury', 'Venus', 'Earth'];

    const Marker: FC<VirtualListMarkerProps> = ({index}) => (
      <span>{index}</span>
    );

    const {result} = renderHook(() =>
      useRenderData({
        items,
        estimatedItemHeight: 40,
        scroll: 0,
        contentAreaHeight: 100,
        type: Marker,
      }),
    );

    const renderedItems = result.current[0];

    expect(renderedItems.length).toBeGreaterThan(0);

    for (const item of renderedItems) {
      const props = getRenderedItemProps(item);

      expect(props.Marker).toBe(Marker);
      expect(props.position).toBe('outside');
    }
  });

  it('passes inside marker positioning to rendered items', () => {
    const items: ReactNode[] = ['Mercury'];

    const Marker: FC<VirtualListMarkerProps> = ({index}) => (
      <span>{index}</span>
    );

    const {result} = renderHook(() =>
      useRenderData({
        items,
        estimatedItemHeight: 40,
        scroll: 0,
        contentAreaHeight: 100,
        type: Marker,
        position: 'inside',
      }),
    );

    const props = getRenderedItemProps(result.current[0][0]);

    expect(props.Marker).toBe(Marker);
    expect(props.position).toBe('inside');
  });
});
