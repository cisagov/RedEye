import { BookmarkFilled20, Chat16, Chat20, Play16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon } from '@redeye/client/components';
import type { PresentationItemModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { InfoRow, RowTitle } from '@redeye/client/views';
import { CoreTokens, HeroButton, UtilityStyles } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { IconLabel } from '..';

type PresentationTopicItemProps = ComponentProps<'div'> & {
	presentationItem: PresentationItemModel;
};

export const PresentationTopicItem = observer<PresentationTopicItemProps>(({ presentationItem, ...props }) => {
	const store = useStore();

	return (
		<InfoRow
			cy-test={presentationItem.id}
			key={presentationItem.id}
			css={[
				UtilityStyles.hoverRevealChildrenOpacity,
				css`
					padding: 0 2.5rem 0 3.5rem;
					position: relative;
					justify-content: space-between;
					display: flex;
				`,
			]}
			onClick={() => store.campaign.presentation.changeIndex(0, presentationItem.id)}
			{...props}
		>
			<RowTitle
				css={css`
					position: relative;
					font-size: ${CoreTokens.FontSizeLarge};
					font-weight: ${presentationItem.id === 'all' || presentationItem.id === 'favorited'
						? CoreTokens.FontWeightBold
						: CoreTokens.FontWeightNormal};
				`}
			>
				<CarbonIcon
					css={css`
						position: absolute;
						top: 2px;
						left: -1.5rem !important;
					`}
					icon={getIcon(presentationItem)}
				/>
				{presentationItem.key}
			</RowTitle>
			<IconLabel cy-test="count" value={presentationItem.count} icon={Chat16} title="Comments" />
			{/* <PlayIcon icon={Play16} className={UtilityStyles.hoverRevealClassName} /> */}
			<HeroButton
				hover
				className={UtilityStyles.hoverRevealClassName}
				children={<CarbonIcon icon={Play16} />}
				css={heroButtonStyle}
			/>
		</InfoRow>
	);
});

const heroButtonStyle = css`
	position: absolute;
	right: 0.75rem;
	height: 2.5rem;
	width: 2.5rem;
`;

const getIcon = (presentationItem: PresentationItemModel): any => {
	if (presentationItem.id === 'favorited') return BookmarkFilled20;
	if (presentationItem.id === 'all') return Chat20;
	else return '';
};
