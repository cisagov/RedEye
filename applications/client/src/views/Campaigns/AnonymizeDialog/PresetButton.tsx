import { Classes } from '@blueprintjs/core';
import { css } from '@emotion/react';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type PresetButtonProps = ComponentProps<'button'> & {
	title: string;
	subText: string;
};

export const PresetButton = observer<PresetButtonProps>(({ title, subText, ...props }) => (
	<button className={Classes.BUTTON} type="button" css={presetButtonStyle} {...props}>
		<div css={buttonTitleStyle}>{title}</div>
		<div>{subText}</div>
	</button>
));

const presetButtonStyle = css`
	height: 3rem;
	min-width: 10rem;
	margin-right: 1px;
	display: inline-flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
`;

const buttonTitleStyle = css`
	font-weight: bold;
	text-align: start;
`;
