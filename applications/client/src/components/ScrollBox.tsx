import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { CoreTokens } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type InnerProps = ComponentProps<'div'> & {
	css?: SerializedStyles;
};
type OuterProps = ComponentProps<'div'> & {
	innerProps?: InnerProps;
};

export const ScrollBox = observer<OuterProps>(({ children, innerProps, ...props }) => (
	<ScrollBoxOuter {...props}>
		<ScrollBoxInner {...innerProps}>
			{children}
			{/* <div css={css`min-height:600px; border-radius: 6px; background-color:lightgray; margin:2rem;`} /> // test... */}
		</ScrollBoxInner>
	</ScrollBoxOuter>
));

export const shadowStyle = css`
	content: '';
	position: absolute;
	height: 1rem;
	z-index: 1;
	pointer-events: none;
`;

export const scrollBoxShadowsStyle = css`
	position: relative;

	&:before,
	&:after {
		${shadowStyle}
	}

	/* top shadow */

	&:before {
		background-image: linear-gradient(to bottom, ${CoreTokens.ShadowGradient});
		top: 0;
		left: 0;
		right: 0;
	}

	/* bottom shadow */

	&:after {
		background-image: linear-gradient(to top, ${CoreTokens.ShadowGradient});
		bottom: -1px;
		left: 0;
		right: 0;
	}
`;

export const scrollBoxOuterStyle = css`
	flex: 1 1 auto;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	height: 100%;
	${scrollBoxShadowsStyle}
`;
export const ScrollBoxOuter = styled.div(scrollBoxOuterStyle);

export const scrollBoxInnerStyle = css`
	overflow-y: auto;
	overflow-x: hidden; // no horizontal scroll
	height: 100%;
`;
export const ScrollBoxInner = styled.div(scrollBoxInnerStyle);
