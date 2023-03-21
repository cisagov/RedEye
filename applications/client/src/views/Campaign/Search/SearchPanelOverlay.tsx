import type { DialogExProps } from '@redeye/client/components';
import { DialogEx } from '@redeye/client/components';
import { observer } from 'mobx-react-lite';
import { SearchPanel } from './SearchPanel';

export const SearchPanelOverlay = observer<DialogExProps>(({ ...props }) => (
	<DialogEx wide fixedHeight {...props}>
		<SearchPanel />
	</DialogEx>
));
