import { InputGroup } from '@blueprintjs/core';
import { isDefined } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import { HostModel, hostQuery, useStore } from '@redeye/client/store';
import { InfoType } from '@redeye/client/types';
import { Txt } from '@redeye/ui-styles';
import { useMutation } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { ToggleHiddenDialog } from './HideDialog';
import { MetaGridLayout, MetaHeader, SaveInputButton, ToggleHiddenButton } from './Meta.styles';
import { useToggleHidden } from './use-toggle-hidden';

export const HostMeta = observer(() => {
	const store = useStore();
	const host = store.campaign.interactionState.selectedHost;

	const state = createState({
		displayName: store.campaign.interactionState.selectedHost?.current.displayName || '',
		displayNameNeedsSaving: false,
	});

	const [toggleHidden, mutateToggleHidden] = useToggleHidden(
		async () => await store.graphqlStore.mutateToggleHostHidden({ campaignId: store.campaign?.id!, hostId: host?.id! })
	);

	const unhiddenHostCount = Array.from(store.graphqlStore?.hosts.values() || [])
		?.filter<HostModel>(isDefined)
		.filter((h) => !h.cobaltStrikeServer)
		.filter((h) => !h.hidden).length;

	const last = unhiddenHostCount === 1;

	const { mutate: displayNameMutate } = useMutation(
		async () => {
			state.update('displayNameNeedsSaving', false);
			return await store.graphqlStore.mutateUpdateHostMetadata(
				{
					hostDisplayName: state.displayName,
					campaignId: store.campaign.id as string,
					hostId: host?.id as string,
				},
				hostQuery
			);
		},
		{
			onSuccess: (data) => {
				store.campaign.graph?.updateNodeName(
					data.updateHostMetadata.id,
					data.updateHostMetadata.displayName || state.displayName
				);
			},
		}
	);

	return (
		<MetaGridLayout>
			<MetaHeader>Display Name</MetaHeader>
			<InputGroup
				disabled={!!store.appMeta.blueTeam}
				placeholder={store.campaign.interactionState.selectedHost?.current.hostName || ''}
				value={state.displayName}
				onChange={(e) => {
					state.update('displayName', e.target.value);
					state.update('displayNameNeedsSaving', true);
				}}
				onSubmit={() => displayNameMutate()}
				// Add a button to save. can also have fxn that checks every n seconds and
				// saves if no change or rely on tabbing away, clicking away, or hitting enter
				rightElement={<SaveInputButton disabled={!state.displayNameNeedsSaving} onClick={() => displayNameMutate()} />}
			/>
			<MetaHeader>Type</MetaHeader>
			<Txt>{host?.maybeCurrent?.$modelType}</Txt>
			<MetaHeader>OS</MetaHeader>
			<Txt>{host?.current?.meta.map((meta) => meta.maybeCurrent?.os).join(', ')}</Txt>
			<MetaHeader>IPs</MetaHeader>
			<div>
				{host?.maybeCurrent?.meta.map((metaItem) => (
					<Txt block key={metaItem.id}>
						{metaItem.maybeCurrent?.ip}
					</Txt>
				))}
			</div>
			<ToggleHiddenButton
				disabled={!!store.appMeta.blueTeam}
				// onClick={() => toggleHidden.update('showHide', true)}
				onClick={() =>
					window.localStorage.getItem('disableDialog') === 'true' && (!last || (last && host?.current?.hidden))
						? mutateToggleHidden.mutate()
						: toggleHidden.update('showHide', true)
				}
				isHiddenToggled={!!host?.current?.hidden}
				typeName="host"
			/>
			<ToggleHiddenDialog
				typeName="host"
				isOpen={toggleHidden.showHide}
				infoType={InfoType.HOST}
				isHiddenToggled={!!host?.current?.hidden}
				onClose={() => toggleHidden.update('showHide', false)}
				onHide={() => mutateToggleHidden.mutate()}
				last={last}
			/>
		</MetaGridLayout>
	);
});
