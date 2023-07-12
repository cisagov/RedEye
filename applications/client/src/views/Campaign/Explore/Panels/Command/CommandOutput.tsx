import { Button, Intent } from '@blueprintjs/core';
import { ChevronSort16, Launch16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import type { MitreAttackId } from '@redeye/client/components';
import { CarbonIcon, MitreAttack } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import type { CommandModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { ScreenShotCommand } from '@redeye/client/views';
import { Txt, CoreTokens, UtilityStyles, Flex, Spacer } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import { Fragment } from 'react';

type CommandOutputProps = {
	command: CommandModel | undefined;
};
const LINE_LIMIT = 10;

export const CommandOutput = observer<CommandOutputProps>(({ command }) => {
	const store = useStore();
	const state = createState({
		showAll: false,
		toggleShowAll() {
			this.showAll = !this.showAll;
		},
		get commandOutputLines() {
			const commandOutputLines = command?.outputLines.slice(); // shallow copy to edit
			if (commandOutputLines) {
				while (commandOutputLines[0] === '') {
					commandOutputLines.shift();
				}
				while (commandOutputLines[commandOutputLines.length - 1] === '') {
					commandOutputLines.pop();
				}
			}
			return commandOutputLines;
		},
		get renderedLines() {
			return state.showAll ? this.commandOutputLines : this.commandOutputLines?.slice(0, LINE_LIMIT + 1);
		},
		get collapsedLineCount() {
			return (this.commandOutputLines?.length || 0) - LINE_LIMIT;
		},
	});

	return (
		<div css={[rootWrapperStyle, UtilityStyles.innerBoxShadowOverlay('vertical', 2)]}>
			<div css={outputMetaStyle}>
				<div>
					{command?.uniqueAttackIds?.length === 0 ? (
						<Txt small italic disabled>
							No MITRE ATT&amp;CKs
						</Txt>
					) : (
						command?.uniqueAttackIds
							?.filter((m) => m) // sometimes m is undefined
							.map((mitreAttack, i) => (
								<Fragment key={mitreAttack}>
									{i === 0 ? (
										<Txt small>
											MITRE ATT&amp;CKs:
											<Spacer />
										</Txt>
									) : (
										<Spacer>·</Spacer>
									)}
									<MitreAttack
										miterAttackId={mitreAttack as MitreAttackId}
										cy-test="mitre-attack-link"
										key={mitreAttack}
										css={{ display: 'inline-block' }}
									/>
								</Fragment>
							))
					)}
				</div>
			</div>
			<div css={outputScrollWrapperStyle} cy-test="log-details">
				<div css={outputOverflowWrapperStyle}>
					<pre css={preStyles} cy-test="logInfo">
						{command?.inputLog?.blob}
					</pre>
					{state.renderedLines?.length ? (
						<>
							<pre css={preStyles} cy-test="logInfo">
								{state.renderedLines?.[0]}
							</pre>
							<pre css={preStyles} cy-test="logInfo">
								{state.renderedLines?.[1]}
							</pre>
							<pre css={preStyles} cy-test="log">
								{state.renderedLines?.slice(2, state.renderedLines.length).join('\n')}
								{command?.inputText === 'screenshot' && <ScreenShotCommand command={command} />}
							</pre>
							<Flex align="center" css={showMoreWrapperStyle}>
								{state.collapsedLineCount > 0 && (
									<>
										<Button
											cy-test="showMoreLines"
											icon={<CarbonIcon icon={ChevronSort16} />}
											onClick={state.toggleShowAll}
											text={
												state.showAll
													? 'Show less'
													: `Show ${state.collapsedLineCount} more line${state.collapsedLineCount === 1 ? '' : 's'}`
											}
											intent={Intent.PRIMARY}
											minimal
											small
										/>
										<Spacer>|</Spacer>
									</>
								)}
								{command && (
									<Button
										cy-test="openRawLogs"
										text="Show Raw Logs"
										rightIcon={<CarbonIcon icon={Launch16} />}
										onClick={() => {
											store.router.updateQueryParams({ queryParams: { 'raw-command': command.id } });
										}}
										intent={Intent.PRIMARY}
										minimal
										small
									/>
								)}
							</Flex>
						</>
					) : (
						<pre css={preStyles} cy-test="logInfo">
							This command has no output
						</pre>
					)}
				</div>
			</div>
		</div>
	);
});

const rootWrapperStyle = css`
	background-color: ${CoreTokens.Background3b};
`;
const outputMetaStyle = css`
	width: 100%;
	display: flex;
	/* border-bottom: 1px solid ${CoreTokens.Background1}; */
	/* align-items: baseline; */
	padding: 0.25rem 1rem 0.25rem 3rem;
`;
const outputScrollWrapperStyle = css`
	overflow-x: auto;
`;
const outputOverflowWrapperStyle = css`
	width: fit-content; // magic?
	min-width: 100%;
`;
const preStyles = css`
	padding: 0.25rem 1rem 0.25rem 3rem;
	margin: 0;
	font-size: ${CoreTokens.FontSizeSmall};
	color: ${CoreTokens.TextMuted};
	border-top: 1px solid ${CoreTokens.Background1};
	white-space: pre;
`;
const showMoreWrapperStyle = css`
	border-top: 1px solid ${CoreTokens.Background1};
	padding: 0 1rem 0 2.25rem;
	width: fit-content;
	position: sticky;
	left: 0;
`;
// const showMoreButtonStyle = css`
// `;
