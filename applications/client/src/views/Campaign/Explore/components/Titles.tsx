import type { FC, ReactNode } from 'react';
import { css } from '@emotion/react';
import type { HeaderProps } from '@redeye/ui-styles';
import { Header, Txt } from '@redeye/ui-styles';

type PanelHeaderProps = HeaderProps & {
	primaryName?: ReactNode;
	secondaryName?: ReactNode;
};

export const PanelHeader: FC<PanelHeaderProps> = ({ ...props }) => <Header {...props} />;

export const DoublePanelHeader: FC<PanelHeaderProps> = ({ primaryName, secondaryName, ...props }) => (
	<Header h={2} cy-test="beacon-username" {...props}>
		<Txt
			cy-test="beaconName"
			css={css`
				display: inline-block;
			`}
		>
			{primaryName}
		</Txt>{' '}
		<Txt
			cy-test="userName"
			muted
			normal
			css={css`
				display: inline-block;
			`}
		>
			{secondaryName}
		</Txt>
	</Header>
);
