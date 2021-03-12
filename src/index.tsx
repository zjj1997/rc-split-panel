import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import throttle from 'lodash/throttle';
import styled from 'styled-components';

type Position = 'left' | 'top' | 'right' | 'bottom';

export interface SplitPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * panel
   */
  panel: React.ReactNode;
  /**
   * children
   */
  children?: React.ReactChild;
  /**
   * divider
   */
  divider?: (args: {
    dragging: boolean;
    position: 'left' | 'top' | 'right' | 'bottom';
  }) => React.ReactElement;
  /**
   * panel visible
   */
  visible?: boolean;
  /**
   * className
   */
  className?: string;
  /**
   * style
   */
  style?: React.CSSProperties;
  /**
   * panel position
   */
  position?: 'left' | 'top' | 'right' | 'bottom';
  /**
   * panel defaultSize
   */
  defaultSize?: number;
  /**
   * panel maxSize
   */
  maxSize?: number;
  /**
   * panel minSize
   */
  minSize?: number;
  /**
   * resizeEnd event
   */
  onResizeEnd?: (constrainedSize: number) => void;
}

const Container = styled.div<{ dragging: boolean; isHorizontal: boolean }>`
  flex: 1;
  position: relative;
  overflow: hidden;
  ${props =>
    props.dragging
      ? `
  cursor: ${props.isHorizontal ? 'col-resize' : 'row-resize'};
  * {
    cursor: ${props.isHorizontal ? 'col-resize' : 'row-resize'};
  }
  `
      : ''}
`;

interface DividerGrapleProps {
  isHorizontal: boolean;
  position: Position;
  constrainedSize: number;
  visible: boolean;
}

const DividerGraple = styled.div<DividerGrapleProps>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  ${props =>
    props.isHorizontal
      ? `
    top: 0;
    bottom: 0;
    cursor: col-resize;
    * {
      cursor: col-resize;
    }
  `
      : `
    left: 0;
    right: 0;
    cursor: row-resize;
    * {
      cursor: row-resize;
    }
  `}
  ${props => `${props.position}: ${props.constrainedSize}px;`}
  ${props => (props.visible ? '' : 'display: none;')}
`;

const DefaultDivider = styled.div<{ dragging: boolean; position: Position }>`
  ${props =>
    props.position === 'left' || props.position === 'right'
      ? `
    height: 100%;
    width: 1px;
  `
      : `
    width: 100%;
    height: 1px;
  `}
  background: #999;
`;

const Pane = styled.div<DividerGrapleProps & { panel: boolean }>`
  position: absolute;
  overflow: hidden;
  ${props =>
    props.isHorizontal
      ? `
    top: 0;
    bottom: 0;
  `
      : `
    left: 0;
    right: 0;
  `}
  ${props => {
    if (props.panel) {
      return `${props.position}: 0;`;
    }
    switch (props.position) {
      case 'left':
        return 'right: 0;';
      case 'right':
        return 'left: 0;';
      case 'bottom':
        return 'top: 0;';
      case 'top':
        return 'bottom: 0;';
      default:
        return '';
    }
  }}
  ${props =>
    props.panel
      ? `${props.isHorizontal ? 'width' : 'height'}: ${
          props.visible ? props.constrainedSize : 0
        }px;`
      : `${props.position}: ${
          props.visible ? props.constrainedSize + 1 : 0
        }px;`}
`;

export const SplitPanel: React.FC<SplitPanelProps> = ({
  panel,
  children,
  divider,
  visible = true,
  className,
  style,
  position = 'left',
  defaultSize = 250,
  maxSize = 500,
  minSize = 100,
  onResizeEnd,
}: SplitPanelProps) => {
  const [constrainedSize, setConstrainedSize] = useState(defaultSize);
  const [dragging, setDragging] = useState(false);
  const mouseupListenerIsSetRef = useRef(false);
  const dragStartPositionRef = useRef(0);
  const previousConstrainedSizeRef = useRef(constrainedSize);

  const isHorizontal = useMemo(
    () => position === 'left' || position === 'right',
    [position]
  );

  const startDragging = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      dragStartPositionRef.current = isHorizontal
        ? event.clientX
        : event.clientY;
      previousConstrainedSizeRef.current = constrainedSize;
      setDragging(true);
    },
    [constrainedSize, isHorizontal]
  );

  const endDragging = useCallback((event: MouseEvent) => {
    event.preventDefault();
    setDragging(false);
  }, []);

  const moveDragging = useCallback(
    throttle((event: MouseEvent) => {
      event.preventDefault();
      let diff =
        (isHorizontal ? event.clientX : event.clientY) -
        dragStartPositionRef.current;
      if (position === 'right' || position === 'bottom') {
        diff = -diff;
      }
      setConstrainedSize(
        Math.min(
          maxSize,
          Math.max(minSize, previousConstrainedSizeRef.current + diff)
        )
      );
    }, 1000 / 30),
    [position]
  );

  useEffect(() => {
    if (dragging && !mouseupListenerIsSetRef.current) {
      window.addEventListener('mouseup', endDragging);
      window.addEventListener('mousemove', moveDragging);
      mouseupListenerIsSetRef.current = true;
      return () => {};
    }

    if (!dragging && mouseupListenerIsSetRef.current) {
      window.removeEventListener('mouseup', endDragging);
      window.removeEventListener('mousemove', moveDragging);
      mouseupListenerIsSetRef.current = false;
      return () => {};
    }
    return () => {
      if (mouseupListenerIsSetRef.current) {
        window.removeEventListener('mouseup', endDragging);
        window.removeEventListener('mousemove', moveDragging);
      }
    };
  }, [dragging, endDragging, moveDragging]);

  useEffect(() => {
    if (onResizeEnd != null && !dragging) {
      onResizeEnd(constrainedSize);
    }
  }, [onResizeEnd, constrainedSize, dragging]);

  divider = divider || (args => <DefaultDivider {...args} />);

  return (
    <Container
      isHorizontal={isHorizontal}
      dragging={dragging}
      className={className}
      style={style}
    >
      <Pane
        isHorizontal={isHorizontal}
        panel
        position={position}
        constrainedSize={constrainedSize}
        visible={visible}
      >
        {panel}
      </Pane>
      <DividerGraple
        isHorizontal={isHorizontal}
        position={position}
        constrainedSize={constrainedSize}
        onMouseDown={startDragging}
        visible={visible}
      >
        {divider({ dragging, position })}
      </DividerGraple>
      <Pane
        isHorizontal={isHorizontal}
        panel={false}
        position={position}
        constrainedSize={constrainedSize}
        visible={visible}
      >
        {children}
      </Pane>
    </Container>
  );
};
