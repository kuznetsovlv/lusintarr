import type {FC, ReactNode} from 'react';
import {memo, useRef} from 'react';
import {
  useResizeObserver,
  useHandler,
  useOnLayoutMount,
  useOnUnmount,
} from 'react-swissbit';
import type {VirtualListMarkerProps} from './types';

interface ItemProps {
  /** Content rendered inside the list item. */
  children: ReactNode;

  /** Zero-based index of the item in the source array. */
  index: number;

  /** Vertical offset of the item from the top of the virtual list canvas. */
  shift: number;

  /**
   * Optional custom decorative marker component rendered for this item.
   *
   * The marker receives the item's zero-based source index and is hidden from
   * assistive technologies.
   */
  Marker?: FC<VirtualListMarkerProps>;

  /**
   * Position of a custom marker relative to the item content.
   *
   * Outside markers are absolutely positioned immediately before the item's
   * inline-start edge. Inside markers remain in the normal item content flow.
   */
  position: 'inside' | 'outside';

  /**
   * Called when the item's rendered height is measured or changes.
   *
   * @param height - Current rendered item height in CSS pixels.
   * @param index - Zero-based index of the item in the source array.
   */
  onResize: (height: number, index: number) => void;
}

/**
 * Renders and measures a single visible VirtualList item.
 *
 * The item is absolutely positioned within the virtual list canvas using
 * `shift` as its vertical offset. Its rendered height is measured immediately
 * after layout and monitored for subsequent changes with ResizeObserver.
 *
 * When provided, a custom decorative marker is rendered before the item
 * content. Outside markers are positioned independently of the measured item
 * width and do not contribute to the item's measured size.
 */
const Item: FC<ItemProps> = ({
  children,
  index,
  shift,
  Marker,
  position,
  onResize,
}) => {
  const ref = useRef<HTMLLIElement>(null);

  /**
   * Reports the current rendered height when ResizeObserver detects a size
   * change.
   */
  const resizeHandler = useHandler((entries: ResizeObserverEntry[]) => {
    if (entries.length) {
      const {target} = entries[0]!;

      const {height} = target.getBoundingClientRect();

      onResize(height, index);
    }
  });

  const [observe, unobserve] = useResizeObserver(resizeHandler);

  useOnLayoutMount(() => {
    observe(ref);

    if (ref.current) {
      const {height} = ref.current.getBoundingClientRect();
      onResize(height, index);
    }
  });

  useOnUnmount(() => {
    unobserve(ref);
  });

  return (
    <li
      className="ltw:bg-transparent ltw:w-fit ltw:h-fit ltw:p-0 ltw:m-0 ltw:border-0 ltw:absolute"
      style={{top: `${shift}px`}}
      ref={ref}
    >
      {!!Marker && (
        <span
          aria-hidden="true"
          className="ltw:bg-transparent"
          style={
            position === 'outside'
              ? {position: 'absolute', insetInlineEnd: '100%'}
              : undefined
          }
        >
          <Marker index={index} />
        </span>
      )}
      {children}
    </li>
  );
};

export default memo(Item);
