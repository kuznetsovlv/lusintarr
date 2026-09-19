import {createPortal} from 'react-dom';
import {act, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {Modal} from './Modal';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

function flushOutsideInteraction() {
  act(() => {
    vi.runOnlyPendingTimers();
  });
}

describe('Modal', () => {
  it('does not render when open is false', () => {
    render(
      <Modal open={false}>
        <div>Modal content</div>
      </Modal>,
    );

    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('renders its content when open is true', () => {
    render(
      <Modal open>
        <div>Modal content</div>
      </Modal>,
    );

    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('renders modal content through a portal', () => {
    const {container} = render(
      <Modal open>
        <div>Modal content</div>
      </Modal>,
    );

    expect(container).not.toHaveTextContent('Modal content');
    expect(document.body).toHaveTextContent('Modal content');
  });

  it('renders a backdrop when blocking is enabled', () => {
    render(
      <Modal open blocking background="rgb(10, 20, 30)">
        <div>Modal content</div>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    const backdrop = dialog.parentElement!;

    expect(backdrop).toHaveStyle({
      background: 'rgb(10, 20, 30)',
    });
  });

  it('calls onInteractOutside for a pointer interaction outside the modal', () => {
    const onInteractOutside = vi.fn();

    render(
      <Modal open onInteractOutside={onInteractOutside}>
        <div>Inside</div>
      </Modal>,
    );

    fireEvent.pointerDown(document.body);

    flushOutsideInteraction();

    expect(onInteractOutside).toHaveBeenCalledTimes(1);
  });

  it('does not call onInteractOutside for interaction inside the modal', () => {
    const onInteractOutside = vi.fn();

    render(
      <Modal open onInteractOutside={onInteractOutside}>
        <button type="button">Inside</button>
      </Modal>,
    );

    fireEvent.pointerDown(screen.getByRole('button', {name: 'Inside'}));

    flushOutsideInteraction();

    expect(onInteractOutside).not.toHaveBeenCalled();
  });

  it('treats descendants that stop pointer propagation as inside', () => {
    const onInteractOutside = vi.fn();

    render(
      <Modal open onInteractOutside={onInteractOutside}>
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
        >
          Inside
        </button>
      </Modal>,
    );

    fireEvent.pointerDown(screen.getByRole('button', {name: 'Inside'}));

    flushOutsideInteraction();

    expect(onInteractOutside).not.toHaveBeenCalled();
  });

  it('treats React portal descendants as part of the modal', () => {
    const onInteractOutside = vi.fn();
    const portalRoot = document.createElement('div');

    document.body.append(portalRoot);

    const PortalChild = () =>
      createPortal(<button type="button">Portal child</button>, portalRoot);

    render(
      <Modal open onInteractOutside={onInteractOutside}>
        <PortalChild />
      </Modal>,
    );

    fireEvent.pointerDown(screen.getByRole('button', {name: 'Portal child'}));

    flushOutsideInteraction();

    expect(onInteractOutside).not.toHaveBeenCalled();

    portalRoot.remove();
  });

  it('does not treat interaction inside a nested modal as outside either modal', () => {
    const outerOutside = vi.fn();
    const innerOutside = vi.fn();

    render(
      <Modal open onInteractOutside={outerOutside}>
        <div>Outer content</div>

        <Modal open onInteractOutside={innerOutside}>
          <button type="button">Inner content</button>
        </Modal>
      </Modal>,
    );

    fireEvent.pointerDown(screen.getByRole('button', {name: 'Inner content'}));

    flushOutsideInteraction();

    expect(innerOutside).not.toHaveBeenCalled();
    expect(outerOutside).not.toHaveBeenCalled();
  });

  it('treats interaction inside a parent modal as outside its nested modal only', () => {
    const outerOutside = vi.fn();
    const innerOutside = vi.fn();

    render(
      <Modal open onInteractOutside={outerOutside}>
        <button type="button">Outer content</button>

        <Modal open onInteractOutside={innerOutside}>
          <div>Inner content</div>
        </Modal>
      </Modal>,
    );

    fireEvent.pointerDown(screen.getByRole('button', {name: 'Outer content'}));

    flushOutsideInteraction();

    expect(innerOutside).toHaveBeenCalledTimes(1);
    expect(outerOutside).not.toHaveBeenCalled();
  });

  it('notifies every modal for an interaction outside all of them', () => {
    const outerOutside = vi.fn();
    const innerOutside = vi.fn();

    render(
      <Modal open onInteractOutside={outerOutside}>
        <Modal open onInteractOutside={innerOutside}>
          <div>Inner content</div>
        </Modal>
      </Modal>,
    );

    fireEvent.pointerDown(document.body);

    flushOutsideInteraction();

    expect(innerOutside).toHaveBeenCalledTimes(1);
    expect(outerOutside).toHaveBeenCalledTimes(1);
  });

  it('uses the latest outside callback without losing a pending interaction', () => {
    const firstCallback = vi.fn();
    const secondCallback = vi.fn();

    const {rerender} = render(
      <Modal open onInteractOutside={firstCallback}>
        <div>Content</div>
      </Modal>,
    );

    fireEvent.pointerDown(document.body);

    rerender(
      <Modal open onInteractOutside={secondCallback}>
        <div>Content</div>
      </Modal>,
    );

    flushOutsideInteraction();

    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledTimes(1);
  });
});
