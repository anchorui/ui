import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { Fieldset } from '@anchor-ui/react/fieldset';
import { describeConformance } from '../../../test/describeConformance';

describe('<Fieldset.Root />', () => {
  const { render } = createRenderer();

  describeConformance(<Fieldset.Root />, () => ({
    inheritComponent: 'fieldset',
    refInstanceof: window.HTMLFieldSetElement,
    render,
  }));
});
