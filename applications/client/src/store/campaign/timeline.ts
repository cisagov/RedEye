import { DateRange } from '@blueprintjs/datetime';
import type { IBar } from '@redeye/client/views';
import { computed, observable, reaction } from 'mobx';
import type { ObjectMap, Ref } from 'mobx-keystone';
import { ExtendedModel, model, modelAction, modelClass, modelFlow, objectMap, prop } from 'mobx-keystone';
import type { BeaconModel, TimelineBucketModel, TimelineCommandCountTupleModel, TimelineModel } from '../graphql';
import { beaconsRef } from '../graphql';
import { timelineQuery } from '../util';
import { RedEyeModel } from '../util/model';

interface TimelineBucketResponse extends Omit<TimelineBucketModel, 'beaconCommandCountPair'> {
	beaconCommandCountPair: TimelineCommandCountTupleModel[];
}
interface TimelineResponse extends Omit<TimelineModel, 'buckets'> {
	buckets: TimelineBucketResponse[];
}

const allTimeIndex = -10;

@model('TimelineStore')
export class TimelineStore extends ExtendedModel(() => ({
	baseModel: modelClass<RedEyeModel>(RedEyeModel),
	props: {
		timelineData: prop<TimelineResponse | null | undefined>().withSetter(),
		prevTimelineData: prop<TimelineResponse | null | undefined>().withSetter(),
		selectedBeacons: prop<ObjectMap<Ref<BeaconModel>>>(() => objectMap()).withSetter(),
		selectedChainedBeacons: prop<ObjectMap<Ref<BeaconModel>>>(() => objectMap()).withSetter(),
		/** scrubberIndex of -10 means the timeline is viewing 'All Time' */
		scrubberIndex: prop<number>(allTimeIndex),
		suggestedBucketCount: prop<number | undefined>().withSetter(),
	},
})) {
	@observable suggestedDateRange: DateRange | undefined;
	@observable maxRange: DateRange | undefined;

	protected onAttachedToRootStore(): (() => void) | void {
		return reaction(
			() => this.scrubberIndex,
			() => {
				if (this.isShowingAllTime) return;
				const pastNodeIds = this.exitedBeaconIds;
				const presentNodeIds = this.currentBeaconIds.filter((id) => !pastNodeIds.includes(id));
				this.appStore?.campaign.graph?.graphData.setTimeState({
					currentTime: this.scrubberTime?.valueOf() || 0,
					pastNodeIds,
					presentNodeIds,
				});
			}
		);
	}

	@computed get scrubberTime(): Date | null {
		let currentBucket = this.currentTimelineData?.buckets[this.scrubberIndex];

		if (this.isShowingAllTime) {
			currentBucket = this.currentTimelineData?.buckets[this.currentTimelineData.buckets.length - 1];
		}

		return currentBucket ? new Date(currentBucket.bucketEndTime) : null;
	}

	@modelAction showAllTime() {
		this.setScrubberToEnd();
		this.scrubberIndex = allTimeIndex;
		this.appStore?.campaign.graph?.graphData.clearTime();
	}

	@computed get isShowingAllTime(): boolean {
		return this.scrubberIndex === allTimeIndex;
	}

	@computed get currentTimelineData(): TimelineResponse | undefined | null {
		// Handle new data coming in so timeline doesn't flash blank before updating
		return this.timelineData ?? this.prevTimelineData;
	}

	@computed get startTime(): Date | null {
		const date = this.currentTimelineData?.bucketStartTime;
		return date ? this.appStore!.settings.momentTz(date).toDate() : null;
	}

	@computed get endTime(): Date | null {
		const date = this.currentTimelineData?.bucketEndTime;
		return date ? this.appStore!.settings.momentTz(date).toDate() : null;
	}

	@computed get isEnd(): boolean {
		return (
			this.scrubberIndex === (this.currentTimelineData?.buckets?.length || 0) - 1 ||
			(this.scrubberTime && this.endTime && this.scrubberTime.valueOf() >= this.endTime.valueOf()) ||
			!this.timelineData
		);
	}

	@computed get isStart(): boolean {
		return (this.scrubberIndex || 0) === 0 || !this.timelineData;
	}

	@computed get bars(): IBar[] {
		const selectedBeaconIds = Array.from(this.selectedBeacons.values(), (x) => x!.id);
		return (
			this.currentTimelineData?.buckets?.map((bucket, i) => ({
				start: new Date(bucket?.bucketStartTime),
				end: new Date(bucket?.bucketEndTime),
				beaconCount: bucket?.beaconCommandCountPair.reduce((sum: number, pair) => sum + (pair?.commandCount ?? 0), 0),
				activeBeaconCount:
					this.scrubberIndex >= i
						? bucket?.beaconCommandCountPair.reduce(
								(sum, pair) =>
									pair?.beaconId && this.activeBeaconIds(bucket).has(pair?.beaconId)
										? sum + (pair?.commandCount ?? 0)
										: sum,
								0
						  )
						: 0,
				selectedBeaconCount: bucket?.beaconCommandCountPair.reduce(
					(sum, pair) =>
						pair?.beaconId && selectedBeaconIds.includes(pair?.beaconId) ? sum + (pair?.commandCount ?? 0) : sum,
					0
				),
				beaconCommands: bucket?.beaconCommandCountPair.reduce(
					(commands: Array<Record<string, string | number>>, pair) => [
						...commands,
						{
							beaconId: pair?.beaconId,
							commandCount: pair?.commandCount,
						},
					],
					[]
				),
				beaconNumbers: bucket?.beaconCommandCountPair.length,
			})) ?? []
		);
	}

	@computed get currentBeaconIds(): Array<string> {
		const beaconIds = new Set<string>();
		this.currentTimelineData?.buckets?.forEach((b, i) => {
			const bIds = [...(b?.createdBeacons || []), ...(b?.activeBeacons || [])];
			if (i <= this.scrubberIndex) bIds.forEach(beaconIds.add, beaconIds);
		});
		return Array.from(beaconIds);
	}

	activeBeaconIds = (bucket): Set<string> =>
		new Set(
			[...(bucket.createdBeacons || []), ...(bucket.activeBeacons || [])].filter(
				// @ts-ignore
				(id) => !this?.exitedBeaconIds?.includes(id)
			)
		);

	@computed get exitedBeaconIds(): Array<string> {
		const beaconIds = new Set<string>();
		this.currentTimelineData?.buckets?.forEach((b: any, i) => {
			const bIds = b?.deadBeacons ?? [];
			if (i <= this.scrubberIndex) bIds.forEach(beaconIds.add, beaconIds);
		});
		return Array.from(beaconIds);
	}

	@computed get currentBucket(): TimelineBucketResponse | undefined {
		return this.currentTimelineData?.buckets?.[this.scrubberIndex];
	}

	@modelFlow
	*getTimeline() {
		const campaignId: string | undefined = this.appStore?.router?.params?.id;
		const suggestedStartTime = this.suggestedDateRange?.[0]?.toISOString();
		const suggestedEndTime = this.suggestedDateRange?.[1]?.toISOString();
		const data = yield this.appStore?.graphqlStore.queryTimeline(
			{
				campaignId: campaignId!,
				suggestedBuckets: this.suggestedBucketCount,
				suggestedStartTime,
				hidden: !!this.appStore?.settings.showHidden,
				suggestedEndTime,
			},
			timelineQuery
		);

		// Store for later
		const oldScrubberIndex = this.scrubberIndex;
		const oldBarLength = this.bars.length;
		if (data) {
			this.setTimelineData(data?.timeline);

			if (!this.isShowingAllTime) {
				// Figure out where the scrubber should be
				// TODO: not sure this works quite right. Looks like it places the timeline in a visually similar spot
				// ... it should actually clamp the scrubber placement based on the new time.
				if (this.scrubberIndex === 0) {
					this.setScrubberIndex((this.timelineData?.buckets?.length || 1) - 1);
				} else {
					const newBarLength = data?.timeline?.buckets.length;
					let newScrubberIndex = newBarLength - 1;
					if (this.scrubberIndex !== oldBarLength - 1) {
						newScrubberIndex = Math.round((newBarLength / oldBarLength) * oldScrubberIndex);
					}
					this.setScrubberIndex(newScrubberIndex);
				}
			}
			// maintain a copy of the data's max and min time
			if (!suggestedEndTime && !suggestedStartTime) {
				this.maxRange = [
					data?.timeline?.bucketStartTime
						? this.appStore!.settings.momentTz(data?.timeline?.bucketStartTime).toDate()
						: null,
					data?.timeline?.bucketEndTime
						? this.appStore!.settings.momentTz(data?.timeline?.bucketEndTime).toDate()
						: null,
				];
			}
		}
		return data;
	}

	@modelAction clearSelected() {
		this.selectedBeacons.clear();
		this.selectedChainedBeacons.clear();
	}

	/** Sets the scrubber time to the time passed in. Time MUST be equal to one of the bins. */
	@modelAction setScrubberTimeExact(time: Date) {
		this.setScrubberIndex(this.bars.findIndex((bar) => time.valueOf() === bar.end.valueOf()));
	}

	/** Sets the scrubber time and bin index to the closest match for the given time.	 */
	@modelAction setScrubberTimeAny(time: Date) {
		let timeDiff = Infinity;
		let targetBar;
		this.bars.forEach((bar) => {
			const barTimeDiff = Math.abs(bar.end.valueOf() - time.valueOf());
			if (barTimeDiff < timeDiff) {
				timeDiff = barTimeDiff;
				targetBar = bar;
			}
		});
		if (targetBar) {
			this.setScrubberTimeExact(targetBar.end);
		}
	}

	@modelAction setScrubberIndex(index: number) {
		if (index !== allTimeIndex) {
			const bars = this.bars;
			this.scrubberIndex = Math.max(0, Math.min(bars.length - 1, index));
		} else {
			this.scrubberIndex = allTimeIndex;
		}
	}

	@modelAction setScrubberToStart() {
		if (this.startTime) this.setScrubberTimeAny(this.startTime);
	}

	@modelAction setScrubberToEnd() {
		if (this.endTime) this.setScrubberTimeAny(this.endTime);
	}

	@modelAction skipForward() {
		const oldTime = this.scrubberTime;
		const bars = this.bars;
		if (oldTime && bars) {
			let oldBucketIdx = bars.findIndex((bar) => oldTime.valueOf() === bar.end.valueOf());

			// start at zero if there is no match
			if (oldBucketIdx < 0) {
				oldBucketIdx = 0;
			}

			// stop if we're already on the last bucket
			if (oldBucketIdx < bars.length - 1) {
				// Find the next bucket filled with stuff
				const oldBucket = bars[oldBucketIdx];
				let newBucketIdx = bars.findIndex((bar) => bar.end.valueOf() > oldBucket.end.valueOf() && bar.beaconCount > 0);

				// Select the last bucket if newBucket isn't defined (when we're at the end of the array)
				if (newBucketIdx < 0) {
					newBucketIdx = bars.length - 1;
				}
				this.scrubberIndex = newBucketIdx;
			}
		}
	}

	@modelAction skipBackward() {
		const oldTime = this.scrubberTime;
		const bars = this.bars;
		if (oldTime && bars) {
			let oldBucketIdx = bars.findIndex((bar) => oldTime.valueOf() === bar.end.valueOf());

			// start at the last bucket if there is no match
			if (oldBucketIdx < 0) {
				oldBucketIdx = bars.length - 1;
			}

			// stop if we're already on the first bucket
			if (oldBucketIdx > 0) {
				// Find the prev bucket filled with stuff
				const oldBucket = bars[oldBucketIdx];
				const reversedIdx = Array.from(bars)
					.reverse()
					.findIndex((bar) => bar.end.valueOf() < oldBucket.end.valueOf() && bar.beaconCount > 0);

				// Select the first bucket if newBucket isn't defined (when we're at the start of the array)
				this.scrubberIndex = reversedIdx >= 0 ? bars.length - reversedIdx - 1 : 0;
			}
		}
	}

	@modelAction setBeacon(storeBeacon) {
		if (storeBeacon?.id) {
			this.selectedBeacons.set(storeBeacon.id, beaconsRef(storeBeacon));
		}
	}

	@modelAction setDateRange(range: DateRange) {
		this.suggestedDateRange = range;
	}

	@modelAction resetDateRange() {
		this.suggestedDateRange = undefined;
	}
}
