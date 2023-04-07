import { NodeIcon } from '@redeye/client/components';
import type { NodeColor } from '@redeye/client/views/Campaign/Graph';
import { nodeColor } from '@redeye/client/views/Campaign/Graph';
import type { NodeShape } from '@redeye/graph';
import type { FlexProps } from '@redeye/ui-styles';
import { Txt, Flex } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';

type NodePreviewProps = FlexProps & {
	shape: NodeShape;
	color: NodeColor;
	text?: 'shape' | 'color';
};

export const NodePreview = observer<NodePreviewProps>(({ shape, text, color, ...props }) => (
	<Flex align="center" gap="0.5ch" css={{ color: nodeColor[color].token }} {...props}>
		<NodeIcon shape={shape} />
		{text && <Txt>– {text === 'color' ? color : shape}</Txt>}
	</Flex>
));
