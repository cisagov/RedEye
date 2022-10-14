import type { DialogProps } from '@blueprintjs/core';
import { Button, Callout, Checkbox, Classes, ControlGroup, Dialog, H2, InputGroup, Intent } from '@blueprintjs/core';
import { Close, Export, TrashCan } from '@carbon/icons-react/next';
import { css } from '@emotion/react';
import { createState } from '@redeye/client/components/mobx-create-state';
import type { AnonymizationInput, CampaignModel, FindReplaceInput } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import type { ChangeEvent } from 'react';
import { HoverButton } from '../../../components';
import { OptionsSection } from './OptionsSection';
import { PresetButton } from './PresetButton';

type AnonymizeDialogProps = DialogProps & {
	campaign: CampaignModel;
};

const anonymizeOptions: Record<string, { variable: keyof Omit<AnonymizationInput, 'findReplace'>; label: string }[]> = {
	'Passwords & Hashes': [
		{ variable: 'removePasswordsHashes', label: 'Remove all passwords & hashes from log output - [hashdump], etc...' },
	],
	Keystrokes: [{ variable: 'removeKeystrokes', label: 'Remove keystrokes.txt files' }],
	'Screenshot Images': [{ variable: 'removeScreenshots', label: 'Remove all screenshots' }],
	'Hidden Items': [{ variable: 'removeHidden', label: 'Remove all hidden Beacons, Hosts, and Servers' }],
	'String Replace': [
		{ variable: 'replaceUsernames', label: 'Replace user names' },
		{ variable: 'replaceHostnames', label: 'Replace host names' },
		{ variable: 'replaceDomainsAndIps', label: 'Replace domain names & IPs' },
	],
};

export const AnonymizeDialog = observer<AnonymizeDialogProps>(({ campaign, onClose, ...props }) => {
	const store = useStore();

	const state = createState({
		removePasswordsHashes: true,
		removeHidden: true,
		removeKeystrokes: true,
		removeScreenshots: true,
		replaceUsernames: true,
		replaceHostnames: true,
		replaceDomainsAndIps: true,
		findReplace: observable.array<FindReplaceInput>([{ find: '', replace: '' }]),
		isLoading: false,
		error: undefined as undefined | string,
		setAllOptions(setting) {
			this.removePasswordsHashes = setting;
			this.removeHidden = setting;
			this.removeKeystrokes = setting;
			this.removeScreenshots = setting;
			this.replaceHostnames = setting;
			this.replaceUsernames = setting;
			this.replaceDomainsAndIps = setting;
		},
		setRedTeam() {
			this.setAllOptions(false);
		},
		setBlueTeam() {
			this.setAllOptions(true);
		},
		*downloadCampaign() {
			this.isLoading = true;
			this.error = undefined;
			try {
				const fileName: Awaited<ReturnType<typeof store.graphqlStore.mutateAnonymizeCampaign>> =
					yield store.graphqlStore.mutateAnonymizeCampaign({
						campaignId: campaign.id,
						anonymizeOptions: {
							removeHidden: this.removeHidden,
							removePasswordsHashes: this.removePasswordsHashes,
							removeKeystrokes: this.removeKeystrokes,
							removeScreenshots: this.removeScreenshots,
							replaceUsernames: this.replaceUsernames,
							replaceHostnames: this.replaceHostnames,
							replaceDomainsAndIps: this.replaceDomainsAndIps,
							findReplace: this.findReplace.filter(
								(findReplace) => !!findReplace.find?.length && !!findReplace.replace?.length
							),
						},
					});
				const res: Response = yield store.auth.protectedFetch(
					`${store.auth.serverUrl}/api/campaign/download/${fileName.anonymizeCampaign}`,
					{
						mode: 'cors',
						cache: 'no-cache',
						credentials: 'include',
						method: 'GET',
					}
				);
				if (res.status === 200) {
					try {
						const blob: Blob = yield res.blob();
						const file = window.URL.createObjectURL(blob);
						const link = document.createElement('a');
						link.setAttribute('href', file);
						link.setAttribute('download', `${campaign.name}.redeye`);
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
					} catch (e) {
						window.console.debug(e);
					}
				} else if (res.status === 404) {
					this.error = 'Campaign not found';
				} else {
					this.error = 'Error anonymizing campaign';
				}
			} catch (e) {
				if (e instanceof Error) this.error = e.message;
			}
			this.isLoading = false;
		},
	});

	return (
		<Dialog {...props} onClose={onClose} isCloseButtonShown={false} cy-test="anonymizeDialog-root" css={dialogStyle}>
			<div className={Classes.DIALOG_HEADER} css={dialogHeaderGroupStyle}>
				<div css={dialogHeaderStyle}>
					<H2>Export campaign</H2>
					<Button cy-test="cancel-export" minimal text="Cancel" onClick={onClose} rightIcon={<Close />} />
				</div>
				<p>Export Presets</p>
				<div>
					<PresetButton onClick={state.setRedTeam} title="Red Team" subText="Keep All Data" cy-test="red-team-export" />
					<PresetButton
						onClick={state.setBlueTeam}
						title="Blue Team"
						subText="Sanitize Passwords"
						cy-test="blue-team-export"
					/>
				</div>
			</div>
			<div className={Classes.DIALOG_BODY} css={sectionStyle}>
				{Object.entries(anonymizeOptions).map(([title, options]) => (
					<OptionsSection title={title} key={title}>
						{options.map(({ variable, label }) => (
							<Checkbox
								cy-test="export-checkbox-option"
								key={variable}
								label={label}
								checked={state[variable]}
								onChange={(e: ChangeEvent<HTMLInputElement>) => state.update(variable, e.target.checked)}
							/>
						))}
					</OptionsSection>
				))}
				{state.findReplace?.map((findReplace: FindReplaceInput, i) => (
					<ControlGroup
						/* eslint-disable-next-line react/no-array-index-key */
						key={i}
						css={css`
							margin: 0.25rem 0;
						`}
						fill
					>
						<InputGroup
							cy-test="find"
							placeholder="Find"
							value={findReplace.find}
							onChange={(e) => (findReplace.find = e.target.value)}
							css={findReplaceInputStyle}
							large
							fill
						/>
						<InputGroup
							cy-test="replace"
							placeholder="Replace"
							value={findReplace.replace}
							onChange={(e) => (findReplace.replace = e.target.value)}
							css={findReplaceInputStyle}
							large
							fill
						/>
						<HoverButton
							cy-test="remove-find-replace"
							onClick={() => state.findReplace.remove(findReplace)}
							icon={<TrashCan />}
							disabled={state.findReplace.length <= 1}
							large
							hoverProps={state.findReplace.length <= 1 ? undefined : { intent: 'danger' }}
						/>
					</ControlGroup>
				))}
				<Button
					cy-test="add-find-replace"
					text="+ Add Find & Replace"
					intent={Intent.PRIMARY}
					minimal
					onClick={() => state.findReplace.push({ find: '', replace: '' })}
				/>
			</div>
			<div className={Classes.DIALOG_FOOTER} css={sectionStyle}>
				{!!state.error && <Callout css={errorCalloutStyle} intent={Intent.DANGER} children={state.error} />}
				<Button
					cy-test="export-database"
					css={buttonStyle}
					large
					intent={Intent.PRIMARY}
					onClick={state.downloadCampaign}
					loading={state.isLoading}
					disabled={state.isLoading}
					rightIcon={<Export />}
				>
					Export Database
				</Button>
				<Button cy-test="save-duplicate-to-server" large disabled>
					Save duplicate to server
				</Button>
			</div>
		</Dialog>
	);
});

const dialogStyle = css`
	--anonymize-dialog-y-margin: 64px;

	max-width: 95vw;
	min-width: 40vw;
	margin: var(--anonymize-dialog-y-margin) auto;
	height: calc(100vh - var(--anonymize-dialog-y-margin) * 2);
	border-bottom: 0 !important;
`;

const dialogHeaderGroupStyle = css`
	flex-direction: column;
	align-items: flex-start;
	padding: 16px 24px;
`;

const dialogHeaderStyle = css`
	width: 100%;
	display: flex;
	justify-content: space-between;
	padding-bottom: 1rem;
	align-items: flex-start;
`;

const buttonStyle = css`
	width: 184px;
	display: inline-flex;
	justify-content: space-between;
	margin-right: 1px;
`;

const sectionStyle = css`
	overflow-y: auto;
	padding: 16px 24px;
	margin: 0;
`;

const errorCalloutStyle = css`
	margin-bottom: 1rem;
`;

const findReplaceInputStyle = css`
	.${Classes.INPUT_ACTION} {
		display: flex;
		height: 100%;
		padding: 0 1rem;
		align-items: center;
	}
`;
