import { InputGroup } from '@blueprintjs/core';
import { createState } from '@redeye/client/components/mobx-create-state';
import type { HostModel, RootStoreBase } from '@redeye/client/store';
import { hostQuery, useStore } from '@redeye/client/store';
import { InfoType } from '@redeye/client/types';
import { Flex, Txt } from '@redeye/ui-styles';
import { useMutation } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { draft, Model, model, prop } from 'mobx-keystone';
import type { NodeColor } from '@redeye/client/views';
import { nodeColor } from '@redeye/client/views';
import { ToggleHiddenDialog } from './HideDialog';
import {
	MetaGridLayout,
	MetaLabel,
	MetaSection,
	SaveInputButton,
	ToggleHiddenButton,
} from './components/general-components';
import { useToggleHidden } from '../hooks/use-toggle-hidden';
import { NodePreviewBox } from './components/NodePreview';
import { NodeColorSelect } from './components/NodeColorSelect';
import { useCheckNonHidableEntities } from '../hooks/use-check-nonHidable-entities';

@model('DraftHostMeta')
class DraftHostMeta extends Model({
	displayName: prop<string>().withSetter(),
	color: prop<NodeColor>().withSetter(),
}) {}

type MutateParams = {
	key: keyof Parameters<RootStoreBase['mutateUpdateHostMetadata']>[0];
	path: keyof ConstructorParameters<typeof DraftHostMeta>[0];
};

export const HostMeta = observer((props) => {
	const store = useStore();
	const host = store.campaign.interactionState.selectedHost?.current;

	const state = createState({
		metaDraft: draft(
			new DraftHostMeta({
				displayName: store.campaign.interactionState.selectedHost?.current.displayName || '',
				color: (store.campaign.interactionState.selectedHost?.current.meta[0]?.maybeCurrent?.color ||
					'default') as NodeColor,
			})
		),
	});

	const [toggleHidden, mutateToggleHidden] = useToggleHidden(
		async () => await store.graphqlStore.mutateToggleHostHidden({ campaignId: store.campaign?.id!, hostId: host?.id! })
	);

	const { cantHideEntities, isDialogDisabled } = useCheckNonHidableEntities('hosts', !!host?.hidden || false, [
		host?.id || '',
	]);

	const { mutate: mutateByKey } = useMutation<{ updateHostMetadata: HostModel }, unknown, MutateParams>(
		async (variables) => {
			const { key, path } = variables;
			return await store.graphqlStore.mutateUpdateHostMetadata(
				{
					[key]: state.metaDraft.data[path],
					campaignId: store.campaign.id as string,
					hostId: host?.id as string,
				},
				hostQuery
			);
		},
		{
			onSuccess: (data, args) => {
				state.metaDraft.commitByPath([args.path]);
				if (args.key === 'hostDisplayName') {
					store.campaign.graph?.updateNodeName(
						data.updateHostMetadata.id,
						data.updateHostMetadata.displayName || state.metaDraft.originalData.displayName
					);
				} else if (args.key === 'color') {
					store.campaign.graph?.updateNodeVisual({
						nodeId: host?.id as string,
						className: nodeColor[state.metaDraft.originalData.color].className,
						shape: 'circle',
					});
				}
			},
			onError: (_, args) => {
				state.metaDraft.resetByPath([args.path]);
			},
		}
	);

	return (
		<div {...props}>
			<MetaSection>
				<MetaGridLayout>
					<MetaLabel>Display Name</MetaLabel>
					<InputGroup
						disabled={!!store.appMeta.blueTeam}
						placeholder={host?.hostName}
						value={state.metaDraft.data.displayName}
						onChange={(e) => {
							state.metaDraft.data.setDisplayName(e.target.value);
						}}
						onSubmit={() =>
							state.metaDraft.isDirtyByPath(['displayName']) &&
							mutateByKey({ key: 'hostDisplayName', path: 'displayName' })
						}
						// Add a button to save. can also have fxn that checks every n seconds and
						// saves if no change or rely on tabbing away, clicking away, or hitting enter
						rightElement={
							<SaveInputButton
								disabled={!state.metaDraft.isDirtyByPath(['displayName'])}
								onClick={() => mutateByKey({ key: 'hostDisplayName', path: 'displayName' })}
							/>
						}
					/>
					<MetaLabel>Type</MetaLabel>
					<Txt>{host?.$modelType}</Txt>
					<MetaLabel>OS</MetaLabel>
					<Txt>{host?.meta.map((meta) => meta.maybeCurrent?.os).join(', ')}</Txt>
					<MetaLabel>IPs</MetaLabel>
					<div>
						{host?.meta.map((metaItem) => (
							<Txt block key={metaItem.id}>
								{metaItem.maybeCurrent?.ip}
							</Txt>
						))}
					</div>
					<MetaLabel>Graph Appearance</MetaLabel>
					<Flex gap={1}>
						<NodePreviewBox color={state.metaDraft.data.color} type="host" />
						<NodeColorSelect
							value={state.metaDraft.data.color}
							onItemSelect={(color) => {
								state.metaDraft.data.setColor(color.name);
								mutateByKey({ key: 'color', path: 'color' });
							}}
							css={{ flex: '1 1 auto' }}
							nodeIconProps={{ type: 'host' }}
						/>
					</Flex>
				</MetaGridLayout>
			</MetaSection>
			<ToggleHiddenButton
				cy-test="show-hide-this-host"
				disabled={!!store.appMeta.blueTeam}
				onClick={() => (isDialogDisabled ? mutateToggleHidden.mutate() : toggleHidden.update('showHide', true))}
				isHiddenToggled={!!host?.hidden}
				typeName="host"
			/>
			<ToggleHiddenDialog
				typeName="host"
				isOpen={toggleHidden.showHide}
				infoType={InfoType.HOST}
				isHiddenToggled={!!host?.hidden}
				onClose={() => toggleHidden.update('showHide', false)}
				onHide={() => mutateToggleHidden.mutate()}
				cantHideEntities={cantHideEntities}
			/>
		</div>
	);
});
