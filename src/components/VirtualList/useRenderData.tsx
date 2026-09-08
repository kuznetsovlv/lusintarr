import type {ReactNode} from 'react';
import {useState, useMemo, useDeferredValue} from 'react';
import {useHandler} from 'react-swissbit';
import Item from './Item';
import type {VirtualListEstimatedItemHeight} from './types';

/**
 * Reports a measured item height.
 *
 * @param height - Measured item height in CSS pixels.
 * @param index - Index of the item in the source items array.
 */
type SetItemHeightCallback = (height: number, index: number) => void;

/**
 * Source data and viewport state used to calculate the currently rendered
 * portion of a virtual list.
 */
interface ListSource {
  /** Items contained in the virtual list. */
  items: ReactNode[];

  /**
   * Initial height estimate used for items that have not yet been measured.
   *
   * May be either a fixed height or a getter receiving the zero-based item
   * index.
   */
  estimatedItemHeight: VirtualListEstimatedItemHeight;

  /** Current vertical scroll offset in CSS pixels. */
  scroll: number;

  /** Height of the visible content area in CSS pixels. */
  contentAreaHeight: number;
}

/**
 * Stores measured item heights associated with a particular items array.
 */
interface Measurements {
  /** Items array for which the measurements were collected. */
  items: ReactNode[];

  /**
   * Measured heights indexed by item position.
   *
   * An undefined value means that the item has not yet been measured.
   */
  heights: (number | undefined)[];
}

/**
 * Calculates the React nodes and layout metadata required to render the
 * currently visible portion of a virtual list.
 *
 * Scroll updates are deferred so that rendering based on the scroll position
 * can lag behind more urgent updates. Unmeasured items use
 * `estimatedItemHeight` until their actual height is reported by Item.
 *
 * @param source - List items, estimated dimensions, and current viewport state.
 * @returns The rendered items, zero-based index of the first rendered item,
 * and estimated total height of the complete list.
 */
export default function useRenderData({
  items,
  estimatedItemHeight,
  scroll,
  contentAreaHeight,
}: ListSource): [list: ReactNode[], start: number, fullHeight: number] {
  const [heightMap, fullHeight, setItemHeight] = useHeightMap(
    items,
    estimatedItemHeight,
  );

  const deferredScroll = useDeferredValue(scroll);

  return useMemo(() => {
    const list: ReactNode[] = [];

    const [start, shift] = getShift(deferredScroll, heightMap);

    let height = shift - deferredScroll;

    for (let i = start; i < items.length; ++i) {
      list.push(
        <Item
          key={i}
          index={i}
          shift={height + deferredScroll}
          onResize={setItemHeight}
        >
          {items[i]}
        </Item>,
      );
      height += heightMap[i]!;

      if (height >= contentAreaHeight) {
        break;
      }
    }

    return [list, start, fullHeight];
  }, [
    deferredScroll,
    heightMap,
    items,
    contentAreaHeight,
    setItemHeight,
    fullHeight,
  ]);
}

/**
 * Builds and maintains the height map used for virtualization.
 *
 * Measured item heights take precedence over estimates. Unmeasured items use
 * either the fixed estimated height or the value returned by the per-item
 * estimate getter.
 *
 * Measurements are reset when the source items array changes.
 *
 * @param items - Source items represented by the height map.
 * @param estimatedItemHeight - Fixed or per-item initial height estimate.
 * @returns The current height map, its total height, and a callback for
 * reporting measured item heights.
 */
export function useHeightMap(
  items: ReactNode[],
  estimatedItemHeight: VirtualListEstimatedItemHeight,
): [number[], number, SetItemHeightCallback] {
  const [measurements, setMeasurements] = useState<Measurements>(() => ({
    items,
    heights: new Array(items.length) as (number | undefined)[],
  }));

  const heightMap = useMemo(() => {
    if (measurements.items !== items) {
      return items.map((_, index) =>
        getEstimatedHeightValue(estimatedItemHeight, index),
      );
    }

    const heights: number[] = [];

    // `measurements.heights` may be sparse. Array.prototype.map() skips empty
    // slots, so use an indexed loop to produce a dense height map.
    for (let i = 0; i < measurements.heights.length; ++i) {
      heights.push(
        measurements.heights[i] ??
          getEstimatedHeightValue(estimatedItemHeight, i),
      );
    }

    return heights;
  }, [measurements, estimatedItemHeight, items]);

  const fullHeight = useMemo(
    () => heightMap.reduce((s, h) => s + h, 0),
    [heightMap],
  );

  const setItemHeight = useHandler((height: number, index: number) =>
    setMeasurements((measurements) => {
      if (
        measurements.items === items &&
        measurements.heights[index] === height
      ) {
        return measurements;
      }

      const currentHeights =
        measurements.items === items
          ? measurements.heights
          : (new Array(items.length) as (number | undefined)[]);

      const heights: (number | undefined)[] = [];

      // `currentHeights` may be sparse. Array.prototype.map() would skip an
      // unmeasured slot, including the one at `index`, and could therefore fail to
      // store a newly measured height.
      for (let i = 0; i < currentHeights.length; ++i) {
        heights.push(i === index ? height : currentHeights[i]);
      }

      return {
        items,
        heights,
      };
    }),
  );

  return [heightMap, fullHeight, setItemHeight];
}

/**
 * Finds the first item intersecting the current vertical scroll position and
 * calculates its offset from the top of the virtual list.
 *
 * An item whose bottom edge exactly matches the scroll position is retained as
 * the first rendered item. If the scroll position is beyond the estimated end
 * of the list, the returned start index equals `heightMap.length`.
 *
 * @param scroll - Vertical scroll offset in CSS pixels.
 * @param heightMap - Effective height of every list item in CSS pixels.
 * @returns The zero-based index of the first rendered item and its vertical
 * offset from the top of the list.
 */
export function getShift(
  scroll: number,
  heightMap: number[],
): [start: number, shift: number] {
  let start = 0;
  let shift = 0;

  while (start < heightMap.length) {
    const itemHeight = heightMap[start]!;

    if (shift + itemHeight >= scroll) {
      return [start, shift];
    }

    shift += itemHeight;
    ++start;
  }

  return [start, shift];
}

/**
 * Returns the normalized estimated height for an item.
 *
 * If a fixed estimate is provided, the same value is used for every item.
 * Otherwise the estimate getter is called with the item's zero-based index.
 * Negative values are normalized to zero.
 *
 * @param estimatedItemHeight - Fixed or per-item height estimate.
 * @param index - Zero-based index of the item in the source array.
 * @returns Normalized estimated item height in CSS pixels.
 */
function getEstimatedHeightValue(
  estimatedItemHeight: VirtualListEstimatedItemHeight,
  index: number,
): number {
  const value =
    typeof estimatedItemHeight === 'number'
      ? estimatedItemHeight
      : estimatedItemHeight(index);

  return Math.max(0, value);
}
