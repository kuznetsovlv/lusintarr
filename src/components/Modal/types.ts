import type {CSSProperties, ReactNode} from 'react';

import type {Position, PointerDragEvent} from '@/types';

export interface BlockProps {
  background?: CSSProperties['background'];
}

export interface WindowProps {
  className?: string;
  position?: Position;
  dragHandle?: ReactNode;
  onDragStart?: (event: PointerDragEvent) => void;
  onDrag?: (event: PointerDragEvent) => void;
  onDragStop?: (event: PointerDragEvent) => void;
}
