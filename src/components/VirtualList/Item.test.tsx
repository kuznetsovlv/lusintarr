import type {RefObject} from 'react';
import {render, screen} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import Item from './Item';
import type {VirtualListMarkerProps} from './types';

type ListItemRef = RefObject<HTMLLIElement | null>;

const Marker = ({index}: VirtualListMarkerProps) => (
  <span data-testid="custom-marker">Marker {index}</span>
);

const mocks = vi.hoisted(() => ({
  observe: vi.fn<(ref: ListItemRef) => void>(),
  unobserve: vi.fn<(ref: ListItemRef) => void>(),
  resizeHandler: undefined as
    ((entries: ResizeObserverEntry[]) => void) | undefined,
}));

vi.mock('react-swissbit', async () => {
  const {useLayoutEffect} = await import('react');

  return {
    useHandler: <T,>(handler: T): T => handler,

    useResizeObserver: (handler: (entries: ResizeObserverEntry[]) => void) => {
      mocks.resizeHandler = handler;

      return [mocks.observe, mocks.unobserve] as const;
    },

    useOnLayoutMount: (handler: () => void) => {
      useLayoutEffect(() => {
        handler();
      }, [handler]);
    },

    useOnUnmount: (handler: () => void) => {
      useLayoutEffect(
        () => () => {
          handler();
        },
        [handler],
      );
    },
  };
});

/**
 * Mocks the rendered height returned by `getBoundingClientRect`.
 *
 * @param height - Height to return in CSS pixels.
 * @returns The created spy so its return value can be changed later.
 */
function mockElementHeight(height: number) {
  return vi
    .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockReturnValue(new DOMRect(0, 0, 100, height));
}

/**
 * Creates the minimal ResizeObserver entry required by Item.
 *
 * @param target - Element reported as resized.
 * @returns A ResizeObserver entry containing the target element.
 */
function createResizeEntry(target: Element): ResizeObserverEntry {
  return {target} as ResizeObserverEntry;
}

describe('Item', () => {
  beforeEach(() => {
    mocks.observe.mockClear();
    mocks.unobserve.mockClear();
    mocks.resizeHandler = undefined;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders its content at the requested vertical offset', () => {
    mockElementHeight(40);

    render(
      <Item index={2} shift={120} position="outside" onResize={vi.fn()}>
        Earth
      </Item>,
    );

    const item = screen.getByRole('listitem');

    expect(item).toHaveTextContent('Earth');
    expect(item).toHaveStyle({
      top: '120px',
    });
  });

  it('starts observing the item and reports its initial height on layout mount', () => {
    mockElementHeight(72);

    const onResize = vi.fn();

    render(
      <Item index={3} shift={0} position="outside" onResize={onResize}>
        Mars
      </Item>,
    );

    const item = screen.getByRole('listitem');

    expect(mocks.observe).toHaveBeenCalledTimes(1);
    expect(mocks.observe).toHaveBeenCalledWith(
      expect.objectContaining({
        current: item,
      }),
    );

    expect(onResize).toHaveBeenCalledWith(72, 3);
  });

  it('reports a changed height observed by ResizeObserver', () => {
    const getBoundingClientRect = mockElementHeight(40);
    const onResize = vi.fn();

    render(
      <Item index={4} shift={0} position="outside" onResize={onResize}>
        Jupiter
      </Item>,
    );

    const item = screen.getByRole('listitem');

    onResize.mockClear();

    getBoundingClientRect.mockReturnValue(new DOMRect(0, 0, 100, 96));

    mocks.resizeHandler?.([createResizeEntry(item)]);

    expect(onResize).toHaveBeenCalledTimes(1);
    expect(onResize).toHaveBeenCalledWith(96, 4);
  });

  it('ignores an empty ResizeObserver entry list', () => {
    mockElementHeight(40);

    const onResize = vi.fn();

    render(
      <Item index={5} shift={0} position="outside" onResize={onResize}>
        Saturn
      </Item>,
    );

    onResize.mockClear();

    mocks.resizeHandler?.([]);

    expect(onResize).not.toHaveBeenCalled();
  });

  it('stops observing the same ref when unmounted', () => {
    mockElementHeight(40);

    const {unmount} = render(
      <Item index={6} shift={0} position="outside" onResize={vi.fn()}>
        Uranus
      </Item>,
    );

    const item = screen.getByRole('listitem');

    expect(mocks.observe).toHaveBeenCalledTimes(1);

    const observedRef = mocks.observe.mock.calls[0]![0];

    expect(observedRef).toEqual(
      expect.objectContaining({
        current: item,
      }),
    );

    unmount();

    expect(mocks.unobserve).toHaveBeenCalledTimes(1);
    expect(mocks.unobserve).toHaveBeenCalledWith(observedRef);
  });

  it('renders a custom marker with the source item index', () => {
    render(
      <Item
        index={4}
        shift={0}
        Marker={Marker}
        position="outside"
        onResize={vi.fn()}
      >
        Jupiter
      </Item>,
    );

    expect(screen.getByTestId('custom-marker')).toHaveTextContent('Marker 4');
  });

  it('hides a custom marker from assistive technologies', () => {
    render(
      <Item
        index={2}
        shift={0}
        Marker={Marker}
        position="outside"
        onResize={vi.fn()}
      >
        Earth
      </Item>,
    );

    const marker = screen.getByTestId('custom-marker');
    const markerContainer = marker.parentElement;

    expect(markerContainer).toHaveAttribute('aria-hidden', 'true');
  });

  it('positions an outside custom marker before the item inline start', () => {
    render(
      <Item
        index={1}
        shift={0}
        Marker={Marker}
        position="outside"
        onResize={vi.fn()}
      >
        Venus
      </Item>,
    );

    const markerContainer = screen.getByTestId('custom-marker').parentElement;

    expect(markerContainer).not.toBeNull();
    expect(markerContainer!.style.position).toBe('absolute');
    expect(markerContainer!.style.insetInlineEnd).toBe('100%');
  });

  it('keeps an inside custom marker in the normal item flow', () => {
    render(
      <Item
        index={1}
        shift={0}
        Marker={Marker}
        position="inside"
        onResize={vi.fn()}
      >
        Venus
      </Item>,
    );

    const markerContainer = screen.getByTestId('custom-marker').parentElement;

    expect(markerContainer).not.toBeNull();
    expect(markerContainer!.style.position).toBe('');
    expect(markerContainer!.style.insetInlineEnd).toBe('');
  });
});
