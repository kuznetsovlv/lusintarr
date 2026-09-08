import type {ComponentProps, FC} from 'react';

/**
 * Returns an estimated height for a VirtualList item.
 *
 * The getter receives the zero-based index of the item in the source array.
 * Its result is used only until the actual item height has been measured.
 *
 * @param index - Zero-based index of the item in the source array.
 * @returns Estimated item height in CSS pixels.
 */
export type VirtualListEstimatedItemHeightGetter = (index: number) => number;

/**
 * Initial height estimate used for VirtualList items that have not yet been
 * measured.
 *
 * A number applies the same estimate to every item. A getter can provide a
 * different estimate for each item based on its zero-based source index.
 *
 * Negative estimates are normalized to zero.
 */
export type VirtualListEstimatedItemHeight =
  number | VirtualListEstimatedItemHeightGetter;

export interface VirtualListMarkerProps {
  index: number;
}

/** Marker types supported by native ordered HTML lists. */
export type VirtualListOlType = NonNullable<ComponentProps<'ol'>['type']>;

/** Marker types supported by unordered VirtualList instances. */
export type VirtualListUlType = 'none' | 'disc' | 'circle' | 'square';

/**
 * List marker type.
 *
 * Ordered-list marker types cause VirtualList to render an `ol`; unordered
 * marker types cause it to render a `ul`.
 */
export type VirtualListType =
  VirtualListOlType | VirtualListUlType | FC<VirtualListMarkerProps>;
