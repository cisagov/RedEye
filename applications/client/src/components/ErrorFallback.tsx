import { Button, NonIdealState } from '@blueprintjs/core';
import { Warning16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon } from '@redeye/client/components';
import { CoreTokens } from '@redeye/ui-styles';
import { useCallback } from 'react';
import type { FallbackProps } from 'react-error-boundary';

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
	const updateClipboard = useCallback(() => {
		window.navigator.clipboard
			.writeText(JSON.stringify({ error: error.name, message: error.message, stack: error.stack }))
			.then(
				() => {
					/* clipboard successfully set */
				},
				() => {
					/* clipboard write failed */
				}
			);
	}, []);
	return (
		<NonIdealState
			icon={
				<CarbonIcon
					icon={Warning16}
					css={css`
						color: ${CoreTokens.TextIntentDanger};

						& svg {
							height: 2rem;
							width: 2rem;
						}
					`}
				/>
			}
			title="An Error Occurred"
			description={error.message}
			action={
				<>
					<Button onClick={updateClipboard}>Copy error to clipboard</Button>
					<Button onClick={resetErrorBoundary}>Try again</Button>
				</>
			}
		/>
	);
};
