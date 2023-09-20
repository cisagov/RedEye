import { useStore } from '@redeye/client/store';
import { TimeStatus } from '@redeye/client/types/timeline';
import type { FlexProps, TxtProps } from '@redeye/ui-styles';
import { CoreTokens, Flex, Txt } from '@redeye/ui-styles';
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

export const RowTitle = (props: FlexProps) => (
	<Flex align="center" gap={4} overflowHidden fill css={{ fontWeight: CoreTokens.FontWeightBold }} {...props} />
);
