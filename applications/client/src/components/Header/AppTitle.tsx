import { css } from '@emotion/react';
import { Logo } from '@redeye/client/components';
import { Header, Txt } from '@redeye/ui-styles';
import type { ComponentProps, FC } from 'react';

type AppTitleProps = ComponentProps<'div'> & {};

const appTitle = 'RedEye'; //
const appSubtitle = 'Red Team C2 Log Visualization';

const logoBaselinePosition = Math.round((99 / 159) * 100) / 100;
const logoSize = 200;
const logoSizeSmall = 160;

export const AppTitle: FC<AppTitleProps> = ({ ...props }) => (
	<div
		{...props}
		css={css`
			position: relative;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
		`}
	>
		<div>
			<Header
				h={1}
				css={css`
					font-size: 3.5rem !important;
					margin-bottom: 0.75rem;
					margin-left: -3px;
				`}
				cy-test="appTitle"
			>
				<Logo
					css={css`
						margin-top: -${logoBaselinePosition * logoSize}px;
						margin-bottom: -${(1 - logoBaselinePosition) * logoSize - 1}px;
						margin-left: -${logoSize}px;
						height: ${logoSize}px;
						width: ${logoSize}px;
						transform: translateX(-2rem);
						@media (max-width: 64rem) {
							height: ${logoSizeSmall}px;
							width: ${logoSizeSmall}px;
							position: static;
							display: block;
							transform: none;
							/* margin: -3rem 1.5rem -1rem -2.5rem; */
							margin: 0;
							margin-left: -${logoSizeSmall * 0.25}px;
							margin-bottom: 0.5rem;
						}
					`}
				/>
				<Txt>{appTitle}</Txt>
			</Header>
			<Txt muted small meta>
				{appSubtitle}
			</Txt>
		</div>
	</div>
);
