import * as React from 'react';
import { Radio } from '@anchor-ui/react/radio';
import { describeConformance, createRenderer } from '#test-utils';

describe('<Radio.Root />', () => {
  const { render } = createRenderer();

  describeConformance(<Radio.Root value="" />, () => ({
    refInstanceof: window.HTMLButtonElement,
    render,
  }));
});
