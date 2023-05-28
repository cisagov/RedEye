import { Tab } from '@blueprintjs/core';
import { css } from '@emotion/react';
import { DialogEx, ErrorFallback } from '@redeye/client/components';
import { RedEyeDbUploadForm } from '@redeye/client/views';
import { ExternalLink, Header, TabsStyled, Txt, UtilityStyles } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useStore } from '../../../store';
import { ParserUploadForm } from './ParserUploadForm';

enum CampaignTabs {
	NEW,
	UPLOAD = 9999,
}

type NewCampaignDialogProps = ComponentProps<'div'> & {
	open: boolean;
	onClose: (...args: any) => void;
};

export const NewCampaignDialog = observer<NewCampaignDialogProps>(({ ...props }) => {
	const store = useStore();
	const [currentTab, setCurrentTab] = useState(store.appMeta.blueTeam ? CampaignTabs.UPLOAD : (0 as CampaignTabs));

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
					<TabsStyled
						selectedTabId={currentTab}
						onChange={(newTab) => setCurrentTab(newTab as CampaignTabs)}
						id="add-campaign-methods"
					>
						{Array.from(store.graphqlStore.parserInfos.values(), (parserInfo, index) => (
							<Tab
								cy-test="create-new-camp"
								id={index}
								title={parserInfo?.uploadForm?.tabTitle}
								panel={
									!parserInfo?.uploadForm?.enabledInBlueTeam && store.appMeta.blueTeam ? (
										<BlueTeamSourceWarning css={shadowStyle} />
									) : (
										<ParserUploadForm parserInfo={parserInfo} onClose={props.onClose} css={shadowStyle} />
									)
								}
							/>
						))}
						<Tab
							cy-test="upload-from-file"
							id={CampaignTabs.UPLOAD}
							title="Upload .redeye file"
							panel={<RedEyeDbUploadForm onClose={props.onClose} css={shadowStyle} />}
						/>
					</TabsStyled>
				</div>
			</ErrorBoundary>
		</DialogEx>
	);
});

const shadowStyle = css`
	${UtilityStyles.innerBoxShadowOverlay('top', 3, false)}
`;

const BlueTeamSourceWarning = (props) => (
	<div css={{ padding: 24 }} {...props}>
		<Txt cy-test="bt-warning" running>
			This upload source is not available in BlueTeam mode.
			<br />
			<ExternalLink href="https://github.com/cisagov/redeye#red-team--blue-team-modes">Learn more</ExternalLink>
		</Txt>
	</div>
);
