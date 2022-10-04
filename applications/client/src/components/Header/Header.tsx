import { css } from '@emotion/react';
import { AppOptions, AppTitle } from '@redeye/client/components';
import type { ComponentProps, FC } from 'react';

type HeaderProps = ComponentProps<'div'> & {};

export const AppHeader: FC<HeaderProps> = ({ ...props }) => (
	<header
		css={css`
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			flex-wrap: wrap;
		`}
		{...props}
	>
		<AppTitle css={{ marginBottom: '0.5rem' }} />
		<AppOptions />
	</header>
);
