import { Classes } from '@blueprintjs/core';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { AdvancedTokens, CoreTokens } from '../styles/tokens';

type HeroButtonProps = {
	// icon: CarbonIconProps['icon']
	hover?: boolean;
};

const hoverStyles = css`
	color: ${CoreTokens.OnIntent};
	&:before {
		transform: scale(1);
		box-shadow: ${CoreTokens.Elevation4};
		opacity: 1;
	}
`;
const activeStyles = css`
	color: ${CoreTokens.OnIntent};
	&:before {
		transform: scale(0.9);
		background-color: ${AdvancedTokens.PtIntentPrimaryActive};
		transition-duration: 50ms;
	}
`;
export const HeroButton = styled.button<HeroButtonProps>`
	appearance: none;
	border: none;
	background: none;
	height: 2rem;
	width: 2rem;
	position: relative;
	cursor: pointer;
	isolation: isolate;

	// Firefox needs this for extra specificity
	color: ${CoreTokens.TextBody};

	.${Classes.ICON} {
		color: inherit;
	}

	&:before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		border-radius: 99px;
		background-color: ${AdvancedTokens.PtIntentPrimary};
		z-index: -1;
		transform: scale(0.8);
		transform-origin: center;
		transition-property: transform, opacity, box-shadow;
		transition: 150ms ease;
		opacity: 0;
		box-shadow: ${CoreTokens.Elevation0};
	}

	&:hover {
		${hoverStyles}
	}
	${(props) => (props.hover ? hoverStyles : '')}

	&:active {
		${activeStyles}
	}
`;
