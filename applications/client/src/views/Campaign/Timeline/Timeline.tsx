import { Button, ButtonGroup, Intent, Switch } from '@blueprintjs/core';
import type { DateRange } from '@blueprintjs/datetime2';
import { DateRangeInput2 } from '@blueprintjs/datetime2';
import { Pause16, Play16, Reset16, SkipBack16, SkipForward16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon, dateFormat, datePlaceholder } from '@redeye/client/components';
import { createState } from '@redeye/client/components/mobx-create-state';
import { useStore } from '@redeye/client/store';
import { CampaignViews } from '@redeye/client/types';
import { Header, Spacer, Txt, CoreTokens, popoverOffset } from '@redeye/ui-styles';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useEffect } from 'react';
import { PANEL_HEIGHT, TIMELINE_BG_COLOR } from './timeline-static-vars';
import { TimelineChart } from './TimelineChart';

type TimelineProps = ComponentProps<'div'> & {};

export const Timeline = observer<TimelineProps>(({ ...props }) => {
	const store = useStore();

	const state = createState({
		isPlaying: false as boolean,
		setIsPlaying(value: boolean) {
			this.isPlaying = value;
		},
		playCount: 0 as number,
		setPlayCount(value: number) {
			this.playCount = value;
		},
		showDateRangeInput: false,
		dateRange: [store.campaign.timeline.startTime, store.campaign.timeline.endTime] as DateRange,
		updateDateRange(range: DateRange) {
			if (range[0] && range[1]) {
				this.dateRange = range;
			}
		},
		play() {
			this.setIsPlaying(true);
		},
		pause() {
			this.setIsPlaying(false);
			this.setPlayCount(0); // Just in case
		},
		restartAndPlay() {
			store.campaign.timeline.setScrubberToStart();
			this.play();
		},
		pauseAndTrigger(trigger) {
			return () => {
				this.pause();
				trigger();
			};
		},
		handleClose() {
			this.pause();
			const dateRange = this.dateRange;
			this.showDateRangeInput = false;
			if (dateRange[0] instanceof Date && dateRange[1] instanceof Date) {
				store.campaign?.timeline.setDateRange(dateRange);
			}
		},
	});

	useQuery(
		[
			'timeline',
			store.campaign.id,
			store.campaign.timeline.suggestedBucketCount,
			store.campaign.timeline.suggestedDateRange,
		],
		async () => await store.campaign.timeline.getTimeline()
	);

	useEffect(() => {
		let timeout;
		if (state.isPlaying) {
			timeout = setTimeout(() => {
				store.campaign.timeline.skipForward();
				state.setPlayCount(state.playCount + 1);
			}, 750);
		}
		return () => {
			if (timeout) clearTimeout(timeout);
		};
	}, [state.playCount, state.isPlaying]);

	useEffect(() => {
		state.updateDateRange([store.campaign.timeline.startTime, store.campaign.timeline.endTime]);
	}, [store.campaign.timeline.startTime, store.campaign.timeline.endTime]);

	// Pause at end handlers
	useEffect(() => {
		if (store.campaign.timeline.isEnd && state.isPlaying) {
			state.pause();
		}
	}, [store.campaign.timeline.isEnd, state.isPlaying]);

	// disable text for presentation mode
	const disableControls = store.router.params.view === CampaignViews.PRESENTATION;

	const startDateMoment = store.settings.momentTz(state.dateRange[0]);
	const endDateMoment = store.settings.momentTz(state.dateRange[1]);

	return (
		<div css={timelineWrapperStyles} {...props}>
			<div css={controlPanelStyles}>
				<div css={leftContentStyles}>
					<Header small cy-test="timeline-header" css={headerStyle}>
						Timeline
					</Header>
					<ButtonGroup cy-test="timeline-edit-dates">
						{state.showDateRangeInput && state.dateRange.length === 2 ? (
							<DateRangeInput2
								disabled={disableControls}
								formatDate={(date) => (date ? store.settings.momentTz(date).format(dateFormat) : datePlaceholder)}
								parseDate={(str) => store.settings.momentTz(str).toDate()}
								defaultValue={state.dateRange}
								maxDate={store.campaign.timeline.maxRange?.[1] || undefined}
								minDate={store.campaign.timeline.maxRange?.[0] || undefined}
								popoverProps={{
									onClose: state.handleClose,
									minimal: true,
									modifiers: popoverOffset(0, 4),
								}}
								onChange={state.updateDateRange}
								startInputProps={{ style: dateInputStyles, autoFocus: true }}
								endInputProps={{ style: dateInputStyles }}
								allowSingleDayRange
								css={dateRangeInputStyle}
								contiguousCalendarMonths={false}
								closeOnSelection={false}
								shortcuts={false}
							/>
						) : (
							<Button
								cy-test="timeline-dates"
								disabled={disableControls}
								minimal
								onClick={() => {
									state.update('showDateRangeInput', true);
								}}
								css={{ marginRight: `-6px !important` }}
							>
								<Txt small monospace>
									<Txt cy-test="timeline-start-date">
										{startDateMoment.isValid() ? startDateMoment.format(dateFormat) : datePlaceholder}
									</Txt>
									<Spacer>&mdash;</Spacer>
									<Txt cy-test="timeline-end-date">
										{endDateMoment.isValid() ? endDateMoment.format(dateFormat) : datePlaceholder}
									</Txt>
								</Txt>
							</Button>
						)}
						<Button
							cy-test="reset-timeline-dates"
							icon={<CarbonIcon icon={Reset16} />}
							onClick={() => store.campaign.timeline.resetDateRange()}
							title="reset dates"
							minimal={!state.showDateRangeInput}
							disabled={store.campaign.timeline.suggestedDateRange == null}
							css={{ marginLeft: 1 }}
						/>
					</ButtonGroup>
				</div>

				<div css={rightContentStyles}>
					<Switch
						label="All Time"
						alignIndicator="right"
						css={timeSwitchStyles}
						disabled={store.router.params.view === CampaignViews.PRESENTATION}
						checked={store.campaign.timeline.isShowingAllTime}
						onChange={() =>
							store.campaign.timeline.isShowingAllTime
								? store.campaign.timeline.setScrubberToEnd()
								: store.campaign.timeline.showAllTime()
						}
					/>
					<ButtonGroup css={controlGroupStyles}>
						<Button
							cy-test="timeline-back"
							icon={<CarbonIcon icon={SkipBack16} />}
							onClick={state.pauseAndTrigger(() => store.campaign.timeline.skipBackward())}
							disabled={disableControls || store.campaign.timeline.isStart}
							// TODO?: if store.campaign?.timeline?.isStart skipToEnd() // restartScrubber() ??
						/>
						<Button
							cy-test="timeline-forward"
							icon={<CarbonIcon icon={SkipForward16} />}
							onClick={state.pauseAndTrigger(() => store.campaign.timeline.skipForward())}
							disabled={disableControls || store.campaign.timeline.isEnd}
							// TODO?: if store.campaign?.timeline?.isEnd skipToStart()
						/>
						<Button
							cy-test="timeline-play-pause"
							rightIcon={<CarbonIcon icon={state.isPlaying ? Pause16 : Play16} />}
							intent={disableControls ? Intent.NONE : Intent.PRIMARY}
							onClick={
								store.campaign.timeline.isEnd ? state.restartAndPlay : state.isPlaying ? state.pause : state.play
							}
							css={playButtonStyles}
							disabled={disableControls}
							text={state.isPlaying ? 'Pause' : 'Play'}
							alignText="left"
						/>
					</ButtonGroup>
				</div>
			</div>
			<div css={timelinePanelStyles}>
				<TimelineChart />
			</div>
		</div>
	);
});

const timelineWrapperStyles = css`
	display: flex;
	flex-direction: column;
	background-color: ${TIMELINE_BG_COLOR};
`;
const controlPanelStyles = css`
	display: flex;
	border-bottom: 1px solid ${CoreTokens.BorderNormal};
	background-color: ${CoreTokens.Background1};
`;
const leftContentStyles = css`
	display: flex;
	flex: 1 1 auto;
	flex-wrap: wrap;
	align-items: center;
	padding: 0 0.5rem;
`;
const rightContentStyles = css`
	display: flex;
	flex: 1 1 auto;
	flex-wrap: wrap-reverse;
	align-items: center;
	padding-left: 1rem;
	justify-content: end;
`;

const headerStyle = css`
	margin: 0.25rem 0.5rem;
`;
const timelinePanelStyles = css`
	height: ${PANEL_HEIGHT}px;
	flex: 1 1 auto;
	padding: 0.5rem 0.25rem 0.5rem 0.5rem; // TODO: support top/bottom margin in timeline
	display: flex;
`;
const dateRangeInputStyle = css`
	font-family: ${CoreTokens.FontFamilyMonospace};
	font-size: ${CoreTokens.FontSizeSmall};
`;
const dateInputStyles = {
	width: 90,
};

const timeSwitchStyles = css`
	margin: 0.25rem 0.5rem;
`;
const controlGroupStyles = css`
	margin-left: 0.5rem;
`;
const playButtonStyles = css`
	flex: 1 1 auto !important; // get the buttons to align
	min-width: 100px; // so its less likely to change sizes when switching text from 'Play' to 'Pause'
`;
