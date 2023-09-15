import type { OptionProps } from '@blueprintjs/core';
import { Divider, FormGroup, HTMLSelect } from '@blueprintjs/core';
import { css } from '@emotion/react';
import { DialogEx, ErrorFallback } from '@redeye/client/components';
import { RedEyeDbUploadForm } from '@redeye/client/views';
import { CoreTokens, ExternalLink, Header, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import type { ParserInfoModel } from '../../../store';
import { useStore } from '../../../store';
import { ParserUploadForm } from './ParserUploadForm';

type NewCampaignDialogProps = ComponentProps<'div'> & {
	open: boolean;
	onClose: (...args: any) => void;
};

export const NewCampaignDialog = observer<NewCampaignDialogProps>(({ ...props }) => {
	const store = useStore();
	const [currentUploadOptionValue, setCurrentUploadOptionValue] = useState('');

	const uploadOptions = useMemo(() => {
		const options: (OptionProps & {
			parserInfo?: ParserInfoModel;
		})[] = [
			{
				label: 'Select Source',
				value: '', // falsy
				disabled: true,
			},
		];

		options.push(
			...Array.from(store.graphqlStore.parserInfos.values())
				.sort((a) => (a.name.includes('Cobalt') ? -1 : 1))
				.map((parserInfo) => ({
					label: parserInfo?.uploadForm?.tabTitle,
					value: parserInfo.id,
					parserInfo,
				}))
		);

		options.push({
			label: '.redeye file',
			value: 'redeye-file',
		});

		return options;
	}, [store.graphqlStore.parserInfos.values()]);

	const selectedUploadOption = useMemo(
		() => uploadOptions.find((option) => option.value === currentUploadOptionValue),
		[uploadOptions, currentUploadOptionValue]
	);

	return (
		<DialogEx
			wide
			isOpen={props.open}
			onClose={props.onClose}
			canOutsideClickClose={false}
			css={{ padding: 0, minHeight: 300 }}
		>
			<ErrorBoundary FallbackComponent={ErrorFallback}>
				<div>
					<Header large css={{ margin: '2rem 1.5rem 1rem' }}>
						Add a Campaign
					</Header>
					<FormGroup css={{ padding: '1rem 1.5rem 1.5rem 1.5rem', margin: 0 }} label="Source">
						<HTMLSelect
							cy-test="create-new-camp" // <- was {`create-new-camp-${parserInfo.id}`}
							value={currentUploadOptionValue}
							css={!currentUploadOptionValue && htmlSelectPlaceholderStyle}
							options={uploadOptions}
							onChange={(e) => setCurrentUploadOptionValue(e.target.value)}
							fill
							large
						/>
					</FormGroup>
					<Divider css={{ margin: '0 1.5rem' }} />
					{!selectedUploadOption?.value ? (
						<div css={{ padding: '1.5rem' }}>
							<Txt italic muted>
								Select an import source to continue
							</Txt>
						</div>
					) : !selectedUploadOption?.parserInfo?.uploadForm?.enabledInBlueTeam && store.appMeta.blueTeam ? (
						<div css={{ padding: '1.5rem' }}>
							<Txt cy-test="bt-warning" running>
								This upload source is not available in BlueTeam mode.
								<br />
								<ExternalLink href="https://github.com/cisagov/redeye#red-team--blue-team-modes">
									Learn more
								</ExternalLink>
							</Txt>
						</div>
					) : selectedUploadOption?.parserInfo != null ? (
						<ParserUploadForm parserInfo={selectedUploadOption?.parserInfo} onClose={props.onClose} />
					) : (
						<RedEyeDbUploadForm onClose={props.onClose} />
					)}
				</div>
			</ErrorBoundary>
		</DialogEx>
	);
});

const htmlSelectPlaceholderStyle = css`
	select {
		color: ${CoreTokens.TextDisabled};
	}
`;
