import * as React from 'react';
import { Select } from '@anchor-ui/react/select';
import { createRenderer, describeConformance } from '#test-utils';

describe('<Select.Icon />', () => {
  const { render } = createRenderer();

  describeConformance(<Select.Icon />, () => ({
    refInstanceof: window.HTMLSpanElement,
    render(node) {
      return render(<Select.Root open>{node}</Select.Root>);
    },
  }));
});