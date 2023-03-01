import type { OverlayProps } from '@blueprintjs/core';
import { Overlay, Spinner } from '@blueprintjs/core';
import { css } from '@emotion/react';
import { CampaignLoadingMessage, useStore } from '@redeye/client/store';
import { routes } from '@redeye/client/store/routing/router';
import { Flex, Header, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import { ErrorFallback } from '../../../components';
import { Views } from '../../../types';

type LoadingOverlayProps = Omit<OverlayProps, 'isOpen'> & {};

export const LoadingOverlay = observer<LoadingOverlayProps>(({ ...props }) => {
	const store = useStore();
	return (
		<Overlay
			css={css`
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100vh;
				flex-direction: column;
			`}
			isOpen={
				(!!store.campaign?.isLoading && store.campaign?.isLoading !== CampaignLoadingMessage.DONE) || !!store.campaign.error
			}
			canOutsideClickClose={!!store.campaign.error}
			autoFocus={false}
			onClose={() => store.router.updateRoute({ path: routes[Views.CAMPAIGNS_LIST], params: { id: store.campaign.id } })}
			{...props}
		>
			<Flex
				column
				justify='center'
				align='center'
			>
				<Flex>
					{store.campaign?.isLoading && store.campaign?.isLoading !== CampaignLoadingMessage.DONE ? (
						<Spinner intent="primary" />
					) : (
						<ErrorFallback error={new Error(`Error ${store.campaign?.error}`)} resetErrorBoundary={() => {}} />
					)}
				</Flex>
				<Flex>
					<Header medium>
						<Txt muted>{store.campaign?.isLoading !== CampaignLoadingMessage.DONE && store.campaign?.isLoading}</Txt>
					</Header>
				</Flex>
			</Flex>
		</Overlay>
	);
});
