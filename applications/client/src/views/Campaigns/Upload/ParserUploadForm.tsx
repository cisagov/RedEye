import {
	Button,
	Callout,
	Classes,
	Collapse,
	ControlGroup,
	Divider,
	FileInput,
	FormGroup,
	InputGroup,
	Intent,
	Position,
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
import {
	CarbonIcon,
	DialogBodyEx,
	DialogFooterEx,
	HoverButton,
	ScrollBox,
	ScrollChild,
} from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import type { Servers } from '@redeye/client/store';
import { ParserInfoModel, ServerDelineationTypes, UploadType, useStore, ValidationMode } from '@redeye/client/store';
import type { DirectoryFile, DirectoryInput } from '@redeye/client/types/directory';
import { Txt } from '@redeye/ui-styles';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import type { ChangeEvent, ComponentProps, FormEvent } from 'react';

type ParserUploadFormProps = ComponentProps<'form'> & {
	onClose: (...args: any) => void;
	parserInfo: ParserInfoModel;
};

const createDirectoryFile = (file: File): DirectoryFile => ({
	...file,
	webkitRelativePath: file.webkitRelativePath,
	name: file.name,
	blob: file.slice(),
});

const defaultServer: Servers = {
	name: '',
	displayName: '',
	fileCount: 0,
	fileData: undefined,
	completed: 0,
	totalTasks: 0,
	isParsingFiles: false,
};

// Typing for input element doesn't like the directory props
const inputProps: DirectoryInput = {
	webkitdirectory: 'true',
	directory: 'true',
	mozdirectory: 'true',
	type: 'file',
};

export const ParserUploadForm = observer<ParserUploadFormProps>(({ parserInfo, ...props }) => {
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
		multiServerUpload: undefined as undefined | boolean,
		loading: false,
		uploading: false,
		showExample: false,
		setCampaignName(e) {
			this.nameTaken = Array.from(store.graphqlStore.campaigns.values()).some(
				(d) => d?.name.toLowerCase() === e.target.value.trim().toLowerCase()
			);
			this.campaignName = e.target.value;
		},
		createServers(serverName: string, fileCount: number) {
			const server = { ...defaultServer, displayName: serverName, name: serverName, fileCount };
			this.servers.push(server);
		},
		fileError(error: string) {
			this.uploadError = error;
			this.files.clear();
		},
		*fileSelect() {
			this.files.clear();
			this.invalidFiles.clear();
			this.uploadError = undefined;
			if (this.originalFiles.length) {
				this.loading = true;
				if (parserInfo.uploadForm.fileUpload.validate === ValidationMode.None) {
					for (const file of this.originalFiles) this.files.push(createDirectoryFile(file));
					this.loading = false;
				} else if (parserInfo.uploadForm.fileUpload.validate === ValidationMode.FileExtensions) {
					const fileExtension = new Set(parserInfo.uploadForm.fileUpload.acceptedExtensions!);
					for (const file of this.originalFiles) {
						// eslint-disable-next-line no-bitwise
						if (fileExtension.has(file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2))) {
							this.files.push(createDirectoryFile(file));
						} else {
							this.invalidFiles.push(createDirectoryFile(file));
						}
					}
					this.loading = false;
				} else if (parserInfo.uploadForm.fileUpload.validate === ValidationMode.Parser) {
					try {
						const fileValidationFormData = new FormData();
						const allFiles = {};
						for (const file of this.originalFiles) {
							allFiles[file.name] = createDirectoryFile(file);
							fileValidationFormData.append(
								'file',
								new File([file.slice()], file.webkitRelativePath.replace(/\//g, ':'), {
									type: file.type,
								})
							);
						}
						const res: Response = yield store.auth.protectedFetch(
							`${store.auth.serverUrl}/api/parser/${parserInfo.id}/validate-files`,
							{
								mode: 'cors',
								cache: 'no-cache',
								credentials: 'include',
								method: 'POST',
								body: fileValidationFormData,
							}
						);
						if (res.status !== 200) {
							window.console.error('Error Uploading Logs');
							// this should provide some UI feedback in the form as to the reason
						} else {
							const {
								valid,
								invalid,
								servers,
							}: { servers: { fileCount?: number; name: string }[]; valid: string[]; invalid: string[] } =
								yield res.json();
							servers.forEach((server) => {
								this.createServers(server.name, server.fileCount || 0);
							});
							invalid.forEach((invalidFilename) => {
								if (allFiles[invalidFilename]) this.invalidFiles.push(allFiles[invalidFilename]);
							});
							valid.forEach((validFilename) => {
								if (allFiles[validFilename]) this.files.push(allFiles[validFilename]);
							});
						}
						this.loading = false;
					} catch (error) {
						window.console.warn('Error Uploading Logs', error);
					}
				} else {
					// return this.fileError('No Valid Files Found'); // not sure this is an error?
				}
			}
		},
		*submitData(e: FormEvent<HTMLFormElement>) {
			e.preventDefault();
			this.uploading = true;
			const campaign: Awaited<ReturnType<typeof store.graphqlStore.mutateCreateCampaign>> =
				yield store.graphqlStore.mutateCreateCampaign({
					creatorName: store.auth.userName!,
					name: this.campaignName,
					parser: parserInfo.id,
				});
			const campaignBody = new FormData();

			for (const file of this.files) {
				campaignBody.append(
					'file',
					new File([file.blob], file.webkitRelativePath.replace(/\//g, ':'), {
						type: file.type,
					})
				);
			}
			campaignBody.append('servers', JSON.stringify(this.servers));
			try {
				const res: Response = yield store.auth.protectedFetch(
					`${store.auth.serverUrl}/api/campaign/${campaign.createCampaign.id}/upload`,
					{
						mode: 'cors',
						cache: 'no-cache',
						credentials: 'include',
						method: 'POST',
						body: campaignBody,
					}
				);
				if (res.status !== 200) {
					window.console.error('Error Uploading Logs');
					// this should provide some UI feedback in the form as to the reason
				} else {
					// server.isParsingFiles = true;
				}
			} catch (error) {
				window.console.warn('Error Uploading Logs', error);
			}

			yield store.graphqlStore.mutateServersParse({ campaignId: campaign.createCampaign.id });
			campaign?.createCampaign?.processServers?.();
			this.uploading = false;
			props.onClose();
		},
		onFileInputChange(e: ChangeEvent<HTMLInputElement>) {
			this.originalFiles.replace(e.target.files ? Array.from(e.target.files) : []);
			this.servers.clear();
			this.fileSelect();
			this.showExample = false;
		},
	});

	return (
		<form onSubmit={state.submitData} {...props}>
			<DialogBodyEx css={dialogBodyStyle}>
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

				<Divider />

				<>
					<FormGroup
						label={
							<Txt tagName="div" large>
								<span dangerouslySetInnerHTML={{ __html: parserInfo.uploadForm.fileUpload.description }} />
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
							inputProps={
								parserInfo.uploadForm.fileUpload.type === UploadType.Directory ? (inputProps as any) : undefined
							}
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

					<FormGroup label={`Servers`} helperText={state.servers.length > 0 && 'Servers can be renamed before upload'}>
						{state.servers.length === 0 && !state.uploadError && (
							<Txt disabled italic>
								No servers selected
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
									value={server.displayName}
									onChange={(e) => (server.displayName = e.target.value)}
									intent={
										state.servers.some((s, x) => x !== i && s.name === server.displayName) ? Intent.DANGER : Intent.NONE
									}
									leftIcon={<CarbonIcon icon={Folder16} />}
									rightElement={
										parserInfo.serverDelineation === ServerDelineationTypes.Folder ? (
											<Txt muted>{server.fileCount} log files</Txt>
										) : undefined
									}
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
				</>
			</DialogBodyEx>

			<DialogFooterEx
				actions={
					<>
						<Button text="Cancel" onClick={props.onClose} />
						<Button
							loading={state.loading || state.uploading}
							type="submit"
							disabled={
								state.uploading ||
								(parserInfo.uploadForm.fileUpload.validate === ValidationMode.Parser && !state.servers.length) ||
								!state.campaignName ||
								state.nameTaken
							}
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
