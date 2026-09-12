import type {FC, ReactNode, UIEvent} from 'react';
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
import type {
  VirtualListEstimatedItemHeight,
  VirtualListType,
  VirtualListOlType,
} from './types';

export interface VirtualListProps {
  /** CSS class applied to the scrollable viewport element. */
  className?: string;

  /**
   * Marker type or custom marker component.
   *
   * Ordered marker types (`"1"`, `"A"`, `"a"`, `"I"`, `"i"`) render an
   * `ol`. Unordered marker types render a `ul`.
   *
   * A React component can be provided instead to render a custom decorative
   * marker for each visible item.
   *
   * @defaultValue `"none"`
   */
  type?: VirtualListType;

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
   * When omitted, VirtualList starts with a default estimate of 40 CSS pixels
   * and gradually refines estimates for unmeasured items using the average
   * height of items measured so far.
   *
   * When an explicit estimate is provided, it is used as supplied and is not
   * automatically adjusted from measured heights.
   *
   * Actual measurements always take precedence over estimates.
   *
   * @defaultValue `40`
   */
  estimatedItemHeight?: VirtualListEstimatedItemHeight;

  /**
   * Position of the list marker relative to item content.
   *
   * Applies to both built-in and custom markers. Custom markers positioned
   * outside are rendered immediately before the item's inline-start edge.
   *
   * When omitted, outside positioning is used for custom markers while built-in
   * markers retain the browser's default positioning.
   */
  position?: 'inside' | 'outside';

  /**
   * Inline space reserved for an outside list marker, in CSS pixels.
   *
   * When provided, the value overrides the list's default inline-start padding
   * while markers are positioned outside. This can be useful for custom markers
   * that need more or less space than the browser normally reserves.
   *
   * The value has no effect when markers are disabled or positioned inside.
   *
   * When omitted, the browser's default list padding is preserved.
   */
  markerSpaceSize?: number;

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
const olTypes: VirtualListOlType[] = ['1', 'A', 'a', 'I', 'i'];

/** Lookup used to determine whether the semantic list should be an `ol`. */
const olTypeSet = new Set<VirtualListType>(olTypes);

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
  estimatedItemHeight: originalEstimatedItemHeight,
  position,
  markerSpaceSize,
  startFrom = DEFAULT_START_FROM,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement | HTMLUListElement>(null);

  const [contentAreaHeight, setContentAreaHeight] = useState<number>(0);
  const [scroll, setScroll] = useState<number>(0);

  const estimatedItemHeight =
    originalEstimatedItemHeight ?? DEFAULT_ESTIMATED_ITEM_HEIGHT;
  const useAverageHeight = originalEstimatedItemHeight === undefined;

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
    type,
    position,
    useAverageHeight,
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

  const listStyle =
    markerSpaceSize !== undefined && type !== 'none' && position !== 'inside'
      ? {paddingInlineStart: markerSpaceSize}
      : undefined;

  const listType = typeof type === 'function' ? 'custom' : type;

  return (
    <div className={viewport({className})} ref={ref} onScroll={handleScroll}>
      <List
        className={list({type: listType, position})}
        ordered={isListOrdered}
        listRef={listRef}
        start={start + startFrom}
        style={listStyle}
      >
        {itemList}
      </List>
    </div>
  );
};
