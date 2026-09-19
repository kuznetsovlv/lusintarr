import type {CSSProperties, ReactNode} from 'react';

import type {Position, PointerDragEvent} from '@/types';

/**
 * Props controlling the modal backdrop.
 */
export interface BlockProps {
  /**
   * CSS background applied to the full-screen backdrop.
   *
   * Used only when the modal is blocking.
   *
   * @defaultValue `'#0007'`
   */
  background?: CSSProperties['background'];
}

/**
 * Props controlling the modal window and optional drag interaction.
 */
export interface WindowProps {
  /**
   * Additional CSS class name applied to the modal window container.
   */
  className?: string;

  /**
   * Position of the modal window within the viewport.
   *
   * A single value is used for both axes. Two values can be supplied as
   * `x:y`. Unitless values are interpreted as CSS pixels.
   *
   * @defaultValue `'50%'`
   *
   * @see {@link Position}
   */
  position?: Position;

  /**
   * Content used as the modal's drag handle.
   *
   * When provided, pointer interactions starting on this area emit the
   * drag callbacks. The modal does not change its own position automatically;
   * update {@link position} from the callbacks to implement movement.
   */
  dragHandle?: ReactNode;

  /**
   * Called when a primary pointer starts dragging the drag handle.
   */
  onDragStart?: (event: PointerDragEvent) => void;

  /**
   * Called when the active pointer moves during a drag interaction.
   */
  onDrag?: (event: PointerDragEvent) => void;

  /**
   * Called when the current drag interaction finishes or is cancelled.
   */
  onDragStop?: (event: PointerDragEvent) => void;
}
