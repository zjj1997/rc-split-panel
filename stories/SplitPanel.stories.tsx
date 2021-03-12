import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import { SplitPanel, SplitPanelProps } from '../src';

export default {
  title: 'SplitPanel',
  component: SplitPanel,
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const Template: Story<SplitPanelProps> = (args) => (
  <SplitPanel {...args}>
    <div>children</div>
  </SplitPanel>
);

export const SplitPanelExample = Template.bind({});

SplitPanelExample.args = {
    panel: <div>panel</div>,
    divider: ({ dragging, position }) => (
        <div style={{
            width: position === 'top' || position === 'bottom' ? '100%' : '2px',
            height: position === 'top' || position === 'bottom' ? '2px' : '100%',
            background: dragging ? 'yellow' : 'blue' }}
        />
    ),
    visible: true,
    className: '',
    style: { width: '300px', height: '300px', border: '1px solid #222' },
    position: 'left',
    defaultSize: 150,
    maxSize: 400,
    minSize: 50,
    onResizeEnd: console.log,
};
