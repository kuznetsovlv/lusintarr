import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {OutBound} from './OutBound';

describe('OutBound', () => {
  it('renders children into document.body outside the component container', () => {
    const {container} = render(
      <OutBound>
        <div data-testid="content">Content</div>
      </OutBound>,
    );

    const content = screen.getByTestId('content');
    const portalContainer = content.parentElement;

    expect(container).not.toContainElement(content);
    expect(portalContainer?.parentElement).toBe(document.body);
  });

  it('applies and updates zIndex', () => {
    const {rerender} = render(
      <OutBound zIndex={100}>
        <div data-testid="content">Content</div>
      </OutBound>,
    );

    const portalContainer = screen.getByTestId('content').parentElement;

    expect(portalContainer).toHaveStyle({zIndex: '100'});

    rerender(
      <OutBound zIndex={200}>
        <div data-testid="content">Content</div>
      </OutBound>,
    );

    expect(portalContainer).toHaveStyle({zIndex: '200'});
  });

  it('removes the portal container on unmount', () => {
    const {unmount} = render(
      <OutBound>
        <div data-testid="content">Content</div>
      </OutBound>,
    );

    const portalContainer = screen.getByTestId('content').parentElement;

    expect(portalContainer).toBeInTheDocument();

    unmount();

    expect(portalContainer).not.toBeInTheDocument();
  });
});
