import type { ButtonProps } from '@blueprintjs/core';
import { Button, Intent } from '@blueprintjs/core';
import { Save16, View16, ViewOff16 } from '@carbon/icons-react';
import styled from '@emotion/styled';
import { CarbonIcon, semanticIcons } from '@redeye/client/components';
import { CoreTokens, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';

export const MetaLabel = (props) => <Txt {...props} />;

const metaSectionPadding = '1rem';

export const MetaSection = styled.div`
	border-bottom: 1px solid ${CoreTokens.BorderNormal};
	padding: ${metaSectionPadding};
`;

export const MetaGridLayout = styled.div`
	display: grid;
	grid-gap: 1rem 2rem;
	align-content: start;
	align-items: baseline;
	grid-template-columns: auto 1fr;
`;

const MetaSectionButton = styled(Button)`
	border-bottom: 1px solid ${CoreTokens.BorderNormal};
	padding: ${metaSectionPadding};
	width: 100%;
	justify-content: start;
`;

export const MetaCommentButton = observer<ButtonProps>((props) => (
	<MetaSectionButton
		minimal
		intent={Intent.PRIMARY}
		icon={<CarbonIcon icon={semanticIcons.addComment} />}
		text="Comment on this beacon"
		{...props}
	/>
));

type ToggleHiddenButtonProps = ButtonProps & {
	isHiddenToggled: boolean;
	typeName: string;
};

export const ToggleHiddenButton = observer<ToggleHiddenButtonProps>(({ isHiddenToggled, typeName, ...props }) => (
	<MetaSectionButton
		minimal
		intent={Intent.PRIMARY}
		icon={<CarbonIcon icon={isHiddenToggled ? View16 : ViewOff16} />}
		text={`${isHiddenToggled ? 'Show' : 'Hide'} this ${typeName}`}
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
