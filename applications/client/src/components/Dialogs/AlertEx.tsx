import { Alert, Classes } from '@blueprintjs/core';
import styled from '@emotion/styled';
import { AdvancedTokens } from '@redeye/ui-styles';

export const AlertEx = styled(Alert)`
	padding: 0;
	margin: 3rem;
	align-self: start;

	.${Classes.ALERT_BODY} {
		padding: 16px;
	}

	.${Classes.ALERT_FOOTER} {
		margin: 0;
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
		.${Classes.BUTTON_TEXT} {
			flex: 1 1 auto;
		}
	}
`;
