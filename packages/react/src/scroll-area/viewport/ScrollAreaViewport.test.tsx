import * as React from 'react';
import { ScrollArea } from '@anchor-ui/react/scroll-area';
import { createRenderer } from '#test-utils';
import { describeConformance } from '../../../test/describeConformance';

describe('<ScrollArea.Viewport />', () => {
  const { render } = createRenderer();

  describeConformance(<ScrollArea.Viewport />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(<ScrollArea.Root>{node}</ScrollArea.Root>);
    },
  }));
});
