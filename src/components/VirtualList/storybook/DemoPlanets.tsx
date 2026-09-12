import {useMemo} from 'react';
import type {FC} from 'react';
import {tv} from 'tailwind-variants';
import {useToggle} from 'react-swissbit';

import {VirtualList} from '../VirtualList';
import type {VirtualListProps} from '../VirtualList';
import type {Planet, DemoProps, Layout} from './types';
import type {VirtualListMarkerProps} from '../types';

export interface DemoPlanetsProps
  extends Omit<VirtualListProps, 'items' | 'className'>, DemoProps {
  items: Planet[];
  itemLayout: Layout;
}

interface ItemProps
  extends Omit<VirtualListProps, 'items' | 'className'>, Planet {
  layout: Layout;
}

const button = tv({
  base: 'ltw:w-100 ltw:rounded-md ltw:border ltw:border-[var(--lus-demo-border)] ltw:bg-[var(--lus-demo-surface)] ltw:px-3 ltw:py-2 ltw:text-left ltw:text-[var(--lus-demo-text)] ltw:shadow-sm ltw:font-sans ltw:text-sm',
  variants: {
    layout: {
      inline: 'ltw:inline',
      block: 'ltw:block',
    },
  },
});

const Item: FC<ItemProps> = ({layout, radius, name, satellites, ...props}) => {
  const [isOpen, {toggle}] = useToggle(false);
  const buttonHeight = Math.floor(80 * Math.sqrt(radius));

  return (
    <>
      <button
        type="button"
        className={button({layout})}
        style={{height: `${buttonHeight}px`}}
        onClick={toggle}
      >
        {name} (Click to {isOpen ? 'collapse' : 'expand'} list of satellites)
      </button>
      <div
        aria-hidden={!isOpen}
        className="ltw:grid ltw:transition-[grid-template-rows,opacity] ltw:duration-300"
        style={{
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="ltw:min-h-0 ltw:overflow-hidden">
          <div className="ltw:pl-5 ltw:pt-2 ltw:font-sans ltw:text-xs ltw:leading-6 ltw:text-(--lus-demo-text-muted)">
            <div className="ltw:mb-1 ltw:font-medium ltw:text-(--lus-demo-accent-soft)">
              {satellites.length
                ? 'List of known satellites:'
                : 'No known satellites'}
            </div>

            {!!satellites.length && (
              <VirtualList
                items={satellites}
                {...props}
                className="ltw:font-sans ltw:text-sm ltw:leading-6"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const DemoPlanets: FC<DemoPlanetsProps> = ({
  title,
  useMarkerSpaceSize,
  markerSpaceSize: currentMarkerSpacesize,
  type,
  position,
  itemLayout,
  items,
  ...props
}) => {
  const markerSpaceSize = useMarkerSpaceSize
    ? currentMarkerSpacesize
    : undefined;

  const listItems = useMemo(
    () =>
      items.map((item) => (
        <Item
          {...item}
          key={item.id}
          layout={itemLayout}
          type={type}
          position={position}
          markerSpaceSize={markerSpaceSize}
        />
      )),
    [items, itemLayout, type, position, markerSpaceSize],
  );

  const listKey = [
    itemLayout,
    typeof type === 'function' ? 'custom' : type,
    position ?? 'default',
    markerSpaceSize ?? 'auto',
  ].join(':');

  return (
    <>
      <h1 className="ltw:mb-4 ltw:text-3xl ltw:font-semibold ltw:text-(--lus-demo-heading)">
        {title}
      </h1>
      <VirtualList
        key={listKey}
        {...props}
        className="ltw:h-120 ltw:rounded-lg ltw:border ltw:border-(--lus-demo-border) ltw:bg-(--lus-demo-background) ltw:p-3 ltw:text-(--lus-demo-text)"
        markerSpaceSize={markerSpaceSize}
        type={type}
        position={position}
        items={listItems}
      />
    </>
  );
};

export default DemoPlanets;

const Moon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient
        id="silverGradient"
        x1="6"
        y1="3"
        x2="18"
        y2="21"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#f8fbff" />
        <stop offset="0.22" stopColor="#dfe8f5" />
        <stop offset="0.5" stopColor="#b7c4d8" />
        <stop offset="0.78" stopColor="#8e9cb2" />
        <stop offset="1" stopColor="#dfe7f2" />
      </linearGradient>

      <radialGradient
        id="silverHighlight"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(9 8) rotate(55) scale(8 10)"
      >
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>

      <mask id="crescentMask">
        <rect width="24" height="24" fill="black" />
        <circle cx="12" cy="12" r="8" fill="white" />
        <circle cx="15.5" cy="10.5" r="7.2" fill="black" />
      </mask>
    </defs>

    <circle
      cx="12"
      cy="12"
      r="8"
      fill="url(#silverGradient)"
      mask="url(#crescentMask)"
    />
    <circle
      cx="12"
      cy="12"
      r="8"
      fill="url(#silverHighlight)"
      mask="url(#crescentMask)"
    />
    <circle
      cx="12"
      cy="12"
      r="8"
      mask="url(#crescentMask)"
      stroke="#eef4ff"
      strokeOpacity="0.85"
      strokeWidth="0.8"
    />
  </svg>
);

const MultiMoon: FC<VirtualListMarkerProps> = ({index}) =>
  useMemo(() => {
    const arr = Array.from(new Array(Math.max(0, Math.ceil(index))).keys());

    return arr.map((_, key) => <Moon key={key} />);
  }, [index]);

export const CustomMarker: FC<VirtualListMarkerProps> = ({index}) => {
  const count = index + 1;

  return (
    <span className="ltw:inline-flex ltw:justify-end ltw:flex-nowrap ltw:gap-1 ltw:items-center ltw:me-1 ltw:w-fit">
      {count <= 3 ? (
        <MultiMoon index={count} />
      ) : (
        <>
          {count} <Moon />
        </>
      )}
    </span>
  );
};
