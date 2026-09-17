import type {Position, PositionValue} from '../types';
import type {CSSProperties} from 'react';

import type {ParsedPositionValue} from './types';
import {DEFAULT_STYLE, DEFAULT_POSITION_VALUE} from './constants';

export function getStyle(position: Position): CSSProperties {
  if (!position) {
    return DEFAULT_STYLE;
  }

  const [xValue, yValue] = position.split(':') as [
    PositionValue,
    PositionValue?,
  ];

  const x = parsePositionValue(xValue);
  const y = parsePositionValue(yValue ?? xValue);

  return {
    left: x.pos,
    top: y.pos,
    translate: `${x.translate} ${y.translate}`,
  };
}

function parsePositionValue(value: PositionValue): ParsedPositionValue {
  const isPercent = value.endsWith('%');
  const num = Number(isPercent ? value.slice(0, -1) : value);

  if (Number.isNaN(num)) {
    return DEFAULT_POSITION_VALUE;
  }

  return {
    pos: `${num}${isPercent ? '%' : 'px'}`,
    translate: isPercent ? `${-num}%` : '0',
  };
}
