import { Button, InputGroup } from '@blueprintjs/core';
import { Select2 } from '@blueprintjs/select';
import type { ItemRenderer } from '@blueprintjs/select';
import { CaretDown16 } from '@carbon/icons-react';
import { CarbonIcon } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import type { RootStoreBase, ServerModel } from '@redeye/client/store';
import { serverQuery, useStore } from '@redeye/client/store';
import { ServerType } from '@redeye/client/store/graphql/ServerTypeEnum';
import { InfoType } from '@redeye/client/types';
import type { NodeColor } from '@redeye/client/views';
import { nodeColor, ToggleHiddenDialog } from '@redeye/client/views';
import { useMutation } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { MenuItem2 } from '@blueprintjs/popover2';
import { Flex } from '@redeye/ui-styles';
import { draft, Model, model, prop } from 'mobx-keystone';
import {
	MetaGridLayout,
	MetaLabel,
	MetaSection,
	SaveInputButton,
	ToggleHiddenButton,
} from './components/general-components';
import { useToggleHidden } from '../hooks/use-toggle-hidden';
import { useCheckNonHidableEntities } from '../hooks/use-check-nonHidable-entities';
import { NodePreviewBox } from './components/NodePreview';
import { NodeColorSelect } from './components/NodeColorSelect';

@model('DraftServerMeta')
class DraftServerMeta extends Model({
	displayName: prop<string>().withSetter(),
	color: prop<NodeColor>().withSetter(),
	serverType: prop<ServerType>().withSetter(),
}) {}

type MutateParams = {
	key: keyof Parameters<RootStoreBase['mutateUpdateServerMetadata']>[0];
	path: keyof ConstructorParameters<typeof DraftServerMeta>[0];
};

export const ServerMeta = observer((props) => {
	const store = useStore();
	const server = store.campaign.interactionState.selectedServer?.maybeCurrent;

	const state = createState({
		metaDraft: draft(
			new DraftServerMeta({
				displayName: server?.displayName || '',
				serverType: (server?.meta?.maybeCurrent?.type || serverTypeSelectItems[1].key) as ServerType,
				color: (server?.meta?.maybeCurrent?.color || 'default') as NodeColor,
			})
		),
	});

	const { cantHideEntities, isDialogDisabled } = useCheckNonHidableEntities('servers', !!server?.hidden, [
		server?.id || '',
	]);

	const { mutate: mutateByKey } = useMutation<{ updateServerMetadata: ServerModel }, unknown, MutateParams>(
		async (variables) => {
			const { key, path } = variables;
			return await store.graphqlStore.mutateUpdateServerMetadata(
				{
					[key]: state.metaDraft.data[path],
					campaignId: store.campaign.id as string,
					serverId: server?.id as string,
				},
				serverQuery
			);
		},
		{
			onSuccess: (data, args) => {
				state.metaDraft.commitByPath([args.path]);
				if (args.key === 'serverDisplayName') {
					store.graphqlStore.queryBeacons({ campaignId: store.campaign.id!, hidden: store.settings.showHidden });
					store.graphqlStore.queryHosts({ campaignId: store.campaign.id!, hidden: store.settings.showHidden });

					// Update names in graph
					const name = data.updateServerMetadata.displayName || state.metaDraft.originalData.displayName;
					store.campaign.graph?.updateNodeName(data.updateServerMetadata.id, name);
					if (server?.serverHost) {
						store.campaign.graph?.updateNodeName(server?.serverHost.id, name);
					}
					if (server?.serverBeacon) {
						store.campaign.graph?.updateNodeName(server?.serverBeacon.id, name);
					}
				} else if (args.key === 'color') {
					store.campaign.graph?.updateNodeVisual({
						nodeId: data.updateServerMetadata.id,
						className: nodeColor[state.metaDraft.originalData.color].className,
						shape: 'hexagonUp',
					});
				}
			},
		}
	);

	const [toggleHidden, mutateToggleHidden] = useToggleHidden(
		async () =>
			await store.graphqlStore.mutateToggleServerHidden({
				campaignId: store.campaign?.id!,
				serverId: server?.id!,
			})
	);

	const renderSort: ItemRenderer<{ key: string; label: string }> = (item, { handleClick, modifiers }) => {
		if (!modifiers.matchesPredicate) {
			return null;
		}
		return (
			<MenuItem2
				active={modifiers.active}
				key={item.key}
				onClick={handleClick}
				text={item.label}
				cy-test={item.label}
			/>
		);
	};

	return (
		<div {...props}>
			<MetaSection>
				<MetaGridLayout>
					<MetaLabel>Display Name</MetaLabel>
					<InputGroup
						disabled={!!store.appMeta.blueTeam}
						placeholder={server?.displayName || ''}
						value={state.metaDraft.data.displayName}
						onChange={(e) => {
							state.metaDraft.data.setDisplayName(e.target.value);
						}}
						// Add a button to save. can also have fxn that checks every n seconds and
						// saves if no change or rely on tabbing away, clicking away, or hitting enter
						rightElement={
							<SaveInputButton
								disabled={!state.metaDraft.isDirtyByPath(['displayName'])}
								onClick={() => mutateByKey({ key: 'serverDisplayName', path: 'displayName' })}
							/>
						}
					/>
					<MetaLabel>Type</MetaLabel>
					<Select2
						disabled={!!store.appMeta.blueTeam}
						items={serverTypeSelectItems}
						itemRenderer={renderSort}
						activeItem={serverTypeSelectItems.find((item) => item.label === state.metaDraft.data.serverType)}
						onItemSelect={(itemType) => {
							state.metaDraft.data.setServerType(itemType.label);
							mutateByKey({ key: 'serverType', path: 'serverType' });
						}}
						filterable={false}
						fill
					>
						<Button
							disabled={!!store.appMeta.blueTeam}
							text={state.metaDraft.data.serverType}
							alignText="left"
							rightIcon={<CarbonIcon icon={CaretDown16} />}
							fill
						/>
					</Select2>
					<MetaLabel>Graph Appearance</MetaLabel>
					<Flex gap={1}>
						<NodePreviewBox color={state.metaDraft.data.color} type="server" />
						<NodeColorSelect
							value={state.metaDraft.data.color}
							onItemSelect={(color) => {
								state.metaDraft.data.setColor(color.name);
								mutateByKey({ key: 'color', path: 'color' });
							}}
							css={{ flex: '1 1 auto' }}
							nodeIconProps={{ type: 'server' }}
						/>
					</Flex>
				</MetaGridLayout>
			</MetaSection>
			<ToggleHiddenButton
				cy-test="show-hide-this-server"
				disabled={!!store.appMeta.blueTeam}
				onClick={() => (isDialogDisabled ? mutateToggleHidden.mutate() : toggleHidden.update('showHide', true))}
				isHiddenToggled={!!server?.hidden}
				typeName="server"
			/>
			<ToggleHiddenDialog
				typeName="server"
				infoType={InfoType.SERVER}
				isHiddenToggled={!!server?.hidden}
				onClose={() => toggleHidden.update('showHide', false)}
				onHide={() => mutateToggleHidden.mutate()}
				isOpen={toggleHidden.showHide}
				cantHideEntities={cantHideEntities}
			/>
		</div>
	);
});

const serverTypeSelectItems = Object.entries(ServerType).map(([key, label]) => ({
	key,
	label,
}));
