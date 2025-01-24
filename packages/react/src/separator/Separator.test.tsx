import * as React from 'react';
import { expect } from 'chai';
import { Separator } from '@anchor-ui/react/separator';
import { createRenderer, describeConformance } from '#test-utils';

describe('<Separator />', () => {
  const { render } = createRenderer();

  describeConformance(<Separator />, () => ({
    render,
    refInstanceof: window.HTMLDivElement,
  }));

  it('renders a div with the `separator` role', async () => {
    const { getByRole } = await render(<Separator />);
    expect(getByRole('separator')).toBeVisible();
  });

  describe('prop: orientation', () => {
    ['horizontal', 'vertical'].forEach((orientation) => {
      it(orientation, async () => {
        const { getByRole } = await render(
          <Separator orientation={orientation as Separator.Props['orientation']} />,
        );
        expect(getByRole('separator')).to.have.attribute('aria-orientation', orientation);
      });
    });
  });
});
