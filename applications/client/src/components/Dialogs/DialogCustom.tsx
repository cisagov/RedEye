import type { DialogProps } from '@blueprintjs/core';
import { Button, Classes, Dialog } from '@blueprintjs/core';
import { Close16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import type { WithConditionalCSSProp } from '@emotion/react/types/jsx-namespace';
import { CoreTokens, Header } from '@redeye/ui-styles';
import type { ComponentProps, FC, ReactNode } from 'react';
import { CarbonIcon } from '../CarbonIcon';

export type DialogCustomProps = DialogProps & {
	children?: ReactNode;
	headerProps?: WithConditionalCSSProp<ComponentProps<'div'>>;
};

export const DialogCustom: FC<DialogCustomProps> = ({ children, title, headerProps, ...props }) => (
	<Dialog css={dialogWrapperStyles} {...props} title={undefined}>
		<div
			{...headerProps}
			css={[dialogHeaderStyles, title == null && dialogHeaderEmptyStyles, headerProps?.css]}
			className={Classes.DIALOG_HEADER}
		>
			<Button
				cy-test="close-log"
				minimal
				onClick={props.onClose}
				css={css`
					position: absolute;
					top: 0;
					right: 0;
					margin: 0.25rem;
					color: ${CoreTokens.TextMuted};
				`}
				rightIcon={<CarbonIcon icon={Close16} />}
				// text={'Cancel'}
			/>
			{typeof title === 'string' ? <Header small>{title}</Header> : title}
		</div>
		{children}
	</Dialog>
);

const dialogWrapperStyles = css`
	// some styles applied from globalStyle in common.styles.tsx
	margin: 6rem 3rem;
	width: 100%;
	max-width: 44rem;
	/* max-width: unset; */
`;
const dialogHeaderStyles = css`
	position: sticky;
	top: 0;
	z-index: 10;
	opacity: 0.97; // to see wats scrollin underneath
	background-color: ${CoreTokens.Background1};
	border-bottom: 1px solid ${CoreTokens.BorderNormal};
	box-shadow: none;
	/* display: block; */
	/* padding: 1rem; */
`;
const dialogHeaderEmptyStyles = css`
	min-height: unset;
	border: none;
	padding: 0;
`;
