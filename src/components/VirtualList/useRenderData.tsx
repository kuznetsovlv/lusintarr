import type {ReactNode} from 'react';
import {useState, useMemo, useDeferredValue} from 'react';
import {useHandler} from 'react-swissbit';
import Item from './Item';

type SetItemHeightCallback = (height: number, index: number) => void;

interface ListSource {
  items: ReactNode[];
  estimatedItemHeight: number;
  scroll: number;
  contentAreaHeight: number;
}

interface Measurements {
  items: ReactNode[];
  heights: (number | undefined)[];
}

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

  const [start, shift] = useShift(deferredScroll, heightMap);

  return useMemo(() => {
    const list: ReactNode[] = [];
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

    return [list, start + 1, fullHeight];
  }, [
    start,
    shift,
    deferredScroll,
    heightMap,
    items,
    contentAreaHeight,
    setItemHeight,
    fullHeight,
  ]);
}

function useHeightMap(
  items: ReactNode[],
  estimatedItemHeight: number,
): [number[], number, SetItemHeightCallback] {
  const normalizedEstimatedItemHeight = Math.max(0, estimatedItemHeight);

  const [measurements, setMeasurements] = useState<Measurements>(() => ({
    items,
    heights: new Array(items.length) as (number | undefined)[],
  }));

  const heightMap = useMemo(() => {
    if (measurements.items !== items) {
      return items.map(() => normalizedEstimatedItemHeight);
    }

    const heights: number[] = [];

    for (let i = 0; i < measurements.heights.length; ++i) {
      heights.push(measurements.heights[i] ?? normalizedEstimatedItemHeight);
    }

    return heights;
  }, [measurements, normalizedEstimatedItemHeight, items]);

  const fullHeight = useMemo(
    () => heightMap.reduce((s, h) => s + h, 0),
    [heightMap],
  );

  const setItemHeight = useHandler((height: number, index: number) =>
    setMeasurements((measurements) => {
      const currentHeights =
        measurements.items === items
          ? measurements.heights
          : (new Array(items.length) as (number | undefined)[]);

      const heights: (number | undefined)[] = [];
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

function useShift(
  scroll: number,
  heightMap: number[],
): [start: number, shitf: number] {
  return useMemo(() => {
    let start = 0;
    let height = 0;

    while (start < heightMap.length) {
      height += heightMap[start]!;

      if (height >= scroll) {
        break;
      }
      ++start;
    }

    return [start, height - heightMap[start]!];
  }, [scroll, heightMap]);
}
