import type {PropsWithChildren, FC} from 'react';

import {OutBound} from '../OutBound';
import type {OutBoundProps} from '../OutBound';
import type {BlockProps, WindowProps} from './types';
import Block from './Block';
import Window from './Window';
import useOutsideInteraction from './useOutsideInteraction';

/**
 * Props for the {@link Modal} component.
 */
export interface ModalProps extends OutBoundProps, BlockProps, WindowProps {
  /**
   * Whether to render a full-screen backdrop behind the modal window.
   *
   * The backdrop prevents pointer interaction with content underneath it.
   *
   * @defaultValue `false`
   */
  blocking?: boolean;

  /**
   * Whether the modal is rendered.
   *
   * @defaultValue `false`
   */
  open?: boolean;

  /**
   * Called when a pointer interaction starts outside the modal's logical
   * React subtree.
   *
   * Descendants rendered through React portals are treated as part of the
   * modal and do not trigger this callback.
   *
   * The modal does not close itself. Consumers can use this callback to
   * update {@link open} or perform any other application-specific action.
   */
  onInteractOutside?: (event: PointerEvent) => void;
}

/**
 * Renders modal content in a portal above the application content.
 *
 * The component supports viewport-relative positioning, an optional blocking
 * backdrop, detection of pointer interactions outside the modal, and optional
 * pointer-driven drag events.
 *
 * `Modal` is controlled: it does not change {@link ModalProps.open} or
 * {@link ModalProps.position} itself. Consumers decide how outside
 * interactions and drag events affect the modal state.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <Modal
 *   open={open}
 *   blocking
 *   onInteractOutside={() => setOpen(false)}
 * >
 *   <div>Modal content</div>
 * </Modal>
 * ```
 *
 * @example Draggable modal
 * ```tsx
 * <Modal
 *   open
 *   position={position}
 *   dragHandle={<header>Drag me</header>}
 *   onDrag={(event) => {
 *     // Calculate and update `position` using event.cursor
 *     // and event.container.
 *   }}
 * >
 *   <div>Modal content</div>
 * </Modal>
 * ```
 */
export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  blocking,
  open = false,
  background,
  zIndex,
  onInteractOutside,
  ...props
}) => {
  // Outside interaction detection is active only while the modal is both open
  // and observable by the consumer.
  const pointerDownHandler = useOutsideInteraction(
    onInteractOutside,
    open && !!onInteractOutside,
  );

  if (!open) {
    return null;
  }

  return (
    <OutBound zIndex={zIndex}>
      {blocking ? (
        <Block background={background}>
          <Window {...props} onPointerDownCapture={pointerDownHandler} />
        </Block>
      ) : (
        <Window {...props} onPointerDownCapture={pointerDownHandler} />
      )}
    </OutBound>
  );
};
