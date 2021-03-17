import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import SplitPanel, { SplitPanelProps } from '../src';

export default {
  title: 'SplitPanel',
  component: SplitPanel,
  parameters: {
    controls: { expanded: true },
  },
} as Meta;

const SplitPanelExample: Story<SplitPanelProps> = (args) => (
  <SplitPanel {...args}>
    <div>content</div>
  </SplitPanel>
);

const SplitPanelExample2: Story = () => {
  const [beforeSize, setBeforeSize] = useState(100);
  const [afterSize, setAfterSize] = useState(100);
  const beforeMinSize = 50;
  const beforeMaxSize = 250;
  const afterMinSize = 50;
  const afterMaxSize = 250;

  const divider = ({ dragging }) => (
    <div style={{
        width: '2px',
        height: '100%',
        background: dragging ? 'yellow' : 'blue' }}
    />
  );

  return (
    <SplitPanel
      position='left'
      style={{ minWidth: '500px', height: '300px', border: '1px solid #222' }}
      minSize={beforeMinSize}
      maxSize={beforeMaxSize}
      defaultSize={beforeSize}
      panel={
        <div
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            whiteSpace: 'pre-line',
            background: 'orange',
          }}
        >
          {`
            size: ${beforeSize}\n
            maxSize: ${beforeMaxSize}\n
            minSize: ${beforeMinSize}\n
          `}
        </div>
      }
      divider={divider}
      onResizeEnd={e => setBeforeSize(e.panelSize)}
    >
      <SplitPanel
        position='right'
        style={{ height: '100%' }}
        minSize={afterMinSize}
        maxSize={afterMaxSize}
        defaultSize={afterSize}
        panel={
          <div
            style={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              whiteSpace: 'pre-line',
              background: 'pink',
            }}
          >
            {`
              size: ${afterSize}\n
              maxSize: ${afterMaxSize}\n
              minSize: ${afterMinSize}\n
            `}
          </div>
        }
        divider={divider}
        onResizeEnd={e => setAfterSize(e.panelSize)}
      >
        <div
          style={{ height: '100%', background: 'red' }}
        >content</div>
      </SplitPanel>
    </SplitPanel>
  );
};

export const splitPanelExample = SplitPanelExample;

splitPanelExample.args = {
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
  maxSize: 200,
  minSize: 50,
};

export const splitPanelExample2 = SplitPanelExample2;
