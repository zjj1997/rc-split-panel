## 1. Getting started
Install rc-split-panel using npm

`npm install rc-split-panel --save`

or yarn 

`yarn add rc-split-panel`

``` javascript

import SplitPanel from 'rc-split-panel';

<SplitPanel
  panel={<div>panel</div>}
  divider={({ dragging, position }) => (
      <div style={{ width: '2px', height: '100%',  background: 'yellow' }} />
  )}
  style={{ width: '300px', height: '300px', border: '1px solid #222' }}
  position='left'
  defaultSize={150}
  maxSize={200}
  minSize={50}
>
    <div>content</div>
</SplitPanel>

```

## 2. Check out [the demo](https://zjj1997.github.io/rc-split-panel/) for some examples.

## 3. Docs


| SplitPanelProps | desc | type | required | default |
| ---- | ---- | ---- | ---- | ---- |
| panel | panel | `ReactNode` | `false` | -- |
| divider | divider | `({ dragging: boolean }) => ReactElement` | `false` | -- |
| visible | panel visible | `boolean` | `false` | `true` |
| className | -- | `string` | `fasle` | -- |
| style | -- | `CSSProperties` | `fasle` | -- |
| position | panel position | `'left' | 'top' | 'right' | 'bottom'` | `fasle` | `'left'` |
| defaultSize | panel default size | `number` | `fasle` | `250` |
| maxSize | panel max size | `number` | `fasle` | `500` |
| minSize | panel min size | `number` | `fasle` | `100` |
| onResizeEnd | -- | `({ panelSize: number }) => void` | `fasle` | -- |
