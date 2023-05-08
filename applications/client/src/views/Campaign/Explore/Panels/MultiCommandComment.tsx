import { Button, Intent } from '@blueprintjs/core';
import { css } from '@emotion/react';
import { CarbonIcon, customIconPaths } from '@redeye/client/components';
import { store } from '@redeye/client/store';
import { CoreTokens, ThemeClasses, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type HostRowProps = ComponentProps<'div'> & {
	commandCount: number;
};

export const MultiCommandComment = observer<HostRowProps>(({ commandCount = 0 }) => (
	<div css={modeBarStyle}>
		<Txt>
			{commandCount} Command{commandCount === 1 ? '' : 's'} Selected
		</Txt>
		<Button
			cy-test="comment-on-commands"
			disabled={commandCount === 0}
			onClick={() => {
				const keys = Array.from(store.campaign?.commentStore.selectedCommands.keys());
				let foundElement = false;
				for (const key of keys) {
					const element = window.document.querySelector(`[data-command-id="${key}"]`);
					if (element) {
						foundElement = true;
						store.campaign?.commentStore.setCommentsOpen(key);
					}
				}
				if (!foundElement) {
					store.campaign?.commentStore.setCommentsOpen(keys[0]);
				}
				store.campaign?.commentStore.setNewGroupComment(true);
			}}
			rightIcon={<CarbonIcon icon={customIconPaths.multiComment16} />}
			intent={Intent.PRIMARY}
			text="Comment on commands"
			css={css`
				padding: 0 1rem;
			`}
		/>
	</div>
));

const modeBarStyle = css`
	display: flex;
	width: 100%;
	justify-content: space-between;
	align-items: center;
	padding-left: 1rem;

	color: ${CoreTokens.OnIntent};
	background: ${CoreTokens.Intent.Primary4};
	.${ThemeClasses.DARK} & {
		background: ${CoreTokens.Intent.Primary1};
	}
`;
