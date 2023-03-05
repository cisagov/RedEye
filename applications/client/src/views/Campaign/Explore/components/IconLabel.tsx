import { css } from '@emotion/react';
import type { CarbonIconProps } from '@redeye/client/components';
import { CarbonIcon } from '@redeye/client/components';
import { CoreTokens, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps, ReactNode } from 'react';

type TextLabelProps = ComponentProps<'span'> & {
	value?: ReactNode;
	icon: CarbonIconProps['icon'];
};
export const IconLabel = observer<TextLabelProps>(({ value, icon, ...props }) => (
	<Txt small css={{ marginRight: '0.5rem' }} {...props}>
		<Txt>{value}</Txt>
		<CarbonIcon
			icon={icon}
			css={css`
				color: ${CoreTokens.TextDisabled} !important;
				margin-left: 2px;
			`}
		/>
	</Txt>
));
