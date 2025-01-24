import * as React from 'react';
import { Dialog } from '@anchor-ui/react/dialog';
import { createRenderer, describeConformance } from '#test-utils';

describe('<Dialog.Trigger />', () => {
  const { render } = createRenderer();

  describeConformance(<Dialog.Trigger />, () => ({
    refInstanceof: window.HTMLButtonElement,
    render: (node) => {
      return render(
        <Dialog.Root open modal={false}>
          {node}
        </Dialog.Root>,
      );
    },
  }));
});
