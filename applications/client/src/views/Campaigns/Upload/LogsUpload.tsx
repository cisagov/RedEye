import {
	Button,
	Callout,
	Classes,
	Collapse,
	ControlGroup,
	DialogBody,
	Divider,
	FileInput,
	FormGroup,
	InputGroup,
	Intent,
	Position,
	Radio,
	RadioGroup,
} from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import {
	ChevronDown16,
	ChevronRight16,
	Download16,
	Folder16,
	FolderOff16,
	TrashCan16,
	Warning20,
} from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon, HoverButton, ScrollBox, ScrollChild } from '@redeye/client/components';
import { CarbonDialogFooter } from '@redeye/client/components/Dialogs/CarbonDialogFooter';
import { createState } from '@redeye/client/components/mobx-create-state';
import type { Servers } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import type { DirectoryFile, DirectoryInput } from '@redeye/client/types/directory';
import { DirectorWorkerType } from '@redeye/client/types/directory';
import { Txt } from '@redeye/ui-styles';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import type { ChangeEvent, ComponentProps, FormEvent } from 'react';
// eslint-disable-next-line import/extensions
import workerString from './file-worker-js.js?raw';
import FileWorker from './file-worker?worker';

const workerBlob = new Blob([workerString], { type: 'text/javascript' });
const workerURL = URL.createObjectURL(workerBlob);

type LogsUploadProps = ComponentProps<'form'> & {
	onClose: (...args: any) => void;
};

type MessageEvents =
	| { type: DirectorWorkerType.FILES; validFiles: DirectoryFile[]; invalidFiles: DirectoryFile[] }
	| { type: DirectorWorkerType.SERVER_FILES; serverFiles: DirectoryFile[]; serverName: string }
	| { type: DirectorWorkerType.FINISHED };

const defaultServer: Servers = {
	name: '',
	fileCount: 0,
	fileData: undefined,
	completed: 0,
	totalTasks: 0,
	isParsingFiles: false,
};

export const LogsUpload = observer<LogsUploadProps>(({ ...props }) => {
	const store = useStore();
	const state = createState({
		campaignName: '' as string,
		campaignId: undefined as undefined | number,
		servers: observable.array<Servers>(),
		nameTaken: false as boolean,
		originalFiles: observable.array<File>(),
		files: observable.array<DirectoryFile>(),
		invalidFiles: observable.array<DirectoryFile>(),
		uploadError: undefined as undefined | string,
		multiServerUpload: true,
		loading: false,
		uploading: false,
		showExample: false,
		setCampaignName(e) {
			this.nameTaken = Array.from(store.graphqlStore.campaigns.values()).some(
				(d) => d?.name.toLowerCase() === e.target.value.trim().toLowerCase()
			);
			this.campaignName = e.target.value;
		},
		createServers(files: DirectoryFile[], serverName: string) {
			const server = { ...defaultServer, name: serverName };
			const data = new FormData();
			files.forEach((file: DirectoryFile) => {
				const f: File = new File([file.blob], file.webkitRelativePath.replace(/\//g, ':').split(':').slice(1).join(':'), {
					type: file.type,
				});
				data.append('file', f);
			});
			server.fileCount = files.length;
			server.fileData = data;
			this.servers.push(server);
		},
		fileError(error: string) {
			this.uploadError = error;
			this.files.clear();
		},
		fileSelect() {
			this.files.clear();
			this.invalidFiles.clear();
			this.uploadError = undefined;
			if (this.originalFiles.length) {
				this.loading = true;
				const worker = navigator.userAgent.match(/firefox|fxios/i)
					? new Worker(workerURL, {
							type: 'classic',
					  })
					: new FileWorker();
				worker.postMessage({
					acceptedFiles: this.originalFiles.map((file) => ({
						...file,
						webkitRelativePath: file.webkitRelativePath,
						name: file.name,
						blob: file.slice(),
					})),
					multiServerUpload: this.multiServerUpload,
				});
				worker.onmessage = action((event: MessageEvent<MessageEvents>) => {
					switch (event.data.type) {
						case DirectorWorkerType.FILES:
							this.files.push(...event.data.validFiles);
							this.invalidFiles.push(...event.data.invalidFiles);
							break;
						case DirectorWorkerType.SERVER_FILES:
							this.createServers(event.data.serverFiles, event.data.serverName);
							break;
						case DirectorWorkerType.FINISHED:
							worker.terminate();
							this.loading = false;
							break;
						default:
							break;
					}
				});
				worker.onmessageerror = action((error) => {
					this.fileError(error.type);
					worker.terminate();
					this.loading = false;
				});
				worker.onerror = action((error) => {
					this.fileError(error.message.replace('Uncaught Error:', ''));
					worker.terminate();
					this.loading = false;
				});
			} else {
				return this.fileError('No Valid Files Found');
			}
		},
		*submitData(e: FormEvent<HTMLFormElement>) {
			e.preventDefault();
			this.uploading = true;
			const campaign: Awaited<ReturnType<typeof store.graphqlStore.mutateCreateCampaign>> =
				yield store.graphqlStore.mutateCreateCampaign({
					creatorName: store.auth.userName!,
					name: this.campaignName,
				});

			for (const server of this.servers) {
				server.fileData?.set('serverName', server.name);
				try {
					const res: Response = yield store.auth.protectedFetch(
						`${store.auth.serverUrl}/api/server/upload/${campaign.createCampaign.id}`,
						{
							mode: 'cors',
							cache: 'no-cache',
							credentials: 'include',
							method: 'POST',
							body: server.fileData,
						}
					);
					if (res.status !== 200) {
						window.console.error('Error Uploading Logs');
						// this should provide some UI feedback in the form as to the reason
					} else {
						server.isParsingFiles = true;
					}
				} catch (error) {
					window.console.warn('Error Uploading Logs', error);
				}
			}
			yield store.graphqlStore.mutateServersParse({ campaignId: campaign.createCampaign.id });
			campaign?.createCampaign?.processServers?.();
			this.uploading = false;
			props.onClose();
		},
		onMultiServerUploadChange(e: FormEvent<HTMLInputElement>) {
			this.multiServerUpload = e.currentTarget.value === UploadMode.Multi;
			this.servers.clear();
			this.fileSelect();
		},
		onFileInputChange(e: ChangeEvent<HTMLInputElement>) {
			this.originalFiles.replace(e.target.files ? Array.from(e.target.files) : []);
			this.servers.clear();
			this.fileSelect();
			this.showExample = false;
		},
	});

	// Typing for input element doesn't like the directory props
	const inputProps: DirectoryInput = {
		webkitdirectory: 'true',
		directory: 'true',
		mozdirectory: 'true',
		type: 'file',
	};

	return (
		<form onSubmit={state.submitData} {...props}>
			<DialogBody css={dialogBodyStyle}>
				<FormGroup label="Campaign Name">
					<InputGroup
						cy-test="new-camp-name"
						placeholder="..."
						intent={state.nameTaken ? Intent.DANGER : Intent.NONE}
						value={state.campaignName}
						onChange={state.setCampaignName}
						large
						autoFocus
					/>
				</FormGroup>

				<RadioGroup
					label="Upload Mode"
					selectedValue={state.multiServerUpload ? UploadMode.Multi : UploadMode.Single}
					onChange={state.onMultiServerUploadChange}
					inline
					css={css`
						display: flex;
						gap: 1.5rem;
						label,
						.${Classes.INLINE} {
							margin: 0;
						}
					`}
				>
					<Radio cy-test="multi-server-upload" label="Multi Server" value={UploadMode.Multi} />
					<Radio cy-test="single-server-upload" label="Single Server" value={UploadMode.Single} />
				</RadioGroup>

				<Divider />

				<FormGroup
					label={
						<Txt tagName="div" large>
							{state.multiServerUpload ? (
								<span>
									Select a single <Txt bold>Campaign Folder</Txt> that contains multiple CobaltStrike&nbsp;
									<Txt bold>Server Folders</Txt>.<br />
									Each <Txt bold>Server Folder</Txt>&nbsp;should contain beacon logs in dated (<Txt bold>YYMMDD</Txt>) folders.
								</span>
							) : (
								<span>
									Select a single CobaltStrike <Txt bold>Server Folder</Txt> containing beacon logs in dated (
									<Txt bold>YYMMDD</Txt>) folders.
								</span>
							)}
						</Txt>
					}
				>
					<FileInput
						cy-test="upload-folder"
						// not a huge fan of this blueprint file input
						// TODO: there is no focus state? fix in blueprint-styler
						aria-errormessage={state.uploadError}
						aria-invalid={!!state.uploadError}
						onInputChange={state.onFileInputChange}
						inputProps={inputProps as any}
						text={`${state.files.length} files selected`}
						large
						fill
					/>
					<Button
						minimal
						small
						intent={Intent.PRIMARY}
						text="Show an example"
						icon={<CarbonIcon icon={state.showExample ? ChevronDown16 : ChevronRight16} />}
						onClick={() => state.update('showExample', !state.showExample)}
						css={css`
							margin: 2px -0.5rem;
						`}
					/>
					<Collapse isOpen={state.showExample}>
						<Txt
							monospace
							muted
							tagName="pre"
							css={css`
								margin: 0 0.5rem;
							`}
							children={state.multiServerUpload ? MultiServerFilesExample : SingleServerFilesExample}
						/>
					</Collapse>
				</FormGroup>

				<FormGroup
					label={`Server Folder${state.multiServerUpload ? 's' : ''}`}
					helperText={state.servers.length > 0 && 'Folders can be renamed before upload'}
				>
					{state.servers.length === 0 && !state.uploadError && (
						<Txt disabled italic>
							No folders selected
						</Txt>
					)}
					{!!state.uploadError && (
						<Callout intent={Intent.DANGER} icon={<CarbonIcon icon={Warning20} />} children={state.uploadError} />
					)}
					{state.servers.map((server: Servers, i) => (
						<ControlGroup
							/* eslint-disable-next-line react/no-array-index-key */
							key={i}
							css={css`
								margin: 0.25rem 0;
							`}
							fill
						>
							<InputGroup
								placeholder="server.name"
								value={server.name}
								onChange={(e) => (server.name = e.target.value)}
								intent={state.servers.some((s, x) => x !== i && s.name === server.name) ? Intent.DANGER : Intent.NONE}
								leftIcon={<CarbonIcon icon={Folder16} />}
								rightElement={<Txt muted>{server.fileCount} log files</Txt>}
								css={css`
									.${Classes.INPUT_ACTION} {
										display: flex;
										height: 100%;
										padding: 0 1rem;
										align-items: center;
									}
								`}
								large
								fill
							/>
							<HoverButton
								onClick={() => state.servers.remove(server)}
								icon={<CarbonIcon icon={TrashCan16} />}
								disabled={state.servers.length <= 1}
								large
								hoverProps={state.servers.length <= 1 ? undefined : { intent: 'danger' }}
							/>
						</ControlGroup>
					))}
					{!!state.invalidFiles.length && (
						<Popover2
							position={Position.TOP_LEFT}
							openOnTargetFocus={false}
							interactionKind="hover"
							hoverOpenDelay={300}
							minimal
							fill
							content={
								<ScrollBox
									css={css`
										max-height: 40rem;
										max-width: 40rem;
									`}
								>
									<ScrollChild>
										<Txt
											tagName="pre"
											css={css`
												padding: 1rem;
												overflow-x: scroll;
												margin: 0;
											`}
										>
											{state.invalidFiles.map((file) => (
												<span key={file.webkitRelativePath}>
													{file.webkitRelativePath}
													{'\n'}
												</span>
											))}
										</Txt>
									</ScrollChild>
								</ScrollBox>
							}
						>
							<Callout
								intent={Intent.WARNING}
								icon={<CarbonIcon icon={FolderOff16} />}
								children={`${state.invalidFiles.length} File${state.invalidFiles.length > 1 ? 's' : ''} Removed`}
							/>
						</Popover2>
					)}
				</FormGroup>
			</DialogBody>
			
			<CarbonDialogFooter
				actions={
					<>
						<Button text="Cancel" onClick={props.onClose} />
						<Button
							loading={state.loading || state.uploading}
							type="submit"
							disabled={state.uploading || !state.servers.length || !state.campaignName || state.nameTaken}
							text="Import Logs"
							intent={Intent.PRIMARY}
							rightIcon={<CarbonIcon icon={Download16} />}
							large
						/>
					</>
				}
			/>
		</form>
	);
});

const dialogBodyStyle = css`
	padding: 1.5rem;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	& > * {
		margin: 0;
	}
`;

enum UploadMode {
	Multi = 'multi',
	Single = 'single',
}

const MultiServerFilesExample = `Campaign_Folder
- Server_Folder_1
  - 200101
  - 200102
  - 200103
  - ...
- Server_Folder_2
  - 200105
  - 200121
  - 200131
  - ...`;

const SingleServerFilesExample = `Server_Folder
- 200101
- 200102
- 200103
- ...`;
