import { css } from '@emotion/react';
import { useStore } from '@redeye/client/store';
import type { PopoverButtonProps } from '@redeye/ui-styles';
import { Flex, ExternalLink, CoreTokens, PopoverButton, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';

export const ModeIndicator = observer<Omit<PopoverButtonProps, 'content'> & { fullName?: boolean }>(
	({ popoverProps, fullName, ...props }) => {
		const store = useStore();
		const isRedTeam = !store.appMeta.blueTeam;

		let teamAcronym = fullName ? 'Blue Team' : 'BT';
		let team = 'Blue Team';
		let description = 'Restricted RedEye functionality. Editing and commenting features are not available.';
		let teamCSS = blueStyle;

		if (isRedTeam) {
			teamAcronym = fullName ? 'Red Team' : 'RT';
			team = 'Red Team';
			description = 'Full RedEye functionality. Editing and commenting is not restricted.';
			teamCSS = redStyle;
		}

		return (
			<PopoverButton
				popoverProps={{
					position: 'right',
					interactionKind: 'hover',
					...popoverProps,
				}}
				content={
					<Flex column gap={4} align="start" css={{ width: 320, padding: 12 }}>
						<Txt large bold>
							<Txt>{team}</Txt> <Txt muted>Mode</Txt>
						</Txt>
						<Txt muted>{description}</Txt>
						<ExternalLink href="https://github.com/cisagov/redeye#red-team--blue-team-modes">Learn more</ExternalLink>
					</Flex>
				}
				active={false}
				{...props}
			>
				<div cy-test={teamAcronym} css={teamCSS}>
					{teamAcronym}
				</div>
			</PopoverButton>
		);
	}
);

const indicatorStyle = css`
	padding: 2px;
	font-weight: 800;
	font-size: 11px;
	line-height: 11px;
	text-transform: uppercase;
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
