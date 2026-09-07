import {createRef} from 'react';
import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';

import List from './List';

describe('List', () => {
  it('renders an unordered list', () => {
    const ref = createRef<HTMLUListElement | HTMLOListElement>();

    render(
      <List className="test-class" listRef={ref} ordered={false} start={5}>
        <li>Mercury</li>
      </List>,
    );

    const list = screen.getByRole('list');

    expect(list.tagName).toBe('UL');
    expect(list).toHaveClass('test-class');
    expect(list).not.toHaveAttribute('start');
    expect(ref.current).toBe(list);

    expect(screen.getByRole('listitem')).toHaveTextContent('Mercury');
  });

  it('renders an ordered list starting at the requested ordinal', () => {
    const ref = createRef<HTMLUListElement | HTMLOListElement>();

    render(
      <List className="test-class" listRef={ref} ordered start={7}>
        <li>Earth</li>
      </List>,
    );

    const list = screen.getByRole('list');

    expect(list.tagName).toBe('OL');
    expect(list).toHaveClass('test-class');
    expect(list).toHaveAttribute('start', '7');
    expect(ref.current).toBe(list);

    expect(screen.getByRole('listitem')).toHaveTextContent('Earth');
  });
});
