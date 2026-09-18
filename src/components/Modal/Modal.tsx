import type {PropsWithChildren, FC} from 'react';

import {OutBound} from '../OutBound';
import type {OutBoundProps} from '../OutBound';
import type {BlockProps, WindowProps} from './types';
import Block from './Block';
import Window from './Window';
import useOutsideInteraction from './useOutsideInteraction';

export interface ModalProps extends OutBoundProps, BlockProps, WindowProps {
  blocking?: boolean;
  autoCloseable?: boolean;
  onClose?: () => void;
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  blocking,
  background,
  zIndex,
  autoCloseable,
  onClose,
  ...props
}) => {
  const pointerDownHandler = useOutsideInteraction(onClose, autoCloseable);

  return (
    <OutBound zIndex={zIndex}>
      {blocking ? (
        <Block background={background}>
          <Window {...props} onPointerDown={pointerDownHandler} />
        </Block>
      ) : (
        <Window {...props} onPointerDown={pointerDownHandler} />
      )}
    </OutBound>
  );
};
