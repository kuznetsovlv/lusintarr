export type ResultPosition = `${number}${'px' | '%'}`;
export type ResultTranslate = '0' | `${number}${'%'}`;

export interface ParsedPositionValue {
  pos: ResultPosition;
  translate: ResultTranslate;
}
