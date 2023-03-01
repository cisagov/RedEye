import { css } from '@emotion/react';
import styled from '@emotion/styled';

export interface FlexProps extends React.HTMLAttributes<HTMLOrSVGElement> {
	/** Display children in a column */
	column?: boolean;
	/** Display children in a row */
	row?: boolean;
	/** Spacing: number is px, string is css - Works better than `margin` or `padding` for flex items */
	gap?: number | string;
	/** [align-items](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items) */
	align?: AlignItems;
	/** [justify-content](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content) */
	alignSelf?: AlignItems;
	/** [align-self](https://developer.mozilla.org/en-US/docs/Web/CSS/align-self) */
	justify?: JustifyContent;
	/** Wrap content to another row (or column) when overflowing */
	wrap?: boolean | FlexWrap | string; // string to align with AllHtmlAttributes nonsense
	/** Doesn't shrink or grow - `flex: 0 0 auto;`, `flexChild.fixed`  */
	fixed?: boolean;
	/** Fills all remaining space - `flex: 1 1 auto;`, `flexChild.fill`  */
	fill?: boolean;
	/** [flex](https://developer.mozilla.org/en-US/docs/Web/CSS/flex) */
	flex?: string;
	/** Useful for creating a scroll area or text ellipsis. Adds `overflow:hidden;` */
	overflowHidden?: boolean;
	/** The html tag that renders the element */
	tagName?: keyof JSX.IntrinsicElements;
}

/** a declarative component for flexbox layout  */
export const Flex = ({
	tagName: RootTag = 'div',
	column,
	row, // this is ignored because its default
	gap,
	align: alignItems,
	alignSelf,
	justify: justifyContent,
	wrap,
	fixed,
	fill,
	overflowHidden,
	flex,
	...props
}: FlexProps) => (
	<RootTag
		css={[
			{
				display: 'flex',
				gap,
				alignItems,
				alignSelf,
				justifyContent,
			},
			wrap && { flexWrap: typeof wrap === 'string' ? (wrap as FlexWrap) : 'wrap' },
			column && { flexDirection: 'column' },
			overflowHidden && { overflow: 'hidden' },
			flex ? { flex } : fixed ? flexChild.fixed : fill && flexChild.fill,
		]}
		{...props}
	/>
);

type FlexAlign = 'stretch' | 'center' | 'start' | 'end';
type AlignItems = FlexAlign | 'baseline';
type JustifyContent = FlexAlign | 'space-between' | 'space-around' | 'space-evenly';
type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
/** Utility classes for Flex children sizing */
export const flexChild = {
	/** flexChild.fixed - provides a flex child a _fixed_, _static_ size based on its content - `flex: 0 0 auto;` */
	fixed: css`
		flex: 0 0 auto;
	`,
	/** flexChild.fill - allows a flex child to _grow_ and _shrink_ to _fill_ the space available - `flex: 1 1 auto; */
	fill: css`
		flex: 1 1 auto;
	`,
};

/** FlexSplitter will split the siblings before and after it in a display:flex; parent */
export const FlexSplitter = styled.div`
	flex: 1 1 auto;
`;
