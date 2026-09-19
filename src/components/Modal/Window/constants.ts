import type {CSSProperties} from 'react';

import type {PositionValue} from '@/types';
import type {
  ParsedPositionValue,
  ResultTranslate,
  ResultPosition,
} from './types';
/**
 * Default position of the modal window.
 *
 * `50%` centers the modal on both viewport axes because percentage positioning
 * is paired with an equal negative translation of the element itself.
 */
export const DEFAULT_POSITION = '50%' satisfies PositionValue;

/**
 * Normalized CSS position corresponding to {@link DEFAULT_POSITION}.
 */
export const DEFAULT_RESULT_POSITION =
  DEFAULT_POSITION satisfies ResultPosition;

/**
 * Translation required to center the element at {@link DEFAULT_POSITION}.
 */
export const DEFAULT_RESULT_TRANSLATE =
  `-${DEFAULT_POSITION}` satisfies ResultTranslate;

/**
 * Default inline positioning style used when no explicit position is supplied.
 *
 * The element is positioned at the center of the viewport and translated by
 * half of its own dimensions.
 */
export const DEFAULT_STYLE: CSSProperties = {
  top: DEFAULT_RESULT_POSITION,
  left: DEFAULT_RESULT_POSITION,
  translate: `${DEFAULT_RESULT_TRANSLATE} ${DEFAULT_RESULT_TRANSLATE}`,
};

/**
 * Parsed representation of the default position for a single axis.
 *
 * Used as a safe fallback when a position value cannot be converted into a
 * finite numeric coordinate.
 */
export const DEFAULT_POSITION_VALUE: ParsedPositionValue = {
  pos: DEFAULT_RESULT_POSITION,
  translate: DEFAULT_RESULT_TRANSLATE,
};
