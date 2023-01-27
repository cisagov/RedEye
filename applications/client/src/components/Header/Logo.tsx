import { css } from '@emotion/react';
import { ThemeClasses } from '@redeye/ui-styles';
import type { ComponentProps, FC } from 'react';
import LogoDark from './Logo-Dark.svg';
import LogoLight from './Logo-Light.svg';

type LogoProps = ComponentProps<'img'> & {};

export const Logo: FC<LogoProps> = ({ ...props }) => (
	// switching logo based on dark theme is currently disabled
	<>
		<img
			{...props}
			src={LogoDark}
			alt="RedEye Logo"
			css={css`
				.${ThemeClasses.LIGHT} & {
					display: none;
				}
			`}
		/>
		<img
			{...props}
			src={LogoLight}
			alt="RedEye Logo"
			css={css`
				.${ThemeClasses.DARK} & {
					display: none;
				}
			`}
		/>
	</>
);
