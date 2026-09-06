import type {FC, ComponentProps, ReactNode, UIEvent} from 'react';
import {useRef, useState, useLayoutEffect} from 'react';
import {
  useResizeObserver,
  useHandler,
  useOnLayoutMount,
  useOnUnmount,
} from 'react-swissbit';
import {getElementContentViewportSize} from '@/utils';

import List from './List';
import {list, viewport} from './config';
import useRenderData from './useRenderData';

type OlType = NonNullable<ComponentProps<'ol'>['type']>;
type UlType = 'none' | 'disc' | 'circle' | 'square';
type Type = OlType | UlType;

interface VirtualListProps {
  className?: string;
  type?: Type;
  items?: ReactNode[];
  estimatedItemHeight?: number;
  position?: 'inside' | 'outside';
}

const olTypes: OlType[] = ['1', 'A', 'a', 'I', 'i'];
const olTypeSet = new Set<Type>(olTypes);

const DEFAULT_ESTIMATED_ITEM_HEIGHT = 40;

export const VirtualList: FC<VirtualListProps> = ({
  className,
  type = 'none',
  items = [],
  estimatedItemHeight = DEFAULT_ESTIMATED_ITEM_HEIGHT,
  position,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement | HTMLUListElement>(null);

  const [contentAreaHeight, setContentAreaHeight] = useState<number>(0);
  const [scroll, setScroll] = useState<number>(0);

  const coverResizeHandler = useHandler((entries: ResizeObserverEntry[]) => {
    if (entries.length) {
      const {
        contentRect: {height},
      } = entries[0]!;

      if (height !== contentAreaHeight) {
        setContentAreaHeight(height);
      }
    }
  });
  const [coverObserve, coverUnobserve] = useResizeObserver(coverResizeHandler);

  const listResizeHandler = useHandler(() => {
    if (ref.current) {
      const newContentAreaHeight = getElementContentViewportSize(
        ref.current,
      ).height;

      if (newContentAreaHeight !== contentAreaHeight) {
        setContentAreaHeight(newContentAreaHeight);
      }
    }
  });
  const [listObserve, listUnobserve] = useResizeObserver(listResizeHandler);

  useOnLayoutMount(() => {
    coverObserve(ref);
    listObserve(listRef);

    if (ref.current) {
      setContentAreaHeight(getElementContentViewportSize(ref.current).height);
    }
  });

  useOnUnmount(() => {
    coverUnobserve(ref);
    listUnobserve(listRef);
  });

  const isListOrdered = olTypeSet.has(type);

  const handleScroll = useHandler(({currentTarget}: UIEvent<HTMLDivElement>) =>
    setScroll(currentTarget.scrollTop ?? 0),
  );

  const [itemList, start, fullHeight] = useRenderData({
    items,
    estimatedItemHeight,
    scroll,
    contentAreaHeight,
  });

  useLayoutEffect(() => {
    if (listRef.current) {
      listRef.current.style.height = `${fullHeight}px`;
    }
  }, [fullHeight]);

  return (
    <div className={viewport({className})} ref={ref} onScroll={handleScroll}>
      <List
        className={list({type, position})}
        ordered={isListOrdered}
        listRef={listRef}
        start={start}
      >
        {itemList}
      </List>
    </div>
  );
};
