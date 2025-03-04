import * as React from 'react';
import { Popover } from '@anchor-ui/react/popover';
import { createRenderer, describeConformance } from '#test-utils';
import { screen } from '@mui/internal-test-utils';
import { expect } from 'chai';

describe('<Popover.Positioner />', () => {
  const { render } = createRenderer();

  describeConformance(<Popover.Positioner />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <Popover.Root open>
          <Popover.Portal>{node}</Popover.Portal>
        </Popover.Root>,
      );
    },
  }));

  describe('prop: keepMounted', () => {
    it('has hidden attribute when closed', async () => {
      await render(
        <Popover.Root>
          <Popover.Portal keepMounted>
            <Popover.Positioner data-testid="positioner" />
          </Popover.Portal>
        </Popover.Root>,
      );

      expect(screen.getByTestId('positioner')).to.have.attribute('hidden');
    });

    it('does not have inert attribute when open', async () => {
      await render(
        <Popover.Root open>
          <Popover.Portal keepMounted>
            <Popover.Positioner data-testid="positioner" />
          </Popover.Portal>
        </Popover.Root>,
      );

      expect(screen.getByTestId('positioner')).not.to.have.attribute('inert');
    });
  });
});
