import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';

describe('test setup', () => {
  it('renders React components in jsdom', () => {
    render(<div>Lusintarr</div>);

    expect(screen.getByText('Lusintarr')).toBeInTheDocument();
  });
});
