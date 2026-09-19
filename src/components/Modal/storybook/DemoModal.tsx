import type {FC} from 'react';
import {useState} from 'react';
import {useToggle, useHandler} from 'react-swissbit';

import {Modal} from '../Modal';
import type {ModalProps} from '../Modal';
import type {Position, Coords, PointerDragEvent} from '@/types';
import {Header, Button} from '@/story_components';

/**
 * Controls the outside-interaction behavior demonstrated by the Modal story.
 *
 * - `none` — outside interactions do not close any modal.
 * - `last` — only the deepest currently open modal may close itself.
 * - `all` — every modal observing the outside interaction may close.
 */
interface Modifier {
  autoclose: 'none' | 'last' | 'all';
}

/**
 * Internal props for one recursive modal instance in the demo.
 */
interface ModalWindowProps
  extends
    Omit<ModalProps, 'position' | 'zIndex' | 'onInteractOutside'>,
    Modifier {
  /** One-based nesting level shown in the modal title. */
  index: number;

  /** Whether the demo renders a drag handle. */
  withDragger: boolean;

  /** Called when this modal instance should be closed. */
  onClose?: () => void;
}

/**
 * Props exposed to Storybook for configuring the Modal demonstration.
 */
export interface DemoModalProps
  extends
    Modifier,
    Omit<ModalProps, 'position' | 'zIndex' | 'onInteractOutside' | 'open'> {
  /** Heading displayed above the story controls. */
  title: string;

  /** Whether the demonstrated modal includes a drag handle. */
  withDragger: boolean;
}

/**
 * Props for a demo button that assigns a predefined modal position.
 */
interface BtnProps {
  /** Position assigned when the button is activated. */
  position: Position;

  /** Receives the selected position. */
  onClick: (position: Position) => void;
}

/**
 * Story helper used to select one of the predefined modal positions.
 */
const Btn: FC<BtnProps> = ({position, onClick}) => (
  <Button
    className="ltw:aspect-square ltw:w-full ltw:text-center ltw:align-middle"
    onClick={useHandler(() => onClick(position))}
  >
    {position}
  </Button>
);

/**
 * Props for the drag handle rendered by the draggable Modal story.
 */
interface DraggerProps {
  /** Called by the close button embedded in the drag handle. */
  onClick?: () => void;
}

/**
 * Visual drag handle used by the draggable Modal story.
 *
 * Includes a close button to demonstrate that interactive descendants can live
 * inside a drag handle without initiating a drag.
 */
const Dragger: FC<DraggerProps> = ({onClick}) => (
  <div className="ltw:flex ltw:items-center ltw:justify-end ltw:h-fit ltw:border-r-2 ltw:bg-(image:--lus-demo-gradient) ltw:w-full ltw:box-border ltw:p-0.5">
    <Button
      className="ltw:h-5 ltw:w-5 ltw:border-r-2 ltw:text-center ltw:align-middle ltw:p-0"
      onClick={onClick}
    >
      X
    </Button>
  </div>
);

/**
 * Renders one controlled modal instance for the Storybook demonstration.
 *
 * Each instance can recursively open another modal, allowing the story to
 * exercise nested portals and different outside-interaction policies.
 *
 * Drag movement is implemented externally by consuming the modal's
 * pointer-drag events and updating its controlled `position`.
 */
const ModalWindow: FC<ModalWindowProps> = ({
  autoclose,
  index,
  withDragger,
  onClose,
  ...props
}) => {
  const [isNexOpen, {toggle}] = useToggle(false);
  const [position, setPosition] = useState<Position>('50%');
  const [cursor, setCursor] = useState<Coords | null>(null);

  /**
   * Captures the initial pointer position and converts the current rendered
   * modal position to absolute pixel coordinates before movement begins.
   */
  const handleDragStart = useHandler(
    ({cursor, container: {x, y}}: PointerDragEvent) => {
      setCursor(cursor);
      setPosition(`${x}:${y}`);
    },
  );

  /**
   * Moves the modal by the pointer delta since the previous drag event.
   *
   * The latest pointer coordinate becomes the origin for the next update.
   */
  const handleDrag = useHandler(
    ({cursor: newCursor, container: {x, y}}: PointerDragEvent) => {
      if (cursor) {
        const dx = newCursor.x - cursor.x;
        const dy = newCursor.y - cursor.y;

        setPosition(`${x + dx}:${y + dy}`);
      }

      setCursor(newCursor);
    },
  );

  /**
   * Clears drag bookkeeping when the pointer interaction finishes.
   */
  const handleDragStop = useHandler(() => {
    setCursor(null);
  });

  /**
   * Demonstrates application-level policies built on top of
   * `Modal.onInteractOutside`.
   *
   * The policy intentionally lives in the consumer rather than Modal itself.
   */
  const handleInteractOutside = useHandler(() => {
    switch (autoclose) {
      case 'all':
        onClose?.();
        break;
      case 'last':
        if (!isNexOpen) {
          onClose?.();
        }
        break;
    }
  });

  return (
    <Modal
      {...props}
      position={position}
      dragHandle={withDragger ? <Dragger onClick={onClose} /> : undefined}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      onInteractOutside={handleInteractOutside}
    >
      <section className="ltw:bg-(--lus-demo-background) ltw:w-fit ltw:h-fit ltw:p-2">
        <h2 className="ltw:mb-1 ltw:text-xl ltw:font-semibold ltw:text-(--lus-demo-heading) ltw:text-center">
          Modal №{index}
        </h2>
        <div className="ltw:inline-grid ltw:grid-cols-3 ltw:gap-1 ltw:p-1 ltw:m-0">
          <Btn position="0:0" onClick={setPosition} />
          <Btn position="50%:0" onClick={setPosition} />
          <Btn position="100%:0" onClick={setPosition} />
          <Btn position="0:50%" onClick={setPosition} />
          <Btn position="50%:50%" onClick={setPosition} />
          <Btn position="100%:50%" onClick={setPosition} />
          <Btn position="0:100%" onClick={setPosition} />
          <Btn position="50%:100%" onClick={setPosition} />
          <Btn position="100%:100%" onClick={setPosition} />
        </div>
        <div className="ltw:mt-1 ltw:flex ltw:flex-nowrap ltw:justify-between ltw:items-stretch">
          <Button className="ltw:w-38 ltw:text-center" onClick={onClose}>
            Close
          </Button>
          <Button className="ltw:w-38 ltw:text-center" onClick={toggle}>
            {isNexOpen ? 'Close Next Modal' : 'Open Next Modal'}
          </Button>
        </div>
      </section>
      {isNexOpen && (
        <ModalWindow
          {...props}
          withDragger={withDragger}
          autoclose={autoclose}
          index={index + 1}
          onClose={toggle}
        />
      )}
    </Modal>
  );
};

/**
 * Top-level Storybook demonstration for {@link Modal}.
 *
 * Manages the initial modal's open state while delegating modal-specific
 * behavior to {@link ModalWindow}.
 */
const DemoModal: FC<DemoModalProps> = ({title, ...props}) => {
  const [isOpen, {toggle}] = useToggle(false);

  return (
    <>
      <Header>{title}</Header>
      <Button onClick={toggle}>{isOpen ? 'Close Modal' : 'Open Modal'}</Button>
      <ModalWindow {...props} index={1} open={isOpen} onClose={toggle} />
    </>
  );
};

export default DemoModal;
