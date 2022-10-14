import type { DialogProps } from '@blueprintjs/core';
import { Button, Dialog } from '@blueprintjs/core';
import { Close16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon } from '@redeye/client/components';
import { observer } from 'mobx-react-lite';
import { SearchModal } from './SearchModal';

export const SearchPanelOverlay = observer<DialogProps>(({ ...props }) => (
	<Dialog css={dialogWrapperStyles} {...props}>
		<SearchModal />
		<Button
			cy-test="close-search"
			minimal
			onClick={props.onClose}
			css={css`
				position: absolute;
				top: 0;
				right: 0;
				margin: 0.25rem;
			`}
			icon={<CarbonIcon icon={Close16} />}
		/>
	</Dialog>
));

const dialogWrapperStyles = css`
	position: relative;
	width: 100%;
	max-width: 700px;
	height: calc(100vh - 4rem);
	margin: 2rem;
	padding: 0;
`;
