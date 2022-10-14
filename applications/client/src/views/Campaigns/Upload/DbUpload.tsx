import type { HTMLInputProps } from '@blueprintjs/core';
import { Button, FileInput, FormGroup, InputGroup, Intent } from '@blueprintjs/core';
import { Download16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import { useStore } from '@redeye/client/store';
import type { DirectoryFile, DirectoryFileList } from '@redeye/client/types/directory';
import { Header, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ChangeEvent, ComponentProps, FormEvent } from 'react';

type DbUploadProps = ComponentProps<'form'> & {
	onClose: (...args: any) => void;
};

export const DbUpload = observer<DbUploadProps>(({ ...props }) => {
	const store = useStore();

	const state = createState({
		campaignName: '' as string,
		nameTaken: false as boolean,
		fileData: undefined as FormData | undefined,
		fileName: '' as string,
		setCampaignName(e) {
			this.nameTaken = Array.from(store.graphqlStore.campaigns.values()).some(
				(d) => d?.name.toLowerCase() === e.target.value.trim().toLowerCase()
			);
			this.campaignName = e.target.value;
		},
		*submitData(e: FormEvent<HTMLFormElement>) {
			e.preventDefault();
			this.fileData?.set('name', this.campaignName);
			try {
				const res: Response = yield store.auth.protectedFetch(`${store.auth.serverUrl}/api/campaign/upload`, {
					mode: 'cors',
					cache: 'no-cache',
					credentials: 'include',
					method: 'POST',
					body: this.fileData,
				});
				if (res.status !== 200) {
					window.console.error('Error Uploading Logs');
				} else {
					store.graphqlStore?.queryCampaigns();
					props.onClose();
				}
			} catch (error) {
				window.console.log('Error Uploading Logs');
			}
		},
		onFileUpload(e: ChangeEvent<HTMLInputElement>) {
			const acceptedFiles: DirectoryFileList | null = e.target.files as DirectoryFileList;
			if (acceptedFiles) {
				const data = new FormData();
				Object.values(acceptedFiles).forEach((file: DirectoryFile) => {
					const f: File = new File([file.slice()], file.webkitRelativePath.replace(/\//g, ':'), {
						type: file.type,
					});
					data.append('file', f);
					this.fileName = file.name; // there can only be one file, right?
				});
				this.fileData = data;
			}
		},
	});

	const inputProps: HTMLInputProps = {
		type: 'file',
		onChange: state.onFileUpload,
		accept: '.sqlite,.redeye',
	};

	return (
		<form
			onSubmit={state.submitData}
			css={css`
				padding: 1.5rem;
				padding-bottom: 0;
				& > * {
					margin: 0 0 1.5rem 0;
				}
			`}
			{...props}
		>
			<FormGroup label="Campaign Name">
				<InputGroup
					cy-test="new-camp-name"
					intent={state.nameTaken ? Intent.DANGER : Intent.NONE}
					placeholder="..."
					value={state.campaignName}
					onChange={state.setCampaignName}
					large
				/>
			</FormGroup>
			{store.appMeta.blueTeam && (
				<div
					css={css`
						margin-bottom: 2rem;
					`}
				>
					<Header
						small
						css={css`
							margin-bottom: 0.5rem;
						`}
					>
						Auto Upload from &quot;campaigns&quot; folder
					</Header>
					<Txt
						tagName="p"
						css={css`
							margin-bottom: 0.5rem;
						`}
					>
						RedEye will automatically upload all database files (.sqlite or .redeye) from the &quot;campaigns&quot; folder
						placed next to the app in your filesystem:
					</Txt>
					<Txt tagName="pre" muted>
						{folderStructure}
					</Txt>
					<Txt tagName="p">You may also manually select and upload database files by using the input below. </Txt>
				</div>
			)}
			<FormGroup
				label="Select RedEye Database File"
				helperText="(.sqlite or .redeye)"
				css={css`
					margin-bottom: 2rem;
				`}
			>
				<FileInput
					// not a huge fan of this blueprint file input
					cy-test="browse-for-file"
					inputProps={inputProps}
					text={state.fileData ? state.fileName : 'No file selected'}
					large
				/>
			</FormGroup>
			<Button
				cy-test="import-database"
				type="submit"
				disabled={!state.fileData || !state.campaignName || state.nameTaken}
				text="Import Database"
				intent="primary"
				rightIcon={<CarbonIcon icon={Download16} />}
				large
			/>
		</form>
	);
});

const osAppFileType = 'app'; // | 'exe' | 'whatever linux has'
// hopefully lint or prettier doesn't decide to destroy this multi-line string
const folderStructure = `Parent-Folder
|-- RedEye.${osAppFileType}
|-- Campaigns
    |-- Campaign-One.redeye
    |-- Another-Campaign.redeye`;
