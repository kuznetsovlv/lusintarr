import type {FC, ComponentProps, ReactNode} from 'react';
import {useRef, useLayoutEffect, useState} from 'react';
import {useResizeObserver, useHandler} from 'react-swissbit';
import {getElementsContentBoxSize} from '@/utils';

import List from './List';
import {list} from './config';

type OlType = NonNullable<ComponentProps<'ol'>['type']>;
type UlType = 'none' | 'disc' | 'circle' | 'square';
type Type = OlType | UlType;

interface VirtualListProps {
  className?: string;
  type?: Type;
  items?: ReactNode[];
  estimatedItemHeight?: number;
}

const olTypes: OlType[] = ['1', 'A', 'a', 'I', 'i'];
const olTypeSet = new Set<Type>(olTypes);

const DEFAULT_ESTIMATED_ITEM_HEIGHT = 40;

export const VirtualList: FC<VirtualListProps> = ({
  className,
  type = 'none',
  items = [],
  estimatedItemHeight = DEFAULT_ESTIMATED_ITEM_HEIGHT,
}) => {
  const ref = useRef<HTMLOListElement | HTMLUListElement>(null);

  const [contentHeight, setContentHeight] = useState<number>(
    ref.current ? getElementsContentBoxSize(ref.current).height : 0,
  );

  const listResizeHandler = useHandler((entries: ResizeObserverEntry[]) => {
    if (entries.length) {
      const {
        contentRect: {height},
      } = entries[0]!;

      if (height !== contentHeight) {
        setContentHeight(height);
      }
    }
  });
  const [observe, unobserve] = useResizeObserver(listResizeHandler);

  useLayoutEffect(() => {
    observe(ref);

    if (ref.current) {
      setContentHeight(getElementsContentBoxSize(ref.current).height);
    }

    return () => unobserve(ref);
  }, []);

  const isListOrdered = olTypeSet.has(type);

  return (
    <List
      className={list({type, className})}
      ordered={isListOrdered}
      listRef={ref}
      onScroll={console.log}
    >
      {null}
    </List>
  );
};
