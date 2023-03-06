import { Button, ButtonProps } from '@blueprintjs/core';
import { Popover2, Popover2Props } from '@blueprintjs/popover2';
import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { useStore } from '@redeye/client/store';
import { CoreTokens, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';

type ModeIndicatorProps = ButtonProps & { popoverProps?: Popover2Props };

export const ModeIndicator = observer<ModeIndicatorProps>(({ popoverProps, ...props }) => {
	const store = useStore();
	const isRedTeam = !store.appMeta.blueTeam;

	let teamAcronym: string = 'BT';
	let team: string = 'Blue Team ';
	let description: string = 'Restricted RedEye functionality. Editing and commenting features are not available.';
	let teamCSS: SerializedStyles = blueStyle;

	if (isRedTeam) {
		teamAcronym = 'RT';
		team = 'Red Team ';
		description = 'Full RedEye functionality. Editing and commenting is not restricted.';
		teamCSS = redStyle;
	}

	return (
		<Popover2
			position="right"
			interactionKind="hover"
			content={
				<div css={hoverInfoStyle}>
					<Txt large bold>
						<Txt>{team}</Txt> <Txt muted>Mode </Txt>
					</Txt>
					<Txt muted>{description}</Txt>
				</div>
			}
			renderTarget={({ isOpen, ref, ...targetProps }) => (
				<Button
					elementRef={ref}
					minimal
					fill
					{...props}
					{...targetProps}
					className={[props.className, (targetProps as ButtonProps).className].join(' ')}
				>
					<div cy-test={teamAcronym} css={teamCSS}>
						{teamAcronym}
					</div>
				</Button>
			)}
			{...popoverProps}
		/>
	);
});

const hoverInfoStyle = css`
	display: flex;
	flex-direction: column;
	padding: 12px;
	width: 23em;
	gap: 4px;
`;

const indicatorStyle = css`
	padding: 2px;
	font-weight: 800;
	font-size: 11px;
	line-height: 11px;
	color: ${CoreTokens.Colors.Black};
`;

const blueStyle = css`
	${indicatorStyle};
	background-color: ${CoreTokens.Colors.Blue3};
`;

const redStyle = css`
	${indicatorStyle};
	background-color: ${CoreTokens.Colors.Red3};
`;
