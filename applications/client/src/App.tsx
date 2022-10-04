import { FocusStyleManager, Spinner } from '@blueprintjs/core';
import { css } from '@emotion/react';
import { RedEyeRoutes } from '@redeye/client/store';
import { observer } from 'mobx-react-lite';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

FocusStyleManager.onlyShowFocusOnTabs();
const Login = lazy(() => import('./views/Login'));
const Campaign = lazy(() => import('./views/Campaign/Campaign'));
const CampaignList = lazy(() => import('./views/Campaigns/Campaigns'));

export const App = observer(() => (
	<Suspense
		fallback={
			<Spinner
				css={css`
					position: absolute;
					top: 50%;
					left: 50%;
				`}
			/>
		}
	>
		<Routes>
			<Route path={RedEyeRoutes.LOGIN} element={<Login />} />
			<Route path={RedEyeRoutes.CAMPAIGNS_LIST} element={<CampaignList />} />
			<Route path={`${RedEyeRoutes.CAMPAIGN}/*`} element={<Campaign />} />
			<Route path="*" element={<Navigate to={RedEyeRoutes.LOGIN} />} />
		</Routes>
	</Suspense>
));
