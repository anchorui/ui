import * as React from 'react';
import { Select } from '@anchor-ui/react/select';
import { createRenderer, describeConformance } from '#test-utils';

describe('<Select.Backdrop />', () => {
  const { render } = createRenderer();

  describeConformance(<Select.Backdrop />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(<Select.Root open>{node}</Select.Root>);
    },
  }));
});