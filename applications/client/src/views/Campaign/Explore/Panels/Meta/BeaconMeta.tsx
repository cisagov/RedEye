import { InputGroup } from '@blueprintjs/core';
import { DateInput2 } from '@blueprintjs/datetime2';
import { dateTimeFormat, isDefined } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import type { AppStore, CommandGroupModel, CommandModel } from '@redeye/client/store';
import { SortDirection, SortOption, useStore } from '@redeye/client/store';
import { InfoType } from '@redeye/client/types';
import { Flex, Spacer, Txt } from '@redeye/ui-styles';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { Ref } from 'mobx-keystone';
import { observer } from 'mobx-react-lite';
import moment from 'moment-timezone';
import { useEffect } from 'react';
import { useCheckLastUnhidden } from '../hooks/use-check-last-unhidden';
import { BeaconLinkRow } from './BeaconLinkRow';
import { ToggleHiddenDialog } from './HideDialog';
import {
	MetaCommentButton,
	MetaGridLayout,
	MetaLabel,
	MetaSection,
	SaveInputButton,
	ToggleHiddenButton,
} from './MetaComponents';
import { useToggleHidden } from '../hooks/use-toggle-hidden';

const useGetLastBeaconCommand = (
	store: AppStore,
	beaconId: string,
	hostId: string
): { commands: CommandModel[] } | undefined => {
	const { data: commandsData } = useQuery(
		['commands', store.campaign.id, beaconId],
		async () =>
			await store.graphqlStore.queryCommandIds({
				beaconId,
				hostId,
				campaignId: store.campaign?.id!,
				sort: { direction: SortDirection.DESC, sortBy: SortOption.time },
			})
	);

	const { data: commandData } = useQuery(
		['command', store.campaign.id, beaconId],
		async () =>
			await store.graphqlStore.queryCommands({
				campaignId: store.campaign?.id!,
				commandIds: [commandsData?.commandIds[commandsData.commandIds.length - 1]],
			}),
		{
			enabled: !!commandsData?.commandIds?.length,
		}
	);
	return commandData;
};

const getMinMaxDate = (minDate: Date | null | undefined, maxDate: Date | null | undefined) => {
	const min = minDate ? moment(minDate) : undefined;
	const max = maxDate ? moment(maxDate) : undefined;
	return { minDate: min?.startOf('day').toDate(), maxDate: max?.add(1, 'day').startOf('day').toDate() };
};

export const BeaconMeta = observer((props) => {
	const store = useStore();
	const beacon = store.campaign.interactionState.selectedBeacon?.current;
	const lastCommand = useGetLastBeaconCommand(store, beacon?.id as string, beacon?.host?.id as string);
	const cmdText = lastCommand?.commands[0]?.inputText;

	const [toggleHidden, mutateToggleHidden] = useToggleHidden(
		async () =>
			await store.graphqlStore.mutateToggleBeaconHidden({
				campaignId: store.campaign?.id!,
				beaconId: beacon?.id!,
			})
	);

	const state = createState({
		get commandGroups() {
			return Array.from(store.campaign?.currentCommandGroups.values())?.filter<Ref<CommandGroupModel>>(isDefined);
		},
		showDayTimePicker: false,
		toggleShowDayTimePicker(value: boolean) {
			this.showDayTimePicker = value;
		},
		displayName: beacon?.displayName || '',
		displayNameNeedsSaving: false,
		displayDeath: beacon?.meta?.[0]?.maybeCurrent?.endTime ?? '',
		displayDeathNeedsSaving: false,
	});

	const { last, isDialogDisabled } = useCheckLastUnhidden('beacon', beacon?.hidden || false);

	useEffect(() => {
		state.update('displayDeath', beacon?.meta?.[0]?.maybeCurrent?.endTime);
	}, [beacon?.meta?.[0]?.maybeCurrent?.endTime, store.campaign.timeline.maxRange]);

	// Use this indirection so network call not being made each time
	// a letter is typed into the InputGroup
	const { mutate: displayNameMutate } = useMutation(
		async () => {
			state.update('displayNameNeedsSaving', false);
			return await store.graphqlStore.mutateUpdateBeaconMetadata({
				beaconDisplayName: state.displayName,
				campaignId: store.campaign.id as string,
				beaconId: beacon?.id as string,
			});
		},
		{
			onSuccess: (data) => {
				store.campaign.graph?.updateNodeName(
					data.updateBeaconMetadata.id,
					data.updateBeaconMetadata.displayName || state.displayName
				);
			},
		}
	);

	const { mutate: timeOfDeathMutate } = useMutation(async () => {
		state.update('displayDeathNeedsSaving', false);
		return await store.graphqlStore.mutateUpdateBeaconMetadata({
			beaconTimeOfDeath: state.displayDeath,
			campaignId: store.campaign.id as string,
			beaconId: beacon?.id as string,
		});
	});

	const dateInputOnChange = (datetime) => {
		const min = store.campaign.timeline.maxRange?.[0];
		const max = store.campaign.timeline.maxRange?.[1];
		const clampedDatetime =
			min && max && datetime ? momentClamp({ value: datetime, min, max }).toISOString() : datetime;
		state.update('displayDeath', clampedDatetime);
		state.update('displayDeathNeedsSaving', true);
	};

	return (
		<div {...props}>
			<MetaCommentButton />
			<MetaSection>
				<MetaGridLayout>
					<MetaLabel>Display Name</MetaLabel>
					<InputGroup
						cy-test="beacon-display-name"
						fill
						disabled={!!store.appMeta.blueTeam}
						placeholder={beacon?.beaconName || ''}
						value={state.displayName}
						onChange={(e) => {
							state.update('displayName', e.target.value);
							state.update('displayNameNeedsSaving', true);
						}}
						// Add a button to save. can also have fxn that checks every n seconds and
						// saves if no change or rely on tabbing away, clicking away, or hitting enter
						rightElement={
							<SaveInputButton
								cy-test="save-beacon-name"
								disabled={!state.displayNameNeedsSaving}
								onClick={() => displayNameMutate()}
							/>
						}
					/>
					<MetaLabel>Process</MetaLabel>
					<Txt>{beacon?.meta[0]?.maybeCurrent?.ip}</Txt>
					<MetaLabel>pid</MetaLabel>
					<Txt>{beacon?.meta[0]?.maybeCurrent?.pid}</Txt>
					<MetaLabel>Time of Death </MetaLabel>
					<div cy-test="beacon-time-of-death">
						<DateInput2
							key={store.settings.timezone}
							disabled={!!store.appMeta.blueTeam}
							value={store.settings.momentTz(state.displayDeath).toISOString()}
							disableTimezoneSelect
							defaultTimezone={store.settings.timezone}
							timePrecision="minute"
							fill
							closeOnSelection={false}
							canClearSelection={false}
							formatDate={(date) => (date == null ? '' : moment(date).format(dateTimeFormat))}
							parseDate={(str) => store.settings.momentTz(str).toDate()}
							onChange={dateInputOnChange}
							{...getMinMaxDate(store.campaign.timeline.maxRange?.[0], store.campaign.timeline.maxRange?.[1])}
							rightElement={
								<SaveInputButton
									cy-test="save-beacon-time-of-death"
									disabled={!state.displayDeathNeedsSaving}
									onClick={() => timeOfDeathMutate()}
								/>
							}
							popoverProps={{
								// defaultIsOpen: state.showDayTimePicker,
								onOpened: () => state.toggleShowDayTimePicker(true),
								onClosed: () => state.toggleShowDayTimePicker(false),
							}}
						/>
						<div css={{ marginTop: '0.5rem' }}>
							<Txt small bold>
								Final Command
							</Txt>
							<Spacer />
							<Txt small>{cmdText}</Txt>
						</div>
					</div>
				</MetaGridLayout>
			</MetaSection>

			<MetaSection>
				<Flex column gap={8}>
					<MetaLabel>Links</MetaLabel>
					{!beacon?.links.from.length && !beacon?.links.to.length ? (
						<Txt italic disabled>
							No links
						</Txt>
					) : (
						<>
							{beacon?.links.from.map((link) => (
								<BeaconLinkRow key={link.id} direction="From" link={link} />
							))}
							{beacon?.links.to.map((link) => (
								<BeaconLinkRow key={link.id} direction="To" link={link} />
							))}
						</>
					)}
				</Flex>
			</MetaSection>
			<ToggleHiddenButton
				cy-test="show-hide-this-beacon"
				disabled={!!store.appMeta.blueTeam}
				onClick={() => (isDialogDisabled ? mutateToggleHidden.mutate() : toggleHidden.update('showHide', true))}
				isHiddenToggled={!!beacon?.hidden}
				typeName="beacon"
			/>
			<ToggleHiddenDialog
				typeName="beacon"
				isOpen={toggleHidden.showHide}
				infoType={InfoType.BEACON}
				isHiddenToggled={!!beacon?.hidden}
				onClose={() => toggleHidden.update('showHide', false)}
				onHide={() => mutateToggleHidden.mutate()}
				last={last}
			/>
		</div>
	);
});

const momentClamp = ({
	value,
	min,
	max,
}: {
	value: moment.MomentInput;
	min: moment.MomentInput;
	max: moment.MomentInput;
}) => moment.max(moment(min), moment.min(moment(value), moment(max)));
