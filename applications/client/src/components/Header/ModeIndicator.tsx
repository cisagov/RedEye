import { Popover2 } from '@blueprintjs/popover2';
import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { Tokens, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';

type ModeIndicatorProps = {
	isRedTeam: boolean;
};

export const ModeIndicator = observer<ModeIndicatorProps>(({ isRedTeam }) => {
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
		<>
			<div css={dividerStyle} />
			<Popover2
				position="right"
				autoFocus={false}
				interactionKind="hover"
				usePortal={false}
				content={
					<div css={hoverInfoStyle}>
						<Txt>
							<Txt bold>{team}</Txt> <Txt muted>Mode </Txt>
						</Txt>
						<Txt muted>{description}</Txt>
					</div>
				}
			>
				<div css={teamCSS}>{teamAcronym}</div>
			</Popover2>
		</>
	);
});

const dividerStyle = css`
	width: 15px;
	height: 10px;
	align-content: middle;
	padding-top: 1px;
	padding-bottom: 10px;
	border-top: 2px solid ${Tokens.Colors.Black};
`;

const hoverInfoStyle = css`
	display: flex;
	flex-direction: column;
	padding: 8px;
	min-width: 20em;
	max-width: 23em;
	height: 5.25em;
	gap: 4px;
`;

const blueStyle = css`
	padding-right: 2px;
	padding-left: 2px;
	padding-top: 0px;
	padding-bottom: 0px;
	font-weight: 700;
	font-size: 11px;
	line-height: 14px;
	background-color: ${Tokens.Colors.Blue3};
	color: ${Tokens.Colors.Black};
`;

const redStyle = css`
	padding-right: 1px;
	padding-left: 1px;
	padding-top: 0px;
	padding-bottom: 0px;
	font-weight: 700;
	font-size: 11px;
	line-height: 14px;
	background-color: ${Tokens.Colors.Red3};
	color: ${Tokens.Colors.Black};
`;
