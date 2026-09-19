import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';

import Block from './Block';
import {DEFAULT_BACKGROUND_COLOR} from '../constants';

describe('Block', () => {
  it('renders children', () => {
    render(
      <Block>
        <div>Modal content</div>
      </Block>,
    );

    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('uses the default background', () => {
    const {container} = render(
      <Block>
        <div>Modal content</div>
      </Block>,
    );

    expect(container.firstElementChild).toHaveStyle({
      background: DEFAULT_BACKGROUND_COLOR,
    });
  });

  it('uses the provided background', () => {
    const {container} = render(
      <Block background="rgb(10, 20, 30)">
        <div>Modal content</div>
      </Block>,
    );

    expect(container.firstElementChild).toHaveStyle({
      background: 'rgb(10, 20, 30)',
    });
  });

  it('renders as a full-screen fixed backdrop', () => {
    const {container} = render(
      <Block>
        <div>Modal content</div>
      </Block>,
    );

    expect(container.firstElementChild).toHaveClass(
      'ltw:fixed',
      'ltw:top-0',
      'ltw:right-0',
      'ltw:bottom-0',
      'ltw:left-0',
    );
  });
});
