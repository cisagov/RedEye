import type { DialogProps } from '@blueprintjs/core';
import { Button, Classes, Dialog } from '@blueprintjs/core';
import { Close16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import type { WithConditionalCSSProp } from '@emotion/react/types/jsx-namespace';
import { CoreTokens, Header } from '@redeye/ui-styles';
import type { ComponentProps, FC } from 'react';
import { CarbonIcon } from '../CarbonIcon';

export type DialogExProps = DialogProps & {
	headerProps?: WithConditionalCSSProp<ComponentProps<'div'>>;
	/** The Dialog will not be larger than the screen height  */
	fixedHeight?: boolean;
	/** The Dialog will be wider  */
	wide?: boolean;
};

export const DialogEx: FC<DialogExProps> = ({
	children,
	title,
	headerProps,
	fixedHeight = false,
	wide = false,
	...props
}) => (
	<Dialog
		css={[dialogStyles, wide && wideStyles, fixedHeight && fixedHeightStyles]}
		{...props}
		// title={undefined}
	>
		<div
			{...headerProps}
			css={[dialogHeaderStyles, title == null && dialogHeaderEmptyStyles, headerProps?.css]}
			className={Classes.DIALOG_HEADER}
		>
			<Button
				cy-test="close-log"
				minimal
				onClick={props.onClose}
				css={closeButtonStyles}
				rightIcon={<CarbonIcon icon={Close16} />}
			/>
			{typeof title === 'string' ? <Header small>{title}</Header> : title}
		</div>
		{children}
	</Dialog>
);

const closeButtonStyles = css`
	position: absolute;
	top: 0;
	right: 0;
	margin: 0.25rem;
	color: ${CoreTokens.TextMuted};
`;

const dialogStyles = css`
	// some styles applied from globalStyle in common.styles.tsx
	margin: 3rem;
	align-self: start;
`;

const wideStyles = css`
	width: 100%;
	max-width: 44rem;
`;

const fixedHeightStyles = css`
	min-height: 400px;
	align-self: stretch;
`;

const dialogHeaderStyles = css`
	position: sticky;
	top: 0;
	z-index: 10;
	opacity: 0.97; // to see wats scrollin underneath
	background-color: ${CoreTokens.Background1};
	border-bottom: 1px solid ${CoreTokens.BorderNormal};
	box-shadow: none;
`;

const dialogHeaderEmptyStyles = css`
	min-height: unset;
	border: none;
	padding: 0;
`;
