import type { ButtonProps } from '@blueprintjs/core';
import { Button, Intent } from '@blueprintjs/core';
import { Save16, View16, ViewOff16 } from '@carbon/icons-react';
import styled from '@emotion/styled';
import { CarbonIcon } from '@redeye/client/components';
import { Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';

export const MetaHeader = (props) => <Txt bold {...props} />;

export const MetaGridLayout = styled.div`
	display: grid;
	grid-gap: 1rem 2rem;
	align-content: start;
	align-items: baseline;
	grid-template-columns: auto 1fr;
	padding: 1.5rem 1rem;
`;

type ToggleHiddenButtonProps = ButtonProps & {
	isHiddenToggled: boolean;
	typeName: string;
};

export const ToggleHiddenButton = observer<ToggleHiddenButtonProps>(({ isHiddenToggled, typeName, ...props }) => (
	<Button
		minimal
		intent={Intent.PRIMARY}
		rightIcon={<CarbonIcon icon={isHiddenToggled ? View16 : ViewOff16} />}
		text={`${isHiddenToggled ? 'Show' : 'Hide'} this ${typeName}`}
		css={{ margin: '0 -0.5rem', gridColumn: 'span 2', justifySelf: 'start' }}
		{...props}
	/>
));

type SaveInputButtonProps = ButtonProps & {};

export const SaveInputButton = observer<SaveInputButtonProps>(({ disabled, ...props }) => (
	<Button
		icon={<CarbonIcon icon={Save16} />}
		minimal={disabled}
		intent={disabled ? Intent.NONE : Intent.PRIMARY}
		disabled={disabled}
		{...props}
	/>
));
