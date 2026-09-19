import type {CSSProperties, ReactNode} from 'react';

import type {Position, DragEvent} from '@/types';

export interface BlockProps {
  background?: CSSProperties['background'];
}

export interface WindowProps {
  className?: string;
  position?: Position;
  dragHolder?: ReactNode;
  onDragStart?: (event: DragEvent) => void;
  onDrag?: (event: DragEvent) => void;
  onDragStop?: (event: DragEvent) => void;
}
