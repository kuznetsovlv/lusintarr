import type {CSSProperties} from 'react';

import type {PositionValue} from '../types';
import type {
  ParsedPositionValue,
  ResultTranslate,
  ResultPosition,
} from './types';

export const DEFAULT_POSITION = '50%' satisfies PositionValue;

export const DEFAULT_RESULT_POSITION =
  DEFAULT_POSITION satisfies ResultPosition;

export const DEFAULT_RESULT_TRANSLATE =
  `-${DEFAULT_POSITION}` satisfies ResultTranslate;

export const DEFAULT_STYLE: CSSProperties = {
  top: DEFAULT_RESULT_POSITION,
  left: DEFAULT_RESULT_POSITION,
  translate: `${DEFAULT_RESULT_TRANSLATE} ${DEFAULT_RESULT_TRANSLATE}`,
};

export const DEFAULT_POSITION_VALUE: ParsedPositionValue = {
  pos: DEFAULT_RESULT_POSITION,
  translate: DEFAULT_RESULT_TRANSLATE,
};
