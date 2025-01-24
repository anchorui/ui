import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { Field } from '@anchor-ui/react/field';
import { describeConformance } from '../../../test/describeConformance';

describe('<Field.Control />', () => {
  const { render } = createRenderer();

  describeConformance(<Field.Control />, () => ({
    refInstanceof: window.HTMLInputElement,
    render(node) {
      return render(<Field.Root>{node}</Field.Root>);
    },
  }));
});
