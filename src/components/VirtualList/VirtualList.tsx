import type {FC, ComponentProps, ReactNode} from 'react';
import {useRef} from 'react';
import cn from 'classnames';
import {useResizeObserver} from 'react-swissbit';
import {tv} from 'tailwind-variants';

import List from './List';

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

const list = tv({
  variants: {
    type: {
      none: 'ltw:list-none',
      disc: 'ltw:list-disc',
      circle: 'ltw:list-[circle]',
      square: 'ltw:list-[square]',
      '1': 'ltw:list-decimal',
      A: 'ltw:list-[upper-alpha]',
      a: 'ltw:list-[lower-alpha]',
      I: 'ltw:list-[upper-roman]',
      i: 'ltw:list-[lower-roman]',
    },
  },
});

export const VirtualList: FC<VirtualListProps> = ({
  className,
  type = 'none',
  items = [],
  estimatedItemHeight = DEFAULT_ESTIMATED_ITEM_HEIGHT,
}) => {
  const ref = useRef<HTMLOListElement | HTMLUListElement>(null);

  const isListOrdered = olTypeSet.has(type);

  return (
    <List
      className={list({type, className})}
      ordered={isListOrdered}
      listRef={ref}
    >
      {null}
    </List>
  );
};
