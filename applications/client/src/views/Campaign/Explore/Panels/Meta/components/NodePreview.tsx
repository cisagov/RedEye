import styled from '@emotion/styled';
import type { NodeIconProps } from '@redeye/client/views/Campaign/Graph';
import { NodeIcon, nodeColor } from '@redeye/client/views/Campaign/Graph';
import type { FlexProps } from '@redeye/ui-styles';
import { CoreTokens, Txt, Flex } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';

type NodePreviewProps = FlexProps &
	NodeIconProps & {
		text?: 'shape' | 'color';
	};

export const NodePreview = observer<NodePreviewProps>(({ type, shape, text, color = 'default', size: _, ...props }) => (
	<Flex align="center" gap="0.5ch" css={{ color: nodeColor[color].fgToken }} {...props}>
		<NodeIcon {...{ type, shape, color }} />
		{text && <Txt>– {text === 'color' ? color : shape}</Txt>}
	</Flex>
));

export const NodePreviewBox = styled(NodePreview)`
	height: 30px;
	width: 30px;
	border: 1px solid ${CoreTokens.TextDisabled};
	flex: 0 0 auto;
	justify-content: center;
`;
