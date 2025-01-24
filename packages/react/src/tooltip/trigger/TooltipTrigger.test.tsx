import * as React from 'react';
import { Tooltip } from '@anchor-ui/react/tooltip';
import { createRenderer, describeConformance } from '#test-utils';

describe('<Tooltip.Trigger />', () => {
  const { render } = createRenderer();

  describeConformance(<Tooltip.Trigger />, () => ({
    refInstanceof: window.HTMLButtonElement,
    render(node) {
      return render(<Tooltip.Root>{node}</Tooltip.Root>);
    },
  }));
});
