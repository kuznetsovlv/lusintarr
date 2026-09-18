import type {CSSProperties, ReactNode} from 'react';

export type PositionValue = `${number}${'' | '%'}`;
export type Position = PositionValue | `${PositionValue}:${PositionValue}`;

export interface BlockProps {
  background?: CSSProperties['background'];
}

export interface WindowProps {
  className?: string;
  position?: Position;
  dragHolder?: ReactNode;
  onDragStart?: () => void;
  onDrag?: () => void;
  onDragStop?: () => void;
}
