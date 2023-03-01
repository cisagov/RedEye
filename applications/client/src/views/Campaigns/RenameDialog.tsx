import type { DialogProps } from '@blueprintjs/core';
import { DialogBody, Button, Dialog, FormGroup, InputGroup, Intent } from '@blueprintjs/core';
import { CarbonDialogFooter } from '@redeye/client/components/Dialogs/CarbonDialogFooter';
import { createState } from '@redeye/client/components/mobx-create-state';
import type { CampaignModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { observer } from 'mobx-react-lite';

type Props = { onClose: () => void; campaign: CampaignModel } & Omit<DialogProps, 'isOpen'>;

export const RenameDialog = observer<Props>(({ onClose, campaign, ...rest }) => {
	const store = useStore();
	const state = createState({
		name: campaign.name ?? '',
		isLoading: false,
		nameTaken: false as boolean,
		setCampaignName(e) {
			this.nameTaken = Array.from(store.graphqlStore.campaigns.values()).some(
				(d) => d?.name.toLowerCase() === e.target.value.trim().toLowerCase()
			);
			this.name = e.target.value;
		},
		*updateCampaign() {
			this.isLoading = true;
			yield store.graphqlStore.mutateRenameCampaign({ campaignId: campaign.id, name: this.name });
			yield store.graphqlStore.queryCampaigns();
			this.isLoading = false;
			onClose();
		},
	});

	return (
		<Dialog isOpen onClose={onClose} title="Rename Campaign" {...rest}>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					state.updateCampaign();
				}}
			>
				<DialogBody>
					<FormGroup label="New campaign name" labelFor="text-input">
						<InputGroup
							cy-test="new-campaign-name"
							id="text-input"
							placeholder="Campaign Name"
							intent={state.nameTaken ? Intent.DANGER : Intent.NONE}
							autoFocus
							value={state.name}
							onChange={state.setCampaignName}
						/>
					</FormGroup>
				</DialogBody>
				<CarbonDialogFooter
					actions={
						<>
							<Button text="Cancel" onClick={onClose} />
							<Button
								cy-test="rename-button"
								intent={Intent.PRIMARY}
								disabled={!state.name || state.nameTaken || state.name === campaign.name}
								type="submit"
								loading={state.isLoading}
								text="Rename"
							/>
						</>
					}
				/>
			</form>
		</Dialog>
	);
});
