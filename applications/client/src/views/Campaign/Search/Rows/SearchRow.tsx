import { css } from '@emotion/react';
import { dateShortFormat, semanticIcons as icons } from '@redeye/client/components';
import { useStore } from '@redeye/client/store';
import type { AnyModel } from '@redeye/client/types/search';
import { AdvancedTokens, CoreTokens, SkeletonTxt, Spacer, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { MomentInput } from 'moment-timezone';
import type { ComponentProps, ReactNode } from 'react';
import { Fragment } from 'react';
import { IconLabel } from '../../Explore';

export type SearchRowProps<ItemModel = AnyModel> = ComponentProps<'div'> & {
	item: ItemModel;
	path?: string[];
	text?: ReactNode;
	subText?: ReactNode;
	startTime?: MomentInput;
	endTime?: MomentInput;
	formatTime?: string;
	hostsCount?: number;
	beaconsCount?: number;
	commandsCount?: number;
	commentsCount?: number;
	tagsCount?: number;
};

export const SearchRow = observer<SearchRowProps>(
	({
		item,
		path,
		text,
		subText,
		startTime,
		endTime,
		formatTime = dateShortFormat,
		children,
		hostsCount,
		beaconsCount,
		commandsCount,
		commentsCount,
		tagsCount,
		...props
	}) => {
		const store = useStore();
		return (
			<div role="button" tabIndex={0} css={wrapperStyles} {...props}>
				<Txt ellipsize block small>
					{path?.map((pathFrag, i) => (
						<Fragment key={pathFrag}>
							{i === path.length - 1 ? (
								<Txt muted>{pathFrag}</Txt>
							) : (
								<>
									<Txt>{pathFrag}</Txt>
									<Spacer>/</Spacer>
								</>
							)}
						</Fragment>
					))}
				</Txt>
				{(startTime || text || subText) && (
					<Txt ellipsize block>
						{startTime && (
							<>
								<Txt monospace muted>
									{store.settings.momentTz(startTime).format(formatTime)}
									{endTime && `-${store.settings.momentTz(startTime).format(formatTime)}`}
								</Txt>
								<Spacer />
							</>
						)}
						{text && (
							<>
								<Txt bold large>
									{text}
								</Txt>
								<Spacer />
							</>
						)}
						{subText && <Txt muted>{subText}</Txt>}
					</Txt>
				)}
				{children && <div css={childrenStyles}>{children}</div>}
				<div css={iconsStyle}>
					{hostsCount !== undefined && <IconLabel value={hostsCount} title="Hosts" icon={icons.host} />}
					{tagsCount !== undefined && <IconLabel value={tagsCount} title="Tags" icon={icons.tags} />}
					{commandsCount !== undefined && <IconLabel value={commandsCount} title="Commands" icon={icons.commands} />}
					{beaconsCount !== undefined && <IconLabel value={beaconsCount} title="Beacons" icon={icons.beacon} />}
					{commentsCount !== undefined && <IconLabel value={commentsCount} title="Comments" icon={icons.comment} />}
				</div>
			</div>
		);
	}
);

const wrapperStyles = css`
	border-bottom: 1px solid ${CoreTokens.BorderNormal};
	padding: 1rem 1.5rem;
	cursor: pointer;
	position: relative;

	&:hover {
		background: ${AdvancedTokens.MinimalButtonBackgroundColorHover};
	}
`;

const iconsStyle = css`
	display: flex;
	position: absolute;
	top: 0;
	right: 0;
	margin: 1rem 0.5rem;
`;

const childrenStyles = css`
	margin-top: 0.5rem;
`;

type SearchRowPlaceholderProps = ComponentProps<'div'>;

export const SearchRowPlaceholder = observer<SearchRowPlaceholderProps>((props) => (
	<div css={wrapperStyles} {...props}>
		<Txt small css={{ display: 'inline-block', marginBottom: '0.25rem' }}>
			<SkeletonTxt minChar={10} maxChar={30} />
		</Txt>
		<br />
		<Txt>
			<SkeletonTxt minChar={40} maxChar={80} />
		</Txt>
	</div>
));
