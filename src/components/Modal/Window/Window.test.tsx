import {fireEvent, render, screen} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import Window from './Window';

let restorePointerCapture: () => void;

beforeEach(() => {
  restorePointerCapture = installPointerCaptureMock();
});

afterEach(() => {
  restorePointerCapture();
  vi.restoreAllMocks();
});

function installPointerCaptureMock() {
  const capturedPointers = new WeakMap<Element, Set<number>>();

  Object.defineProperties(HTMLElement.prototype, {
    setPointerCapture: {
      configurable: true,
      value: function (this: HTMLElement, pointerId: number) {
        let pointers = capturedPointers.get(this);

        if (!pointers) {
          pointers = new Set();
          capturedPointers.set(this, pointers);
        }

        pointers.add(pointerId);
      },
    },

    hasPointerCapture: {
      configurable: true,
      value: function (this: HTMLElement, pointerId: number) {
        return capturedPointers.get(this)?.has(pointerId) ?? false;
      },
    },

    releasePointerCapture: {
      configurable: true,
      value: function (this: HTMLElement, pointerId: number) {
        capturedPointers.get(this)?.delete(pointerId);
      },
    },
  });

  return () => {
    Reflect.deleteProperty(HTMLElement.prototype, 'setPointerCapture');
    Reflect.deleteProperty(HTMLElement.prototype, 'hasPointerCapture');
    Reflect.deleteProperty(HTMLElement.prototype, 'releasePointerCapture');
  };
}

function renderWindow(
  props: Partial<React.ComponentProps<typeof Window>> = {},
) {
  return render(
    <Window onPointerDownCapture={() => undefined} {...props}>
      <div>Content</div>
    </Window>,
  );
}

describe('Window', () => {
  it('renders children inside the dialog', () => {
    renderWindow();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies the requested position to the window', () => {
    renderWindow({
      position: '20:75%',
    });

    expect(screen.getByRole('dialog')).toHaveStyle({
      left: '20px',
      top: '75%',
      translate: '0 -75%',
    });
  });

  it('does not render a drag handle when dragHandle is not provided', () => {
    renderWindow();

    expect(screen.queryByText('Handle')).not.toBeInTheDocument();
  });

  it('emits start, drag, and end events for a primary pointer drag', () => {
    const onDragStart = vi.fn();
    const onDrag = vi.fn();
    const onDragStop = vi.fn();

    renderWindow({
      dragHandle: <span>Handle</span>,
      onDragStart,
      onDrag,
      onDragStop,
    });

    const dialog = screen.getByRole('dialog');
    const handle = screen.getByText('Handle').parentElement!;

    vi.spyOn(handle, 'getBoundingClientRect').mockReturnValue({
      x: 10,
      y: 20,
      left: 10,
      top: 20,
      right: 210,
      bottom: 50,
      width: 200,
      height: 30,
      toJSON: () => ({}),
    });

    vi.spyOn(dialog, 'getBoundingClientRect').mockReturnValue({
      x: 10,
      y: 20,
      left: 10,
      top: 20,
      right: 410,
      bottom: 320,
      width: 400,
      height: 300,
      toJSON: () => ({}),
    });

    fireEvent.pointerDown(handle, {
      pointerId: 1,
      isPrimary: true,
      button: 0,
      clientX: 100,
      clientY: 80,
    });

    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(onDragStart).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: 'start',
        cursor: {
          x: 100,
          y: 80,
        },
      }),
    );

    fireEvent.pointerMove(handle, {
      pointerId: 1,
      isPrimary: true,
      clientX: 120,
      clientY: 100,
    });

    expect(onDrag).toHaveBeenCalledTimes(1);
    expect(onDrag).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: 'drag',
        cursor: {
          x: 120,
          y: 100,
        },
      }),
    );

    fireEvent.pointerUp(handle, {
      pointerId: 1,
      isPrimary: true,
      button: 0,
      clientX: 120,
      clientY: 100,
    });

    expect(onDragStop).toHaveBeenCalledTimes(1);
    expect(onDragStop).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: 'end',
      }),
    );
  });

  it('emits onDragStop only once when pointerup is followed by lostpointercapture', () => {
    const onDragStop = vi.fn();

    renderWindow({
      dragHandle: <span>Handle</span>,
      onDragStop,
    });

    const handle = screen.getByText('Handle').parentElement!;

    fireEvent.pointerDown(handle, {
      pointerId: 1,
      isPrimary: true,
      button: 0,
    });

    fireEvent.pointerUp(handle, {
      pointerId: 1,
      isPrimary: true,
      button: 0,
    });

    fireEvent.lostPointerCapture(handle, {
      pointerId: 1,
      isPrimary: true,
    });

    expect(onDragStop).toHaveBeenCalledTimes(1);
  });

  it('emits onDragStop only once when pointercancel is followed by lostpointercapture', () => {
    const onDragStop = vi.fn();

    renderWindow({
      dragHandle: <span>Handle</span>,
      onDragStop,
    });

    const handle = screen.getByText('Handle').parentElement!;

    fireEvent.pointerDown(handle, {
      pointerId: 1,
      isPrimary: true,
      button: 0,
    });

    fireEvent.pointerCancel(handle, {
      pointerId: 1,
      isPrimary: true,
    });

    fireEvent.lostPointerCapture(handle, {
      pointerId: 1,
      isPrimary: true,
    });

    expect(onDragStop).toHaveBeenCalledTimes(1);
  });

  it('does not start dragging with a non-primary mouse button', () => {
    const onDragStart = vi.fn();

    renderWindow({
      dragHandle: <span>Handle</span>,
      onDragStart,
    });

    fireEvent.pointerDown(screen.getByText('Handle').parentElement!, {
      pointerId: 1,
      isPrimary: true,
      button: 2,
    });

    expect(onDragStart).not.toHaveBeenCalled();
  });

  it('does not start dragging with a secondary pointer', () => {
    const onDragStart = vi.fn();

    renderWindow({
      dragHandle: <span>Handle</span>,
      onDragStart,
    });

    fireEvent.pointerDown(screen.getByText('Handle').parentElement!, {
      pointerId: 2,
      isPrimary: false,
      button: 0,
    });

    expect(onDragStart).not.toHaveBeenCalled();
  });

  it('does not emit drag events before dragging starts', () => {
    const onDrag = vi.fn();

    renderWindow({
      dragHandle: <span>Handle</span>,
      onDrag,
    });

    fireEvent.pointerMove(screen.getByText('Handle').parentElement!, {
      pointerId: 1,
      isPrimary: true,
      clientX: 100,
      clientY: 100,
    });

    expect(onDrag).not.toHaveBeenCalled();
  });
});
