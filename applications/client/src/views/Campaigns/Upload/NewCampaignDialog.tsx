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
import { CobaltStrikeUploadForm } from './CobaltStrikeUploadForm';

enum CampaignTabs {
	NEW,
	UPLOAD,
}

type NewCampaignDialogProps = ComponentProps<'div'> & {
	open: boolean;
	onClose: (...args: any) => void;
};

export const NewCampaignDialog = observer<NewCampaignDialogProps>(({ ...props }) => {
	const store = useStore();
	const [currentTab, setCurrentTab] = useState(
		store.appMeta.blueTeam ? CampaignTabs.UPLOAD : (CampaignTabs.NEW as CampaignTabs)
	);

	return (
		<DialogEx
			wide
			fixedHeight
			isOpen={props.open}
			onClose={props.onClose}
			canOutsideClickClose={false}
			css={{ padding: 0 }}
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
						<Tab
							cy-test="create-new-camp"
							id={CampaignTabs.NEW}
							title="Upload Cobalt Strike Logs"
							panel={
								store.appMeta.blueTeam ? (
									<BlueTeamSourceWarning css={shadowStyle} />
								) : (
									<CobaltStrikeUploadForm onClose={props.onClose} css={shadowStyle} />
								)
							}
						/>
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
		<Txt running>
			This upload source is not available in BlueTeam mode.
			<br />
			<ExternalLink href="https://github.com/cisagov/redeye#readme">Learn more</ExternalLink>
		</Txt>
	</div>
);
