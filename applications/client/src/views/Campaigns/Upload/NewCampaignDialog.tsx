import { Tab } from '@blueprintjs/core';
import { css } from '@emotion/react';
import { DialogCustom, ErrorFallback } from '@redeye/client/components';
import { DbUpload } from '@redeye/client/views';
import { Header, TabsStyled, UtilityStyles } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useStore } from '../../../store';
import { LogsUpload } from './LogsUpload';

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
		<DialogCustom
			isOpen={props.open}
			onClose={props.onClose}
			canOutsideClickClose={false}
			css={css`
				padding: 0;
			`}
		>
			<ErrorBoundary FallbackComponent={ErrorFallback}>
				<div>
					<Header
						large
						css={css`
							margin: 2rem 1.5rem 1rem;
						`}
					>
						Add a Campaign
					</Header>
					<TabsStyled
						selectedTabId={currentTab}
						onChange={(newTab) => setCurrentTab(newTab as CampaignTabs)}
						id="add-campaign-methods"
					>
						{!store.appMeta.blueTeam && (
							<Tab
								cy-test="create-new-camp"
								id={CampaignTabs.NEW}
								title="Create New"
								panel={<LogsUpload onClose={props.onClose} css={shadowStyle} />}
							/>
						)}
						<Tab
							cy-test="upload-from-file"
							id={CampaignTabs.UPLOAD}
							title="Upload from file"
							panel={<DbUpload onClose={props.onClose} css={shadowStyle} />}
						/>
					</TabsStyled>
				</div>
			</ErrorBoundary>
		</DialogCustom>
	);
});

const shadowStyle = css`
	${UtilityStyles.innerBoxShadowOverlay('top', 3, false)}
`;
