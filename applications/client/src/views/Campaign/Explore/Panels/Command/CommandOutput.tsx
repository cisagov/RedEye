import { Button, Intent } from '@blueprintjs/core';
import { ChevronSort16, Launch16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon, MitreAttack, MitreAttackId } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import type { CommandModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { ScreenShotCommand } from '@redeye/client/views';
import { FlexSplitter, Txt, CoreTokens, UtilityStyles } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';

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
			const commandOutputLines = command?.outputLines.slice();
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
						command?.uniqueAttackIds?.map((mitreAttack) => (
							<MitreAttack
								miterAttackId={mitreAttack as MitreAttackId}
								cy-test="mitre-attack-link"
								aria-label="Mitre attack links"
								key={mitreAttack}
								css={css`
									margin-right: 0.5rem;
									display: inline-block; // handle wrapping (for lots of attackIds)
								`}
							/>
						))
					)}
				</div>
				<FlexSplitter />
				{command && (
					<Button
						cy-test="openRawLogs"
						text="Show in Raw Logs"
						rightIcon={<CarbonIcon icon={Launch16} />}
						intent={Intent.PRIMARY}
						onClick={() => {
							store.router.updateQueryParams({ queryParams: { 'raw-command': command.id } });
						}}
						minimal
					/>
				)}
			</div>
			<div css={outputScrollWrapperStyle} cy-test="log-details">
				<div css={outputOverflowWrapperStyle}>
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
							{state.collapsedLineCount > 0 && (
								<div css={showMoreWrapperStyle}>
									<Button
										cy-test="showMoreLines"
										icon={<CarbonIcon icon={ChevronSort16} />}
										intent={Intent.PRIMARY}
										onClick={state.toggleShowAll}
										css={showMoreButtonStyle}
										minimal
										small
										text={
											state.showAll
												? 'Show less'
												: `Show ${state.collapsedLineCount} more line${state.collapsedLineCount === 1 ? '' : 's'}`
										}
									/>
								</div>
							)}
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
	align-items: baseline;
	padding: 0 1rem 0 3rem;
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
`;
const showMoreButtonStyle = css`
	margin: 0 1rem 0 2.25rem;
`;
