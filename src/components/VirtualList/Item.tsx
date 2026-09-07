import type {FC, ReactNode} from 'react';
import {memo, useRef} from 'react';
import {
  useResizeObserver,
  useHandler,
  useOnLayoutMount,
  useOnUnmount,
} from 'react-swissbit';

interface ItemProps {
  /** Content rendered inside the list item. */
  children: ReactNode;

  /** Index of the item in the source VirtualList items array. */
  index: number;

  /** Vertical offset of the item from the top of the virtual list canvas. */
  shift: number;

  /**
   * Called when the item's rendered height is measured or changes.
   *
   * @param height - Current rendered height of the item in CSS pixels.
   * @param index - Index of the item in the source VirtualList items array.
   */
  onResize: (height: number, index: number) => void;
}

/**
 * Renders and measures a single visible VirtualList item.
 *
 * The item is absolutely positioned inside the virtual list canvas using
 * `shift` as its vertical offset. Its rendered height is measured immediately
 * after layout and monitored for subsequent changes with ResizeObserver.
 */
const Item: FC<ItemProps> = ({children, index, shift, onResize}) => {
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
      {children}
    </li>
  );
};

export default memo(Item);
