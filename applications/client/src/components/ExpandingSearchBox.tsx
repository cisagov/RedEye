import type { HTMLInputProps, InputGroupProps } from '@blueprintjs/core';
import { Button, Classes, InputGroup } from '@blueprintjs/core';
import { Close16, Search16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { CarbonIcon } from '@redeye/client/components';
import type { FC, MouseEvent } from 'react';

type ExpandingSearchBoxProps = InputGroupProps &
	HTMLInputProps & {
		onClear?: (event: MouseEvent<HTMLElement>) => void;
		value?: string;
	};

export const ExpandingSearchBox: FC<ExpandingSearchBoxProps> = ({ onClear, ...props }) => {
	const hasText = props.value !== '';
	return (
		<CollapseDiv className={hasText ? stayOpenClass : undefined}>
			<InputGroup
				{...props}
				// type="search" // this adds the silly browser x icon button
				aria-label="search"
				leftIcon={<CarbonIcon icon={Search16} />}
				rightElement={
					<Button
						icon={<CarbonIcon icon={Close16} />}
						minimal
						small
						onClick={onClear}
						disabled={!hasText}
						css={css`
							&:disabled {
								cursor: unset !important;
							}
						`} // remove the cursor:not-allowed;
					/>
				}
			/>
		</CollapseDiv>
	);
};

const stayOpenClass = 'stayOpen';
const CollapseDiv = styled.div`
	overflow: hidden; /* hide the translated input */
	transition: 100ms ease;

	& .${Classes.INPUT_GROUP} {
		transition: inherit;
		transition-property: transform;
		transform: translate(0, 0);
	}

	& .${Classes.INPUT} {
		transition: inherit;
		transition-property: opacity;
	}

	&:not(:hover):not(:focus-within):not(.${stayOpenClass}) {
		.${Classes.INPUT} {
			opacity: 0;
		}

		.${Classes.INPUT_GROUP} {
			transform: translate(calc(100% - 3rem), 0);
			transition-property: transform;
		}
	}
`;
