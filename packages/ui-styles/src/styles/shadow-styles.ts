// exported as part of UtilityStyles

import { css, SerializedStyles } from '@emotion/react';

type Position = 'top' | 'right' | 'bottom' | 'left';
type Position2 = Position | 'vertical' | 'horizontal';

export const innerBoxShadow = (
	position: Position = 'top',
	elevation: number = 3,
	withBorder = false // TODO: should be true by default
) => {
	elevation = Math.max(0, Math.min(5, elevation));

	const xy = (size: number): [number, number] => {
		return position === 'top'
			? [0, size]
			: position === 'right'
			? [-size, 0]
			: position === 'bottom'
			? [0, -size]
			: position === 'left'
			? [size, 0]
			: [0, 0];
	};

	const b = withBorder ? 1 : 0;
	const border = [...xy(b), 0, 0];

	const k = [0, 0, 1, 4, 8][elevation] || 0;
	const keyLight = [...xy(k), k, -k];

	const a = [0, 2, 6, 24, 48][elevation] || 0;
	const ambientLight = [...xy(a), a, -a];

	const px = (values: number[]) => values.map((value) => value + 'px').join(' ');

	// box-shadow: x y blur spread color;
	return css`
		box-shadow: inset ${px(border)} hsla(var(--pt-shadow-color-hsl), var(--pt-border-shadow-opacity)),
			inset ${px(keyLight)} hsla(var(--pt-shadow-color-hsl), var(--pt-drop-shadow-opacity)),
			inset ${px(ambientLight)} hsla(var(--pt-shadow-color-hsl), var(--pt-drop-shadow-opacity));
	`;
};

const shadowStyle = css`
	content: '';
	position: absolute;
	z-index: 1;
	pointer-events: none;
`;

type PseudoPosition = (elevation?: number, withBorder?: boolean) => SerializedStyles;
const positionTop: PseudoPosition = (e, b) => css`
	${innerBoxShadow('top', e, b)};
	top: 0;
	right: 0;
	/* bottom: 0; */
	left: 0;
	height: 2rem;
	/* width: 2rem; */
`;
const positionRight: PseudoPosition = (e, b) => css`
	${innerBoxShadow('right', e, b)};
	top: 0;
	right: 0;
	bottom: 0;
	/* left: 0; */
	/* height: 2rem; */
	width: 2rem;
`;
const positionBottom: PseudoPosition = (e, b) => css`
	${innerBoxShadow('bottom', e, b)};
	/* top: 0; */
	right: 0;
	bottom: 0;
	left: 0;
	height: 2rem;
	/* width: 2rem; */
`;
const positionLeft: PseudoPosition = (e, b) => css`
	${innerBoxShadow('left', e, b)};
	top: 0;
	/* right: 0; */
	bottom: 0;
	left: 0;
	/* height: 2rem; */
	width: 2rem;
`;

export const innerBoxShadowOverlay = (
	position: Position2 = 'vertical',
	elevation?: number,
	withBorder?: boolean
) => css`
	position: relative;
	&:before,
	&:after {
		${shadowStyle}
	}
	&:before {
		${position === 'top' || position === 'vertical' ? positionTop(elevation, withBorder) : ''}
		${position === 'left' || position === 'horizontal' ? positionLeft(elevation, withBorder) : ''}
	}
	&:after {
		${position === 'bottom' || position === 'vertical' ? positionBottom(elevation, withBorder) : ''}
		${position === 'right' || position === 'horizontal' ? positionRight(elevation, withBorder) : ''}
	}
`;
