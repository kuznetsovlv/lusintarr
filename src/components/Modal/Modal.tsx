import type {PropsWithChildren, FC} from 'react';

import {OutBound} from '../OutBound';
import type {OutBoundProps} from '../OutBound';
import type {BlockProps, WindowProps} from './types';
import Block from './Block';
import Window from './Window';
import useOutsideInteraction from './useOutsideInteraction';

export interface ModalProps extends OutBoundProps, BlockProps, WindowProps {
  blocking?: boolean;
  open?: boolean;
  autoCloseable?: boolean;
  onClose?: () => void;
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  blocking,
  open = false,
  background,
  zIndex,
  autoCloseable,
  onClose,
  ...props
}) => {
  const pointerDownHandler = useOutsideInteraction(
    onClose,
    autoCloseable && open && !!onClose,
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
