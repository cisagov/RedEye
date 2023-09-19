import { Button, ButtonGroup, Divider, NonIdealState, Spinner } from '@blueprintjs/core';
import { Copy16, UpToTop16, Document16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import type { DialogExProps } from '@redeye/client/components';
import { CarbonIcon, DialogEx } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import type { BeaconModel, CommandModel, LogEntryModel } from '@redeye/client/store';
import { selectFromLogEntry, useStore } from '@redeye/client/store';
import { copyText, NavBreadcrumbs, PanelHeader } from '@redeye/client/views';
import { Txt, CoreTokens, UtilityStyles, Spacer } from '@redeye/ui-styles';
import { useQuery } from '@tanstack/react-query';
import { throttle } from 'throttle-debounce';
import { observer } from 'mobx-react-lite';
import type { FC } from 'react';
import { useEffect, useRef } from 'react';

interface RawLogsViewerProps extends Omit<DialogExProps, 'isOpen'> {
	command?: CommandModel;
	beacon?: BeaconModel;
}

export const RawLogsDialog = observer<RawLogsViewerProps>(({ ...props }) => {
	const store = useStore();

	const scrollTopTargetRef = useRef<HTMLDivElement>(null);

	const state = createState({
		showLogFile: false,
		get isOpen(): boolean {
			return (
				!!(this.beacon && store.router.queryParams['raw-logs']) ||
				!!(this.command && store.router.queryParams['raw-command'])
			);
		},
		get beacon(): BeaconModel | undefined {
			return (
				store.graphqlStore.beacons.get(
					store.router.queryParams['raw-logs']?.substring(store.router.queryParams['raw-logs'].indexOf('-') + 1)
				) ?? this.command?.beacon?.current
			);
		},
		get command(): CommandModel | undefined {
			return store.graphqlStore.commands.get(store.router.queryParams['raw-command']);
		},
		get commandInputId(): string | undefined {
			return this.command?.input?.current?.id;
		},
		onClose() {
			this.showLogFile = false;
			store.router.updateQueryParams({ queryParams: { 'raw-logs': undefined, 'raw-command': undefined } });
		},
		handleCopyText(logsByBeaconId) {
			const fullText = (logsByBeaconId ?? []).map((entry) => getTextFromLog(entry)).join('\n\n');
			copyText(fullText);
		},
		scrollToTop() {
			if (scrollTopTargetRef.current) scrollIntoView(scrollTopTargetRef.current);
		},
		get commandLogEntryIds() {
			return this.commandInputId
				? [this.commandInputId, ...(this.command?.output?.map((ref) => ref.id) || [])]
				: undefined;
		},
	});

	const {
		data: { logsByBeaconId } = {},
		isLoading,
		isError,
	} = useQuery(
		['rawLogs', store.campaign.id, state.commandInputId],
		async () =>
			await store.graphqlStore.queryLogsByBeaconId(
				{
					campaignId: store.campaign.id!,
					beaconId: state.beacon?.id!,
				},
				selectFromLogEntry().toString()
			),
		{ enabled: state.isOpen }
	);

	const {
		data: { logFilesByBeaconId } = {},
		isLoading: isLoadingFiles,
		isError: isErrorFiles,
	} = useQuery(
		['rawLogFile', store.campaign.id, state.commandInputId],
		async () =>
			await store.graphqlStore.queryLogFilesByBeaconId(
				{
					campaignId: store.campaign.id!,
					beaconId: state.beacon?.id!,
				},
				selectFromLogEntry().toString()
			),
		{ enabled: state.isOpen && state.showLogFile && store.campaign.parsers.includes('cobalt-strike-parser') }
	);

	if (!state.command && !state.beacon) return null;

	return (
		<DialogEx
			{...props}
			wide
			isOpen={state.isOpen}
			onClose={state.onClose}
			css={logModelStyles}
			headerProps={{ css: headerStyles }}
			title={
				<>
					<NavBreadcrumbs beacon={state.beacon} onNavigate={state.onClose} command={state.command} />
					<div
						css={css`
							display: flex;
							justify-content: space-between;
							align-items: flex-end;
							flex-wrap: wrap;
							gap: 4px 12px;
						`}
					>
						<PanelHeader cy-test="log-title" nodeIconProps={{ type: 'beacon' }}>
							<Txt ellipsize>
								<Txt>{state.beacon?.computedNameWithHost}</Txt>
								<Spacer>·</Spacer>
								<Txt disabled normal>
									Raw Logs
								</Txt>
							</Txt>
						</PanelHeader>
						<ButtonGroup css={{ marginLeft: -8 }}>
							{store.campaign.parsers.includes('cobalt-strike-parser') ? (
								<Button
									cy-test="view-log-file"
									text="View Log File"
									rightIcon={<CarbonIcon icon={Document16} />}
									active={state.showLogFile}
									intent={state.showLogFile ? 'primary' : 'none'}
									onClick={() => state.update('showLogFile', !state.showLogFile)}
									minimal
								/>
							) : null}
							<Button
								cy-test="scroll-to-top"
								text="Scroll To Top"
								rightIcon={<CarbonIcon icon={UpToTop16} />}
								onClick={state.scrollToTop}
								minimal
							/>
							<Divider />
							<Button
								cy-test="copyLogs"
								text="Copy"
								rightIcon={<CarbonIcon icon={Copy16} />}
								onClick={() => state.handleCopyText(logsByBeaconId)}
								minimal
							/>
						</ButtonGroup>
					</div>
				</>
			}
		>
			<div ref={scrollTopTargetRef} />
			{(isLoading || (state.showLogFile && isLoadingFiles)) && <Spinner css={messagePaddingStyles} />}
			{(isError || (state.showLogFile && isErrorFiles)) && (
				<NonIdealState title="Unable to fetch Logs" icon="error" css={messagePaddingStyles} />
			)}
			<div cy-test="log" css={outputScrollWrapperStyle}>
				<div css={outputOverflowWrapperStyle}>
					{state.showLogFile
						? logFilesByBeaconId?.map((file) => (
								<pre cy-test="log-entry" css={[preStyles]}>
									{file}
								</pre>
						  ))
						: logsByBeaconId
								?.filter((logEntry) => !!getTextFromLog(logEntry))
								.map((logEntry) => {
									const isScrollTarget = state.commandLogEntryIds?.includes?.(logEntry.id);
									const Component = isScrollTarget ? ScrollTargetPre : 'pre';
									return (
										<Component key={logEntry.id} cy-test="log-entry" css={[preStyles]}>
											{getTextFromLog(logEntry)}
										</Component>
									);
								})}
				</div>
			</div>
		</DialogEx>
	);
});

const logModelStyles = css`
	max-width: unset;
	width: calc(100% - 6rem);
`;
const preStyles = css`
	padding: 2px 1rem;
	border-bottom: 1px solid ${CoreTokens.BorderMuted};
	margin: 0;

	&:first-of-type {
		padding-top: 1rem;
	}

	&:last-of-type {
		padding-bottom: 1rem;
	}
`;
const headerStyles = css`
	padding: 1.25rem 0.5rem 0.75rem 1rem;
	display: block;

	${UtilityStyles.innerBoxShadowOverlay('top')}
	position: sticky; // need to reset this to override innerBoxShadowOverlay
	&:before {
		top: 100%;
	}
`;
const outputScrollWrapperStyle = css`
	padding: 0;
	margin: 0;
	overflow-x: auto;
`;
const outputOverflowWrapperStyle = css`
	width: fit-content; // magic?
	min-width: 100%;
`;
const messagePaddingStyles = css`
	padding: 30px;
`;

const ScrollTargetPre: FC = (props) => {
	const ref = useRef<HTMLPreElement>(null);
	useEffect(
		() => () => {
			const el = ref.current;
			// wait 500ms to scrollIntoView for React to finish layout
			if (el) setTimeout(() => scrollIntoView(el), 500);
		},
		[ref.current]
	);

	return <pre css={scrollTargetStyles} ref={ref} {...props} />;
};

// Only fire one scrollIntoView every 1s
const scrollIntoView: (el: HTMLElement) => void = throttle(
	500,
	(el) => {
		el.scrollIntoView({ behavior: 'smooth', block: 'center' });
	},
	{ noTrailing: true }
);

const scrollTargetStyles = UtilityStyles.scrollTarget(4000);

function getTextFromLog(logEntry: LogEntryModel) {
	return logEntry.blob ? logEntry.blob.trim() : null;
}
