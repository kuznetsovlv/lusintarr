import type {FC, ReactNode} from 'react';
import {memo, useRef} from 'react';
import {
  useResizeObserver,
  useHandler,
  useOnLayoutMount,
  useOnUnmount,
} from 'react-swissbit';

interface ItemProps {
  children: ReactNode;
  index: number;
  shift: number;
  onResize: (h: number, i: number) => void;
}

const Item: FC<ItemProps> = ({children, index, shift, onResize}) => {
  const ref = useRef<HTMLLIElement>(null);

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
      className="ltw:bg-transparent ltw:w-fit-content ltw:h-fit-content ltw:p-0 ltw:m-0 ltw:border-0 ltw:absolute"
      style={{top: `${shift}px`}}
      ref={ref}
    >
      {children}
    </li>
  );
};

export default memo(Item);
