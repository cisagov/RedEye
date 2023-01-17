import type { BreadcrumbsProps } from '@blueprintjs/core';
import { Breadcrumb, Classes } from '@blueprintjs/core';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { CoreTokens, Styles } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';

/** BreadcrumbsProps without the OverflowList Props - OverflowList doesn't seem to work */
export type BreadcrumbsSimpleProps = Omit<
	BreadcrumbsProps,
	'collapseFrom' | 'minVisibleItems' | 'overflowListProps' | 'popoverProps'
>;

/** Blueprintjs Breadcrumbs without the OverflowList - OverflowList doesn't seem to work */
export const BreadcrumbsSimple = observer<BreadcrumbsSimpleProps>(
	({
		items,
		breadcrumbRenderer: Crumb = Breadcrumb,
		currentBreadcrumbRenderer: CurrentCrumb,
		// collapseFrom, // TODO: could work?
		className,
		...props
	}) => (
		// recreating the structure from https://blueprintjs.com/docs/#core/components/breadcrumbs.css
		<ul className={[Classes.BREADCRUMBS, className].join(' ')} {...props}>
			{items.map((crumb, i) => (
				// eslint-disable-next-line react/no-array-index-key
				<li key={`${crumb.text}-${i}`}>
					{crumb.current && CurrentCrumb != null ? <CurrentCrumb {...crumb} /> : <Crumb {...crumb} />}
				</li>
			))}
		</ul>
	)
);

export type BreadcrumbsStyledProps = {
	muted?: boolean;
};

export const BreadcrumbsStyled = styled(BreadcrumbsSimple)<BreadcrumbsStyledProps>`
	/* ${Styles.textMeta} */

	${Styles.textEllipsis}
	height: auto;
	display: inline;
	// all children are display:inline; to get the ellipsis... effect

	li {
		display: inline;
	}

	& > li:after {
		content: '/';
		background: unset;
		height: unset;
		width: unset;
		display: inline;
		color: ${CoreTokens.TextMuted};

		${({ muted }) =>
			muted &&
			css`
				color: ${CoreTokens.TextDisabled};
			`}
	}

	.${Classes.BREADCRUMB} {
		display: inline;
		font-size: inherit;
	}

	a.${Classes.BREADCRUMB} {
		color: ${CoreTokens.TextMuted};
		${({ muted }) =>
			!muted &&
			css`
				font-weight: ${CoreTokens.FontWeightBold};
				color: ${CoreTokens.TextLink};
			`};

		&:hover {
			text-decoration: underline;
		}
	}

	.${Classes.BREADCRUMB_CURRENT} {
		color: ${CoreTokens.TextMuted};
	}

	.${Classes.OVERFLOW_LIST_SPACER} {
		// this is used by OverflowList to measure and adjust layout...
		// this kinda disables it?
		display: inline-block;
	}
`;
