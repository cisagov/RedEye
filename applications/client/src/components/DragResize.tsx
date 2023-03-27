import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { CoreTokens } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps, FC } from 'react';
import { useEffect, useRef } from 'react';
import { useGesture } from 'react-use-gesture';
import { createState } from './mobx-create-state';

export type DragResizeEvent = {
	collapsedFixed: boolean;
	collapsedFluid: boolean;
	columnWidth: number;
	isDragging: boolean;
};

export type CommandProps = {
	collapseFixed: () => any;
	collapseFluid: () => any;
	reset: () => any;
};
export type DragResizeContentRenderer = (commandProps: CommandProps) => JSX.Element;

export type DragResizeProps = ComponentProps<'div'> & {
	draggerRenderer?: FC<DraggerRendererProps>;
	fixedContent: DragResizeContentRenderer;
	fluidContent: DragResizeContentRenderer;
	fixedCollapsedContent?: DragResizeContentRenderer;
	fluidCollapsedContent?: DragResizeContentRenderer;
	collapsedFixed?: boolean;
	collapsedFluid?: boolean;
	columnWidth?: number; // px
	collapsedMinWidth?: number; // px
	/** these resize events are untested */
	onDragResizeStart?: (event: DragResizeEvent) => any;
	/** these resize events are untested */
	onDragResize?: (event: DragResizeEvent) => any;
	/** these resize events are untested */
	onDragResizeEnd?: (event: DragResizeEvent) => any;
	/** these resize events are untested */
	onResizeEnd?: (event: DragResizeEvent) => any;
};

export const DragResize = observer<DragResizeProps>(
	({
		draggerRenderer: DraggerComponent = DefaultDraggerComponent,
		fixedContent,
		fluidContent,
		fixedCollapsedContent = () => <DefaultFixedCollapsedComponent />,
		fluidCollapsedContent = () => <DefaultFluidCollapsedComponent />,
		collapsedFixed: collapsedFixedDefault = false,
		collapsedFixed: collapsedFluidDefault = false,
		columnWidth: columnWidthDefault = 600,
		collapsedMinWidth = 300,
		...props
	}) => {
		const state = createState({
			columnWidthPrevious: getColumnWidthStorage(columnWidthDefault),
			columnWidth: getColumnWidthStorage(columnWidthDefault),
			collapsedFixed: collapsedFixedDefault && !collapsedFluidDefault,
			collapsedFluid: collapsedFluidDefault && !collapsedFixedDefault,
			isDragging: false,
			fullWidth: collapsedMinWidth * 2,
			collapsedMaxWidth: collapsedMinWidth * 2,
			get commandProps() {
				return { collapseFixed: this.collapseFixed, collapseFluid: this.collapseFluid, reset: this.reset };
			},
			get columnWidthStorage() {
				return getColumnWidthStorage(columnWidthDefault);
			},
			set columnWidthStorage(columnWidth: number) {
				window.localStorage.setItem(columnWidthId, columnWidth.toString());
			},
			collapseFixed() {
				this.columnWidth = 0;
				if (this.collapsedFluid) this.collapsedFluid = false;
				if (!this.collapsedFixed) this.collapsedFixed = true;
				if (!this.isDragging) {
					this.columnWidthPrevious = 0;
				}
			},
			collapseFluid() {
				this.columnWidth = this.fullWidth;
				if (this.collapsedFixed) this.collapsedFixed = false;
				if (!this.collapsedFluid) this.collapsedFluid = true;
				if (!this.isDragging) {
					this.columnWidthPrevious = this.fullWidth;
				}
			},
			reset() {
				if (this.isDragging) return;
				this.columnWidth = this.columnWidthStorage;
				this.columnWidthPrevious = this.columnWidthStorage;
				if (this.collapsedFixed) this.collapsedFixed = false;
				if (this.collapsedFluid) this.collapsedFluid = false;
			},
			calculateCollapsedMaxWidth() {
				if (wrapperElementRef?.current == null) return;
				this.fullWidth = wrapperElementRef.current?.clientWidth;
				this.collapsedMaxWidth = (wrapperElementRef?.current?.clientWidth || 0) - collapsedMinWidth;
			},
			setColumnWidthWithinBounds(calculatedColumnWidth: number) {
				// should we clamp the fixedColumn
				if (calculatedColumnWidth < collapsedMinWidth) {
					if (calculatedColumnWidth < collapsedMinWidth / 2) {
						this.collapseFixed();
					} else {
						this.columnWidth = collapsedMinWidth;
						if (this.collapsedFixed) this.collapsedFixed = false;
					}
					return;
				}

				// should we clamp the fluidColumn
				if (calculatedColumnWidth > this.collapsedMaxWidth) {
					if (calculatedColumnWidth > this.collapsedMaxWidth + collapsedMinWidth / 2) {
						this.collapseFluid();
					} else {
						this.columnWidth = this.collapsedMaxWidth;
						if (this.collapsedFluid) this.collapsedFluid = false;
					}
					return;
				}

				// normal resize
				this.columnWidth = calculatedColumnWidth;
				if (this.collapsedFixed) this.collapsedFixed = false;
				if (this.collapsedFluid) this.collapsedFluid = false;
			},
		});

		const wrapperElementRef = useRef<HTMLDivElement>(null);
		const dragElementRef = useRef<HTMLDivElement>(null);

		// update the full and max width when the screen changes size
		useEffect(() => {
			state.calculateCollapsedMaxWidth();
			window.addEventListener('resize', state.calculateCollapsedMaxWidth);
			return () => window.removeEventListener('resize', state.calculateCollapsedMaxWidth);
		}, [wrapperElementRef?.current]);

		const bind = useGesture({
			onDrag: ({ movement }) => {
				const calculatedColumnWidth = state.columnWidthPrevious + Math.round(movement[0]);
				state.setColumnWidthWithinBounds(calculatedColumnWidth);
			},
			onDragStart: () => {
				state.update('isDragging', true);
				const dragElement = dragElementRef?.current;
				const parentElement = wrapperElementRef?.current;
				const columnWidthPrevious =
					!dragElement || !parentElement ? state.columnWidth : dragElement.offsetLeft - parentElement.offsetLeft;
				state.update('columnWidthPrevious', columnWidthPrevious);
			},
			onDragEnd: () => {
				state.update('isDragging', false);
				state.update('columnWidthPrevious', state.columnWidth);
				if (!state.collapsedFixed && !state.collapsedFluid) {
					state.update('columnWidthStorage', state.columnWidth);
				}
			},
		});

		const gridTemplateColumns = state.collapsedFixed
			? `auto auto 1fr`
			: state.collapsedFluid
			? `1fr auto auto`
			: `${state.columnWidth}px auto 1fr`;

		return (
			<div {...props} ref={wrapperElementRef} css={wrapperStyle} style={{ gridTemplateColumns }}>
				{/* we need to keep these components mounted, so use hidden={isCollapsed} */}
				<GridCell hidden={!state.collapsedFixed}>{fixedCollapsedContent(state.commandProps)}</GridCell>
				<GridCell hidden={state.collapsedFixed}>{fixedContent(state.commandProps)}</GridCell>
				<div ref={dragElementRef} css={draggerWrapperStyle} {...bind()}>
					<DraggerComponent isDragging={state.isDragging} />
				</div>
				<GridCell hidden={!state.collapsedFluid}>{fluidCollapsedContent(state.commandProps)}</GridCell>
				<GridCell hidden={state.collapsedFluid}>{fluidContent(state.commandProps)}</GridCell>
			</div>
		);
	}
);

const columnWidthId = 'columnWidth';
const getColumnWidthStorage = (defaultWidth = 0) =>
	parseInt(window.localStorage.getItem(columnWidthId) || defaultWidth.toString(), 10);

const wrapperStyle = css`
	display: grid;
	grid-template-columns: 500px 10px 1fr;
`;
const draggerWrapperStyle = css`
	display: grid;
	z-index: 2;
`;
const DefaultFluidCollapsedComponent = styled.div`
	min-width: 4rem;
`;
const DefaultFixedCollapsedComponent = styled.div`
	min-width: 4rem;
`;
const GridCell = styled.div`
	height: 100%;
	width: 100%;
	overflow: hidden;
`;

export type DraggerRendererProps = ComponentProps<'div'> & {
	isDragging: boolean;
};
export const DefaultDraggerComponent: FC<DraggerRendererProps> = ({ isDragging, ...props }) => (
	<div css={[draggerStyle, isDragging ? isDraggingStyle : undefined]} {...props}>
		<DefaultDraggerHandle isDragging={isDragging} />
	</div>
);

const draggerStyle = css`
	width: 1px;
	margin: 0 -1px;
	cursor: col-resize;
	display: flex;
	position: relative;
	&:before {
		content: '';
		background-color: ${CoreTokens.BorderNormal};
		width: 5px;
		margin: 0 -2px;
		opacity: 0;
		border: 1px solid ${CoreTokens.BorderNormal};
	}
	&:hover:before {
		opacity: 0.3;
	}
`;
const isDraggingStyle = css`
	&,
	&:before,
	&:hover:before,
	&:active:before {
		background-color: ${CoreTokens.Intent.Primary3};
		opacity: 1;
	}
`;

export type DraggerHandleProps = ComponentProps<'div'> & {
	isDragging?: boolean;
};
export const DefaultDraggerHandle: FC<DraggerHandleProps> = ({ isDragging, ...props }) => (
	<div css={[handleStyle, isDragging ? handleStyleIsDraggingStyle : undefined]} {...props}>
		<DragCircle />
		<DragCircle />
		<DragCircle />
	</div>
);
const handleStyle = css`
	position: absolute;
	top: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border-radius: 99px;
	border: 1px solid ${CoreTokens.BorderNormal};
	min-height: 23px;
	max-height: 23px;
	min-width: 9px;
	max-width: 9px;
	margin: 0.75rem -4px;
	color: ${CoreTokens.TextIcon};
	background-color: ${CoreTokens.Background1};
`;
const handleStyleIsDraggingStyle = css`
	background-color: ${CoreTokens.Intent.Primary3};
	color: ${CoreTokens.OnIntent};
`;
const DragCircle = styled.div`
	border-radius: 99px;
	background-color: currentColor;
	height: 1px;
	width: 1px;
	margin: 1px;
`;
