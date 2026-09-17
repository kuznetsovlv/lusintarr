import type {PropsWithChildren, CSSProperties, FC} from 'react';

import type {Position} from './types';

export interface ModalProps {
  className?: string;
  position?: Position;
  autoCloseable?: boolean;
  blocking?: boolean;
  background?: CSSProperties['background'];
  onClose?: () => void;
  onDragStart?: () => void;
  onDrag?: () => void;
  onDrop?: () => void;
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({}) => {
  return null;
};
