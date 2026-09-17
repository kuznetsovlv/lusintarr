import type {CSSProperties, ReactNode} from 'react';

export type PositionValue = `${number}${'' | '%'}`;
export type Position = PositionValue | `${PositionValue}:${PositionValue}`;

export interface BlockProps {
  background?: CSSProperties['background'];
}

export interface WindowProps {
  className?: string;
  position?: Position;
  autoCloseable?: boolean;
  dragHolder?: ReactNode;
  onClose?: () => void;
  onDragStart?: () => void;
  onDrag?: () => void;
  onDrop?: () => void;
}
