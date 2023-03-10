import type {} from '@blueprintjs/core';
import { Button, ButtonGroup, Divider, NonIdealState, Spinner } from '@blueprintjs/core';
import { Copy16, UpToTop16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon, DialogEx, DialogExProps } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import type { BeaconModel, CommandModel, LogEntryModel } from '@redeye/client/store';
import { selectFromLogEntry, useStore } from '@redeye/client/store';
import { copyText, DoublePanelHeader, NavBreadcrumbs } from '@redeye/client/views';
import { Txt, CoreTokens, UtilityStyles } from '@redeye/ui-styles';
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
					<NavBreadcrumbs command={state.command} onNavigate={state.onClose} />
					<div
						css={css`
							display: flex;
							justify-content: space-between;
							align-items: flex-end;
						`}
					>
						<DoublePanelHeader
							cy-test="log-title"
							primaryName={state.beacon?.displayName}
							secondaryName={
								<>
									<Txt>{state.beacon?.meta?.[0]?.maybeCurrent?.username}</Txt> <Txt disabled>Raw Logs</Txt>
								</>
							}
						/>
						<ButtonGroup>
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
			{isLoading && <Spinner css={messagePaddingStyles} />}
			{isError && <NonIdealState title="Unable to fetch Logs" icon="error" css={messagePaddingStyles} />}
			<div cy-test="log" css={outputScrollWrapperStyle}>
				<div css={outputOverflowWrapperStyle}>
					{logsByBeaconId
						?.filter((logEntry) => !!getTextFromLog(logEntry))
						.map((logEntry) => {
							const scrollToCommand = state.commandLogEntryIds?.includes?.(logEntry.id);
							const Component = scrollToCommand ? AutoScrollPre : 'pre';
							return (
								<Component
									key={logEntry.id}
									cy-test="log-entry"
									css={[preStyles, scrollToCommand && highlightedStyles]}
								>
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
`;
const preStyles = css`
	padding: 0.5rem 1rem;
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
const highlightedStyles = css`
	background: ${CoreTokens.Background1};
`;

const AutoScrollPre: FC = (props) => {
	const ref = useRef<HTMLPreElement>(null);
	useEffect(
		() => () => {
			const el = ref.current;
			if (el) {
				setTimeout(() => {
					scrollIntoView(el);
				}, 500);
			}
		},
		[]
	);

	return <pre {...props} ref={ref} />;
};

// Only fire one scrollIntoView every 1s
const scrollIntoView: (el: HTMLElement) => void = throttle(
	500,
	(el) => {
		el.scrollIntoView({ behavior: 'smooth', block: 'center' });
	},
	{ noTrailing: true }
);

function getTextFromLog(logEntry: LogEntryModel) {
	return logEntry.blob ? logEntry.blob.trim() : null;
}
