import { css } from '@emotion/react';
import type { CarbonIconProps } from '@redeye/client/components';
import { CarbonIcon } from '@redeye/client/components';
import { CoreTokens, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type TextLabelProps = ComponentProps<'span'> & {
	value?: null | number;
	icon: CarbonIconProps['icon'];
};
export const IconLabel = observer<TextLabelProps>(({ value, icon, ...props }) => (
	<span
		css={css`
			margin-right: 0.5rem;
		`}
		{...props}
	>
		<Txt small>{value}</Txt>
		<CarbonIcon
			icon={icon}
			css={css`
				color: ${CoreTokens.TextDisabled} !important;
				margin-left: 2px;
			`}
		/>
	</span>
));
