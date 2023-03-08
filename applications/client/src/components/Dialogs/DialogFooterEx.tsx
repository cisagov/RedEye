import { Classes, DialogFooter } from '@blueprintjs/core';
import styled from '@emotion/styled';
import { AdvancedTokens } from '@redeye/ui-styles';

export const DialogFooterEx = styled(DialogFooter)`
	margin: 0;
	padding: 0;
	gap: 0px; // 1px;
	border: none;

	.${Classes.DIALOG_FOOTER_MAIN_SECTION} {
		flex: 0 0 auto;
	}
	.${Classes.DIALOG_FOOTER_ACTIONS} {
		flex: 1 0 auto;
		gap: 1px;
	}

	.${Classes.BUTTON} {
		margin: 0;

        // fill
		flex: 1 1;

        // large
        height: ${AdvancedTokens.PtButtonHeightLarge};
        padding: 4px 16px;

        // alignText='left'
        text-align: left;
        .${Classes.BUTTON_TEXT}{
            flex: 1 1 auto;
        }
	}
`;
