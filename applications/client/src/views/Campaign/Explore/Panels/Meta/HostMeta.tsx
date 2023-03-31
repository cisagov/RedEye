import { InputGroup } from '@blueprintjs/core';
import { createState } from '@redeye/client/components/mobx-create-state';
import { hostQuery, useStore } from '@redeye/client/store';
import { InfoType } from '@redeye/client/types';
import { Txt } from '@redeye/ui-styles';
import { useMutation } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { useCheckLastUnhidden } from '../hooks/use-check-last-unhidden';
import { ToggleHiddenDialog } from './HideDialog';
import { MetaGridLayout, MetaLabel, MetaSection, SaveInputButton, ToggleHiddenButton } from './MetaComponents';
import { useToggleHidden } from '../hooks/use-toggle-hidden';

export const HostMeta = observer((props) => {
	const store = useStore();
	const host = store.campaign.interactionState.selectedHost;

	const state = createState({
		displayName: store.campaign.interactionState.selectedHost?.current.displayName || '',
		displayNameNeedsSaving: false,
	});

	const [toggleHidden, mutateToggleHidden] = useToggleHidden(
		async () => await store.graphqlStore.mutateToggleHostHidden({ campaignId: store.campaign?.id!, hostId: host?.id! })
	);

	const { last, isDialogDisabled } = useCheckLastUnhidden('host', host?.current?.hidden || false);

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
		<div {...props}>
			<MetaSection>
				<MetaGridLayout>
					<MetaLabel>Display Name</MetaLabel>
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
						rightElement={
							<SaveInputButton disabled={!state.displayNameNeedsSaving} onClick={() => displayNameMutate()} />
						}
					/>
					<MetaLabel>Type</MetaLabel>
					<Txt>{host?.maybeCurrent?.$modelType}</Txt>
					<MetaLabel>OS</MetaLabel>
					<Txt>{host?.current?.meta.map((meta) => meta.maybeCurrent?.os).join(', ')}</Txt>
					<MetaLabel>IPs</MetaLabel>
					<div>
						{host?.maybeCurrent?.meta.map((metaItem) => (
							<Txt block key={metaItem.id}>
								{metaItem.maybeCurrent?.ip}
							</Txt>
						))}
					</div>
				</MetaGridLayout>
			</MetaSection>
			<ToggleHiddenButton
				cy-test="show-hide-this-host"
				disabled={!!store.appMeta.blueTeam}
				onClick={() => (isDialogDisabled ? mutateToggleHidden.mutate() : toggleHidden.update('showHide', true))}
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
				cantHideEntities={last}
			/>
		</div>
	);
});
