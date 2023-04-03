import { Button, InputGroup } from '@blueprintjs/core';
import { Select2 } from '@blueprintjs/select';
import type { ItemRenderer } from '@blueprintjs/select';
import { CaretDown16 } from '@carbon/icons-react';
import { CarbonIcon } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import { serverQuery, useStore } from '@redeye/client/store';
import { ServerType } from '@redeye/client/store/graphql/ServerTypeEnum';
import { InfoType } from '@redeye/client/types';
import { ToggleHiddenDialog } from '@redeye/client/views';
import { useMutation } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { MenuItem2 } from '@blueprintjs/popover2';
import { MetaGridLayout, MetaLabel, MetaSection, SaveInputButton, ToggleHiddenButton } from './MetaComponents';
import { useToggleHidden } from '../hooks/use-toggle-hidden';
import { useCheckLastUnhidden } from '../hooks/use-check-last-unhidden';

export const ServerMeta = observer((props) => {
	const store = useStore();
	const server = store.campaign.interactionState.selectedServer?.maybeCurrent;

	const state = createState({
		displayName: server?.displayName || '',
		displayNameNeedsSaving: false,
		selectedItem: (server?.meta?.maybeCurrent?.type || serverTypeSelectItems[1].key) as ServerType,
		handleItemSelect(item) {
			this.selectedItem = item.key;
			serverMetaUpdate();
		},
	});

	const { last, isDialogDisabled } = useCheckLastUnhidden('server', server?.hidden || false);

	const { mutate: serverMetaUpdate } = useMutation(
		async () => {
			state.update('displayNameNeedsSaving', false);
			return await store.graphqlStore.mutateUpdateServerMetadata(
				{
					serverDisplayName: state.displayName,
					serverType: state.selectedItem,
					campaignId: store.campaign.id as string,
					serverId: server?.id as string,
				},
				serverQuery
			);
		},
		{
			onSuccess: (data) => {
				store.graphqlStore.queryBeacons({ campaignId: store.campaign.id!, hidden: store.settings.showHidden });
				store.graphqlStore.queryHosts({ campaignId: store.campaign.id!, hidden: store.settings.showHidden });

				// Update names in graph
				const name = data.updateServerMetadata.displayName || state.displayName;
				store.campaign.graph?.updateNodeName(data.updateServerMetadata.id, name);
				if (server?.serverHost) {
					store.campaign.graph?.updateNodeName(server?.serverHost.id, name);
				}
				if (server?.serverBeacon) {
					store.campaign.graph?.updateNodeName(server?.serverBeacon.id, name);
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
						value={state.displayName}
						onChange={(e) => {
							state.update('displayName', e.target.value);
							state.update('displayNameNeedsSaving', true);
						}}
						// Add a button to save. can also have fxn that checks every n seconds and
						// saves if no change or rely on tabbing away, clicking away, or hitting enter
						rightElement={
							<SaveInputButton disabled={!state.displayNameNeedsSaving} onClick={() => serverMetaUpdate()} />
						}
					/>
					<MetaLabel>Type</MetaLabel>
					<Select2
						disabled={!!store.appMeta.blueTeam}
						items={serverTypeSelectItems}
						itemRenderer={renderSort}
						activeItem={serverTypeSelectItems.find((item) => item.key === state.selectedItem)}
						onItemSelect={state.handleItemSelect}
						filterable={false}
						fill
					>
						<Button
							disabled={!!store.appMeta.blueTeam}
							text={state.selectedItem}
							alignText="left"
							rightIcon={<CarbonIcon icon={CaretDown16} />}
							fill
						/>
					</Select2>
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
				last={last}
			/>
		</div>
	);
});

const serverTypeSelectItems = Object.entries(ServerType).map(([key, label]) => ({
	key,
	label,
}));
