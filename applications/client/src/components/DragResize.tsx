import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Tokens } from '@redeye/ui-styles';
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
		columnWidth: columnWidthDefault = 500,
		collapsedMinWidth = 300,
		...props
	}) => {
		const state = createState({
			columnWidthPrevious: columnWidthDefault,
			columnWidth: columnWidthDefault,
			collapsedFixed: collapsedFixedDefault,
			collapsedFluid: collapsedFixedDefault,
			isDragging: false,
			fullWidth: collapsedMinWidth * 2,
			collapsedMaxWidth: collapsedMinWidth * 2,
			get commandProps() {
				return { collapseFixed: this.collapseFixed, collapseFluid: this.collapseFluid, reset: this.reset };
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
				this.columnWidth = columnWidthDefault;
				this.columnWidthPrevious = columnWidthDefault;
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
			},
			onDragEnd: () => {
				state.update('isDragging', false);
				state.update('columnWidthPrevious', state.columnWidth);
			},
		});

		const gridFixedColumn = `minmax(${state.collapsedFixed ? 'min-content' : 'auto'}, ${state.columnWidth}px)`;
		const gridFluidColumn = `minmax(${state.collapsedFluid ? 'min-content' : 'auto'}, 1fr)`;

		return (
			<div
				{...props}
				ref={wrapperElementRef}
				css={wrapperStyle}
				style={{ gridTemplateColumns: `${gridFixedColumn} auto ${gridFluidColumn}` }}
			>
				{/* we need to keep these components mounted, so use hidden={isCollapsed} */}
				<GridCell hidden={!state.collapsedFixed}>{fixedCollapsedContent(state.commandProps)}</GridCell>
				<GridCell hidden={state.collapsedFixed}>{fixedContent(state.commandProps)}</GridCell>
				<div css={draggerWrapperStyle} {...bind()}>
					<DraggerComponent isDragging={state.isDragging} />
				</div>
				<GridCell hidden={!state.collapsedFluid}>{fluidCollapsedContent(state.commandProps)}</GridCell>
				<GridCell hidden={state.collapsedFluid}>{fluidContent(state.commandProps)}</GridCell>
			</div>
		);
	}
);

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
export const DefaultDraggerComponent: FC<DraggerRendererProps> = ({
	isDragging,
	children = <DefaultDraggerHandle />, // Not sure this is necessary
	...props
}) => (
	<div css={[draggerStyle, isDragging ? isDraggingStyle : undefined]} {...props}>
		{children}
	</div>
);
const draggerWidth = 5;
const draggerStyle = css`
	width: 1px;
	background-color: ${Tokens.CoreTokens.BorderColorNormal};
	cursor: col-resize;
	display: flex;
	position: relative;
	&:before {
		content: '';
		background-color: ${Tokens.CoreTokens.BorderColorNormal};
		width: ${draggerWidth}px;
		margin: -2px -${draggerWidth / 2}px;
		opacity: 0;
		border: 1px solid ${Tokens.CoreTokens.BorderColorNormal};
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
		background-color: ${Tokens.IntentColors.PtIntentPrimary};
		opacity: 1;
		z-index: 2;
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
	border: 1px solid ${Tokens.CoreTokens.BorderColorNormal};
	min-height: 23px;
	max-height: 23px;
	min-width: 9px;
	max-width: 9px;
	margin: 0.75rem -4px;
	background-color: ${Tokens.Components.ButtonBackgroundColor};
	&:hover {
		background-color: ${Tokens.Components.ButtonBackgroundColorHover};
	}
	&:active {
		background-color: ${Tokens.Components.ButtonBackgroundColorActive};
	}
`;
const handleStyleIsDraggingStyle = css``;
const DragCircle = styled.div`
	border-radius: 99px;
	background-color: ${Tokens.IconColors.PtIconColor};
	height: 1px;
	width: 1px;
	margin: 1px;
`;
