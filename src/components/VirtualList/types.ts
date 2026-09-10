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

/**
 * Props passed to a custom VirtualList marker component.
 *
 * Custom markers are decorative and are hidden from assistive technologies.
 * They should not contain interactive or otherwise semantically meaningful
 * content.
 */
export interface VirtualListMarkerProps {
  /** Zero-based index of the corresponding item in the source array. */
  index: number;
}

/** Marker types supported by native ordered HTML lists. */
export type VirtualListOlType = NonNullable<ComponentProps<'ol'>['type']>;

/** Marker types supported by unordered VirtualList instances. */
export type VirtualListUlType = 'none' | 'disc' | 'circle' | 'square';

/**
 * Marker configuration used by VirtualList.
 *
 * String values select one of the built-in ordered or unordered list marker
 * styles. A React component can be provided to render a custom decorative
 * marker for each visible item.
 *
 * Custom marker components receive the zero-based source item index through
 * {@link VirtualListMarkerProps}.
 */
export type VirtualListType =
  VirtualListOlType | VirtualListUlType | FC<VirtualListMarkerProps>;
