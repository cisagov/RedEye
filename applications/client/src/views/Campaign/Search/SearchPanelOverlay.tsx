import type { DialogProps } from '@blueprintjs/core';
import { DialogEx } from '@redeye/client/components';
import { observer } from 'mobx-react-lite';
import { SearchPanel } from './SearchPanel';

export const SearchPanelOverlay = observer<DialogProps>(({ ...props }) => (
	<DialogEx wide fixedHeight {...props}>
		<SearchPanel />
	</DialogEx>
));
