import { useStore } from '@redeye/client/store';
import { TimeStatus } from '@redeye/client/types/timeline';
import type { TxtProps } from '@redeye/ui-styles';
import { Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';

export const RowTime = observer(({ state: timeStatus, ...props }: TxtProps & { state?: TimeStatus }) => {
	const store = useStore();

	const timeProps = store.campaign.timeline.isShowingAllTime
		? {}
		: timeStatus === TimeStatus.FUTURE
		? {
				disabled: true,
				italic: true,
		  }
		: timeStatus === TimeStatus.ALIVE
		? {
				bold: true,
		  }
		: timeStatus === TimeStatus.DEAD
		? {
				muted: true,
		  }
		: {};

	return <Txt monospace small css={{ marginRight: '1rem' }} {...timeProps} {...props} />;
});

export const RowTitle = (props: TxtProps) => <Txt bold {...props} />;

export const RowMuted = (props: TxtProps) => <Txt muted css={{ marginRight: '1rem' }} {...props} />;
