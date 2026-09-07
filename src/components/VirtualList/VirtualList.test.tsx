import type {ReactNode, RefObject} from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {VirtualList} from './VirtualList';

interface RenderDataSource {
  items: ReactNode[];
  estimatedItemHeight: number;
  scroll: number;
  contentAreaHeight: number;
}

type RenderData = [list: ReactNode[], start: number, fullHeight: number];

type ResizeHandler = (entries: ResizeObserverEntry[]) => void;
type ElementRef = RefObject<HTMLElement | null>;

const mocks = vi.hoisted(() => ({
  useRenderData: vi.fn<(source: RenderDataSource) => RenderData>(),

  getElementContentViewportSize:
    vi.fn<(element: HTMLElement) => {width: number; height: number}>(),

  coverObserve: vi.fn<(ref: ElementRef) => void>(),
  coverUnobserve: vi.fn<(ref: ElementRef) => void>(),

  listObserve: vi.fn<(ref: ElementRef) => void>(),
  listUnobserve: vi.fn<(ref: ElementRef) => void>(),

  resizeHandlers: [] as ResizeHandler[],
  resizeObserverCall: 0,

  layoutMountHandler: undefined as (() => void) | undefined,
  unmountHandler: undefined as (() => void) | undefined,
}));

vi.mock('@/utils', () => ({
  getElementContentViewportSize: mocks.getElementContentViewportSize,
}));

vi.mock('./useRenderData', () => ({
  default: mocks.useRenderData,
}));

vi.mock('react-swissbit', () => ({
  useHandler: <T,>(handler: T): T => handler,

  useResizeObserver: (handler: ResizeHandler) => {
    const index = mocks.resizeObserverCall % 2;

    mocks.resizeHandlers[index] = handler;
    ++mocks.resizeObserverCall;

    return index === 0
      ? [mocks.coverObserve, mocks.coverUnobserve]
      : [mocks.listObserve, mocks.listUnobserve];
  },

  useOnLayoutMount: (handler: () => void) => {
    mocks.layoutMountHandler = handler;
  },

  useOnUnmount: (handler: () => void) => {
    mocks.unmountHandler = handler;
  },
}));

/**
 * Returns the scrollable viewport containing the semantic list.
 */
function getViewport(): HTMLDivElement {
  const parent = screen.getByRole('list').parentElement;

  if (!(parent instanceof HTMLDivElement)) {
    throw new Error('Expected list to be rendered inside a div');
  }

  return parent;
}

/**
 * Creates the minimal ResizeObserver entry required by VirtualList tests.
 *
 * @param target - Element associated with the resize observation.
 * @param height - Observed content-box height in CSS pixels.
 */
function createResizeEntry(
  target: Element,
  height: number,
): ResizeObserverEntry {
  return {
    target,
    contentRect: new DOMRect(0, 0, 300, height),
  } as ResizeObserverEntry;
}

describe('VirtualList', () => {
  beforeEach(() => {
    mocks.useRenderData.mockReset();
    mocks.useRenderData.mockReturnValue([
      [<li key="visible">Visible item</li>],
      0,
      400,
    ]);

    mocks.getElementContentViewportSize.mockReset();
    mocks.getElementContentViewportSize.mockReturnValue({
      width: 300,
      height: 200,
    });

    mocks.coverObserve.mockReset();
    mocks.coverUnobserve.mockReset();
    mocks.listObserve.mockReset();
    mocks.listUnobserve.mockReset();

    mocks.resizeHandlers.length = 0;
    mocks.resizeObserverCall = 0;
    mocks.layoutMountHandler = undefined;
    mocks.unmountHandler = undefined;
  });

  it.each(['none', 'disc', 'circle', 'square'] as const)(
    'renders "%s" as an unordered list',
    (type) => {
      render(<VirtualList type={type} />);

      expect(screen.getByRole('list').tagName).toBe('UL');
    },
  );

  it.each(['1', 'A', 'a', 'I', 'i'] as const)(
    'renders "%s" as an ordered list',
    (type) => {
      render(<VirtualList type={type} />);

      expect(screen.getByRole('list').tagName).toBe('OL');
    },
  );

  it('uses the virtual start index together with startFrom', () => {
    mocks.useRenderData.mockReturnValue([
      [<li key="visible">Visible item</li>],
      4,
      400,
    ]);

    render(<VirtualList type="1" startFrom={100} />);

    expect(screen.getByRole('list')).toHaveAttribute('start', '104');
  });

  it('applies the consumer class name to the scrollable viewport', () => {
    render(<VirtualList className="consumer-class" />);

    const cover = getViewport();

    expect(cover).toHaveClass('consumer-class');
    expect(cover).toHaveClass('ltw:overflow-auto');
  });

  it('applies list type and marker position styles', () => {
    render(<VirtualList type="disc" position="inside" />);

    const semanticList = screen.getByRole('list');

    expect(semanticList).toHaveClass('ltw:list-disc');
    expect(semanticList).toHaveClass('ltw:list-inside');
  });

  it('passes source data and default viewport state to useRenderData', () => {
    const items: ReactNode[] = ['Mercury', 'Venus', 'Earth'];

    render(<VirtualList items={items} estimatedItemHeight={64} />);

    expect(mocks.useRenderData).toHaveBeenLastCalledWith({
      items,
      estimatedItemHeight: 64,
      scroll: 0,
      contentAreaHeight: 0,
    });
  });

  it('renders the nodes returned by useRenderData', () => {
    mocks.useRenderData.mockReturnValue([
      [<li key="earth">Earth</li>, <li key="mars">Mars</li>],
      2,
      400,
    ]);

    render(<VirtualList />);

    expect(screen.getByText('Earth')).toBeInTheDocument();
    expect(screen.getByText('Mars')).toBeInTheDocument();
  });

  it('sets the semantic list to the estimated full height', () => {
    mocks.useRenderData.mockReturnValue([
      [<li key="visible">Visible item</li>],
      0,
      720,
    ]);

    render(<VirtualList />);

    expect(screen.getByRole('list')).toHaveStyle({
      height: '720px',
    });
  });

  it('observes the viewport and list and measures the viewport on layout mount', () => {
    const items: ReactNode[] = ['Mercury', 'Venus'];

    render(<VirtualList items={items} />);

    const cover = getViewport();
    const semanticList = screen.getByRole('list');

    act(() => {
      mocks.layoutMountHandler?.();
    });

    expect(mocks.coverObserve).toHaveBeenCalledTimes(1);
    expect(mocks.coverObserve).toHaveBeenCalledWith(
      expect.objectContaining({
        current: cover,
      }),
    );

    expect(mocks.listObserve).toHaveBeenCalledTimes(1);
    expect(mocks.listObserve).toHaveBeenCalledWith(
      expect.objectContaining({
        current: semanticList,
      }),
    );

    expect(mocks.getElementContentViewportSize).toHaveBeenCalledWith(cover);

    expect(mocks.useRenderData).toHaveBeenLastCalledWith({
      items,
      estimatedItemHeight: 40,
      scroll: 0,
      contentAreaHeight: 200,
    });
  });

  it('updates the scroll position after native scrolling', () => {
    const items: ReactNode[] = ['Mercury', 'Venus', 'Earth'];

    render(<VirtualList items={items} />);

    const cover = getViewport();

    cover.scrollTop = 75;
    fireEvent.scroll(cover);

    expect(mocks.useRenderData).toHaveBeenLastCalledWith({
      items,
      estimatedItemHeight: 40,
      scroll: 75,
      contentAreaHeight: 0,
    });
  });

  it('uses the viewport ResizeObserver contentRect height', () => {
    render(<VirtualList />);

    act(() => {
      mocks.layoutMountHandler?.();
    });

    const cover = getViewport();

    act(() => {
      mocks.resizeHandlers[0]?.([createResizeEntry(cover, 160)]);
    });

    expect(mocks.useRenderData).toHaveBeenLastCalledWith(
      expect.objectContaining({
        contentAreaHeight: 160,
      }),
    );
  });

  it('ignores an empty viewport ResizeObserver entry list', () => {
    render(<VirtualList />);

    act(() => {
      mocks.layoutMountHandler?.();
    });

    const callCount = mocks.useRenderData.mock.calls.length;

    act(() => {
      mocks.resizeHandlers[0]?.([]);
    });

    expect(mocks.useRenderData).toHaveBeenCalledTimes(callCount);
  });

  it('does not update the viewport height when ResizeObserver reports the same height', () => {
    render(<VirtualList />);

    act(() => {
      mocks.layoutMountHandler?.();
    });

    const cover = getViewport();
    const callCount = mocks.useRenderData.mock.calls.length;

    act(() => {
      mocks.resizeHandlers[0]?.([createResizeEntry(cover, 200)]);
    });

    expect(mocks.useRenderData).toHaveBeenCalledTimes(callCount);
  });

  it('remeasures the viewport when the semantic list changes size', () => {
    render(<VirtualList />);

    act(() => {
      mocks.layoutMountHandler?.();
    });

    mocks.getElementContentViewportSize.mockReturnValue({
      width: 300,
      height: 185,
    });

    act(() => {
      mocks.resizeHandlers[1]?.([]);
    });

    expect(mocks.useRenderData).toHaveBeenLastCalledWith(
      expect.objectContaining({
        contentAreaHeight: 185,
      }),
    );
  });

  it('unobserves both elements during cleanup', () => {
    render(<VirtualList />);

    const cover = getViewport();
    const semanticList = screen.getByRole('list');

    act(() => {
      mocks.layoutMountHandler?.();
    });

    act(() => {
      mocks.unmountHandler?.();
    });

    expect(mocks.coverUnobserve).toHaveBeenCalledWith(
      expect.objectContaining({
        current: cover,
      }),
    );

    expect(mocks.listUnobserve).toHaveBeenCalledWith(
      expect.objectContaining({
        current: semanticList,
      }),
    );
  });
});
