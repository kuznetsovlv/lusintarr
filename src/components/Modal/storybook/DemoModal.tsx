import type {FC} from 'react';
import {useState} from 'react';
import {useToggle, useHandler} from 'react-swissbit';

import {Modal} from '../Modal';
import type {ModalProps} from '../Modal';
import type {Position, Coords, DragEvent} from '@/types';
import {Header, Button} from '@/story_components';

interface Modifier {
  autoclose: 'none' | 'last' | 'all';
}

interface ModalWindowProps
  extends
    Omit<ModalProps, 'position' | 'zIndex' | 'onInteractOutside'>,
    Modifier {
  index: number;
  withDragger: boolean;
  onClose?: () => void;
}

export interface DemoModalProps
  extends
    Modifier,
    Omit<ModalProps, 'position' | 'zIndex' | 'onInteractOutside' | 'open'> {
  title: string;
  withDragger: boolean;
}

interface BtnProps {
  position: Position;
  onClick: (position: Position) => void;
}

const Btn: FC<BtnProps> = ({position, onClick}) => (
  <Button
    className="ltw:aspect-square ltw:w-full ltw:text-center ltw:align-middle"
    onClick={useHandler(() => onClick(position))}
  >
    {position}
  </Button>
);

interface DraggerProps {
  onClick?: () => void;
}

const Dragger: React.FC<DraggerProps> = ({onClick}) => (
  <div className="ltw:flex ltw:items-center ltw:justify-end ltw:h-fit ltw:border-r-2 ltw:bg-(image:--lus-demo-gradient) ltw:w-full ltw:box-border ltw:p-0.5">
    <Button
      className="ltw:h-5 ltw:w-5 ltw:border-r-2 ltw:text-center ltw:align-middle ltw:p-0"
      onClick={onClick}
    >
      X
    </Button>
  </div>
);

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

  const handleDragStart = useHandler(
    ({cursor, container: {x, y}}: DragEvent) => {
      setCursor(cursor);
      setPosition(`${x}:${y}`);
    },
  );

  const handleDrag = useHandler(
    ({cursor: newCursor, container: {x, y}}: DragEvent) => {
      if (cursor) {
        const dx = newCursor.x - cursor.x;
        const dy = newCursor.y - cursor.y;

        setPosition(`${x + dx}:${y + dy}`);
      }

      setCursor(newCursor);
    },
  );

  const handleDragStop = useHandler(() => {
    setCursor(null);
  });

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
      dragHolder={withDragger ? <Dragger onClick={onClose} /> : undefined}
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
