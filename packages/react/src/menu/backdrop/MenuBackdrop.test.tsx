import * as React from 'react';
import { Menu } from '@anchor-ui/react/menu';
import { createRenderer, describeConformance } from '#test-utils';

describe('<Menu.Backdrop />', () => {
  const { render } = createRenderer();

  describeConformance(<Menu.Backdrop />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(<Menu.Root open>{node}</Menu.Root>);
    },
  }));
});
