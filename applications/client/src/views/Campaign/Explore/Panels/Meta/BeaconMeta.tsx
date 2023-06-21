import { Button, InputGroup, MenuItem } from '@blueprintjs/core';
import { DateInput2 } from '@blueprintjs/datetime2';
import { CarbonIcon, dateTimeFormat, isDefined } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import type {
	AppStore,
	CommandGroupModel,
	CommandModel,
	Shapes,
	RootStoreBase,
	BeaconModel,
} from '@redeye/client/store';
import { BeaconType } from '@redeye/client/store/graphql/BeaconTypeEnum';
import { SortDirection, SortOption, useStore } from '@redeye/client/store';
import { InfoType } from '@redeye/client/types';
import { Flex, Spacer, Txt } from '@redeye/ui-styles';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { Ref } from 'mobx-keystone';
import { observer } from 'mobx-react-lite';
import moment from 'moment-timezone';
import { useEffect } from 'react';
import type { ItemRenderer } from '@blueprintjs/select';
import { Select2 } from '@blueprintjs/select';
import { CaretDown16 } from '@carbon/icons-react';
import { draft, model, Model, prop } from 'mobx-keystone';
import type { NodeColor } from '@redeye/client/views';
import { nodeColor } from '@redeye/client/views';
import { BeaconLinkRow } from './BeaconLinkRow';
import { ToggleHiddenDialog } from './HideDialog';
import {
	MetaGridLayout,
	MetaLabel,
	MetaSection,
	SaveInputButton,
	ToggleHiddenButton,
} from './components/general-components';
import { useToggleHidden } from '../hooks/use-toggle-hidden';
import { NodeColorSelect } from './components/NodeColorSelect';
import { NodePreviewBox } from './components/NodePreview';
import { NodeShapeSelect } from './components/NodeShapeSelect';
import { useCheckNonHidableEntities } from '../hooks/use-check-nonHidable-entities';

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

@model('DraftBeaconMeta')
class DraftBeaconMeta extends Model({
	displayName: prop<string>().withSetter(),
	timeOfDeath: prop<string | null>().withSetter(),
	color: prop<NodeColor>().withSetter(),
	shape: prop<Shapes>().withSetter(),
	beaconType: prop<BeaconType>().withSetter(),
}) {}

type MutateParams = {
	key: keyof Parameters<RootStoreBase['mutateUpdateBeaconMetadata']>[0];
	path: keyof ConstructorParameters<typeof DraftBeaconMeta>[0];
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
		metaDraft: draft(
			new DraftBeaconMeta({
				displayName: beacon?.displayName || '',
				timeOfDeath: beacon?.meta?.[0]?.maybeCurrent?.endTime ?? '',
				color: (beacon?.meta?.[0]?.maybeCurrent?.color ?? 'default') as NodeColor,
				shape: beacon?.meta?.[0]?.maybeCurrent?.shape ?? ('circle' as Shapes),
				beaconType: (beacon?.meta?.[0]?.maybeCurrent?.type || beaconTypeSelectItems[1].label) as BeaconType,
			})
		),
	});

	const { cantHideEntities, isDialogDisabled } = useCheckNonHidableEntities('beacons', beacon?.hidden || false, [
		beacon?.id || '',
	]);

	useEffect(() => {
		state.metaDraft.data.setTimeOfDeath(beacon?.meta?.[0]?.maybeCurrent?.endTime);
	}, [beacon?.meta?.[0]?.maybeCurrent?.endTime, store.campaign.timeline.maxRange]);

	const { mutate: mutateByKey } = useMutation<{ updateBeaconMetadata: BeaconModel }, unknown, MutateParams>(
		async (variables) => {
			const { key, path } = variables;
			return await store.graphqlStore.mutateUpdateBeaconMetadata({
				[key]: state.metaDraft.data[path],
				campaignId: store.campaign.id as string,
				beaconId: beacon?.id as string,
			});
		},
		{
			onSuccess: (data, args) => {
				state.metaDraft.commitByPath([args.path]);
				if (args.key === 'beaconDisplayName') {
					store.campaign.graph?.updateNodeName(
						data.updateBeaconMetadata.id,
						data.updateBeaconMetadata.displayName || state.metaDraft.originalData.displayName
					);
				} else if (args.key === 'color' || args.key === 'shape') {
					store.campaign.graph?.updateNodeVisual({
						nodeId: beacon!.id,
						className: nodeColor[state.metaDraft.originalData.color].className,
						shape: state.metaDraft.originalData.shape,
					});
				}
			},
			onError: (_, args) => {
				state.metaDraft.resetByPath([args.path]);
			},
		}
	);

	const dateInputOnChange = (datetime) => {
		const min = store.campaign.timeline.maxRange?.[0];
		const max = store.campaign.timeline.maxRange?.[1];
		const clampedDatetime =
			min && max && datetime ? momentClamp({ value: datetime, min, max }).toISOString() : datetime;
		state.metaDraft.data.setTimeOfDeath(clampedDatetime);
	};

	const renderSort: ItemRenderer<{ key: string; label: string }> = (item, { handleClick, modifiers }) => {
		if (!modifiers.matchesPredicate) {
			return null;
		}
		return (
			<MenuItem active={modifiers.active} key={item.key} onClick={handleClick} text={item.label} cy-test={item.label} />
		);
	};

	return (
		<div {...props}>
			{/* <MetaCommentButton /> TODO: implement later */}
			<MetaSection>
				<MetaGridLayout>
					<MetaLabel>Display Name</MetaLabel>
					<InputGroup
						cy-test="beacon-display-name"
						fill
						disabled={!!store.appMeta.blueTeam}
						placeholder={beacon?.beaconName || ''}
						value={state.metaDraft.data.displayName}
						onChange={(e) => {
							state.metaDraft.data.setDisplayName(e.target.value);
						}}
						// Add a button to save. can also have fxn that checks every n seconds and
						// saves if no change or rely on tabbing away, clicking away, or hitting enter
						rightElement={
							<SaveInputButton
								cy-test="save-beacon-name"
								disabled={!state.metaDraft.isDirtyByPath(['displayName'])}
								onClick={() => mutateByKey({ key: 'beaconDisplayName', path: 'displayName' })}
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
							value={store.settings.momentTz(state.metaDraft.data.timeOfDeath).toISOString()}
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
									disabled={!state.metaDraft.isDirtyByPath(['timeOfDeath'])}
									onClick={() => mutateByKey({ key: 'beaconTimeOfDeath', path: 'timeOfDeath' })}
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
					<MetaLabel>Type</MetaLabel>
					<Select2
						disabled={!!store.appMeta.blueTeam}
						items={beaconTypeSelectItems}
						itemRenderer={renderSort}
						activeItem={beaconTypeSelectItems.find((item) => item.label === state.metaDraft.data.beaconType)}
						onItemSelect={(itemType) => {
							state.metaDraft.data.setBeaconType(itemType.label);
							mutateByKey({ key: 'beaconType', path: 'beaconType' });
						}}
						filterable={false}
						fill
					>
						<Button
							cy-test="type-dropdown"
							disabled={!!store.appMeta.blueTeam}
							text={state.metaDraft.data.beaconType}
							alignText="left"
							rightIcon={<CarbonIcon icon={CaretDown16} />}
							fill
						/>
					</Select2>
					<MetaLabel>Graph Appearance</MetaLabel>
					<Flex gap={1}>
						<NodePreviewBox color={state.metaDraft.data.color} shape={state.metaDraft.data.shape} />
						<NodeColorSelect
							value={state.metaDraft.data.color}
							onItemSelect={(color) => {
								state.metaDraft.data.setColor(color.name);
								mutateByKey({ key: 'color', path: 'color' });
							}}
							css={{ flex: '1 1 auto' }}
						/>
						<NodeShapeSelect
							activeItem={state.metaDraft.data.shape}
							onItemSelect={(shape) => {
								state.metaDraft.data.setShape(shape as Shapes);
								mutateByKey({ key: 'shape', path: 'shape' });
							}}
							css={{ flex: '1 1 auto' }}
						/>
					</Flex>
				</MetaGridLayout>
			</MetaSection>

			<MetaSection>
				<Flex column gap={8}>
					<MetaLabel cy-test="links">Links</MetaLabel>
					{!beacon?.links.from.length && !beacon?.links.to.length ? (
						<Txt cy-test="no-links" italic disabled>
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
				cantHideEntities={cantHideEntities}
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

const beaconTypeSelectItems = Object.entries(BeaconType).map(([key, label]) => ({
	key,
	label,
}));
