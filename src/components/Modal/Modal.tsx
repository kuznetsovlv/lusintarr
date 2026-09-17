import type {PropsWithChildren, FC} from 'react';

import {OutBound} from '../OutBound';
import type {OutBoundProps} from '../OutBound';
import type {BlockProps, WindowProps} from './types';
import Block from './Block';
import Window from './Window';

export interface ModalProps extends OutBoundProps, BlockProps, WindowProps {
  blocking?: boolean;
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  blocking,
  background,
  zIndex,
  ...props
}) => {
  return (
    <OutBound zIndex={zIndex}>
      {blocking ? (
        <Block background={background}>
          <Window {...props} />
        </Block>
      ) : (
        <Window {...props} />
      )}
    </OutBound>
  );
};
