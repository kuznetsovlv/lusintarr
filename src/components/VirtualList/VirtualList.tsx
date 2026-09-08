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
import type {VirtualListEstimatedItemHeight} from './types';

/** Marker types supported by native ordered HTML lists. */
type OlType = NonNullable<ComponentProps<'ol'>['type']>;

/** Marker types supported by unordered VirtualList instances. */
type UlType = 'none' | 'disc' | 'circle' | 'square';

/**
 * List marker type.
 *
 * Ordered-list marker types cause VirtualList to render an `ol`; unordered
 * marker types cause it to render a `ul`.
 */
type Type = OlType | UlType;

export interface VirtualListProps {
  /** CSS class applied to the scrollable viewport element. */
  className?: string;

  /**
   * Marker type used by the list.
   *
   * Ordered marker types (`"1"`, `"A"`, `"a"`, `"I"`, `"i"`) render an
   * `ol`. Other values render a `ul`.
   *
   * @defaultValue `"none"`
   */
  type?: Type;

  /**
   * React nodes contained in the list.
   *
   * Only the nodes required to cover the current viewport are rendered.
   *
   * @defaultValue `[]`
   */
  items?: ReactNode[];

  /**
   * Estimated item height in CSS pixels.
   *
   * A number applies the same initial estimate to every unmeasured item.
   * A function receives the zero-based source item index and can provide a
   * different estimate for each item.
   *
   * Once an item is rendered, its actual measured height takes precedence over
   * the estimate.
   *
   * Negative estimates are normalized to zero.
   *
   * @defaultValue `40`
   */
  estimatedItemHeight?: VirtualListEstimatedItemHeight;

  /**
   * Position of list markers relative to item content.
   *
   * When omitted, the browser's default `list-style-position` is preserved.
   */
  position?: 'inside' | 'outside';

  /**
   * Ordinal assigned to the first source item of an ordered list.
   *
   * The value is combined with the zero-based index of the first currently
   * rendered item so that virtualization preserves correct numbering.
   *
   * @defaultValue `1`
   */
  startFrom?: number;
}

/** Ordered-list marker types recognized by VirtualList. */
const olTypes: OlType[] = ['1', 'A', 'a', 'I', 'i'];

/** Lookup used to determine whether the semantic list should be an `ol`. */
const olTypeSet = new Set<Type>(olTypes);

/** Default height estimate for items that have not yet been measured. */
const DEFAULT_ESTIMATED_ITEM_HEIGHT = 40;

/** Default ordinal of the first source item in an ordered list. */
const DEFAULT_START_FROM = 1;

/**
 * Renders a vertically virtualized semantic list.
 *
 * VirtualList preserves native browser scrolling while mounting only the
 * items required to cover the visible viewport. Item heights are estimated
 * until the corresponding DOM elements are rendered and measured.
 *
 * The semantic list is given the estimated full height of all source items,
 * allowing the browser to expose a native scrollbar for content that is not
 * currently present in the DOM.
 */
export const VirtualList: FC<VirtualListProps> = ({
  className,
  type = 'none',
  items = [],
  estimatedItemHeight = DEFAULT_ESTIMATED_ITEM_HEIGHT,
  position,
  startFrom = DEFAULT_START_FROM,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement | HTMLUListElement>(null);

  const [contentAreaHeight, setContentAreaHeight] = useState<number>(0);
  const [scroll, setScroll] = useState<number>(0);

  /**
   * Updates the available viewport height when the viewport itself is resized.
   *
   * ResizeObserver provides the current content-box height directly through
   * the observation entry.
   */
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

  /**
   * Remeasures the viewport when the semantic list changes size.
   *
   * A change in list width can cause a horizontal scrollbar to appear or
   * disappear, which can change the vertical space available inside the
   * viewport even when the viewport's outer dimensions remain unchanged.
   */
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

  /**
   * Stores the current native vertical scroll offset for virtualization
   * calculations.
   */
  const handleScroll = useHandler(({currentTarget}: UIEvent<HTMLDivElement>) =>
    setScroll(currentTarget.scrollTop ?? 0),
  );

  const [itemList, start, fullHeight] = useRenderData({
    items,
    estimatedItemHeight,
    scroll,
    contentAreaHeight,
  });

  /*
   * Represent the height of the complete source list in the DOM so that the
   * browser can provide native scrolling even though only visible items are
   * actually rendered.
   */
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
        start={start + startFrom}
      >
        {itemList}
      </List>
    </div>
  );
};
