import { CampaignViews } from '@redeye/client/types';
import type { UUID } from '@redeye/client/types/uuid';
import { computed } from 'mobx';
import { ExtendedModel, model, modelAction } from 'mobx-keystone';
import type { PresentationCommandGroupModel, PresentationItemModel } from '../graphql';
import { routes } from '../routing';
import { RedEyeModel } from '../util/model';

@model('PresentationStore')
export class PresentationStore extends ExtendedModel(RedEyeModel, {}) {
	@computed get selectedItem(): undefined | PresentationItemModel {
		if (this.appStore?.router.params?.presentation)
			return this.appStore?.graphqlStore.presentationItems.get(this.appStore.router.params.presentation);
		else return undefined;
	}

	@computed get index(): number {
		return this.appStore?.router.params.slide ? parseInt(this.appStore.router.params.slide, 10) - 1 : 0;
	}

	@computed get currentSlide(): undefined | PresentationCommandGroupModel {
		return this.appStore?.router.params.slide ? this.selectedItem?.commandGroups?.[this.index]?.maybeCurrent : undefined;
	}

	@computed get isPresenting(): boolean {
		return !!this.selectedItem;
	}

	@modelAction async changeIndex(index: number, presentation?: string) {
		if (this.appStore?.router.params.presentation || presentation) {
			const currentSlide = presentation
				? this.appStore?.graphqlStore.presentationItems.get(presentation)?.commandGroups?.[index]?.current
				: this.selectedItem?.commandGroups?.[index]?.current;
			const beaconId = currentSlide?.beaconIds?.[(currentSlide?.beaconIds?.length || 1) - 1];
			const beacon = beaconId && this.appStore?.graphqlStore.beacons.get(beaconId);
			if (beacon) {
				this.appStore?.router.updateRoute({
					path: routes[CampaignViews.PRESENTATION],
					params: {
						presentation: presentation || this.selectedItem?.id,
						slide: `${index + 1}`,
						currentItem: 'beacon',
						currentItemId: beacon.id as UUID,
						activeItem: undefined,
						activeItemId: undefined,
					},
				});
				this.updateTimeline();
			}
		}
	}

	@modelAction back() {
		this.changeIndex(this.index - 1);
	}

	@modelAction forward() {
		this.changeIndex(this.index + 1);
	}

	@modelAction updateTimeline() {
		const slide = this.currentSlide;
		if (slide) {
			const date = slide.maxDate;
			this.appStore?.campaign.timeline.setScrubberTimeAny(new Date(date));
		}
	}

	@modelAction reset() {
		if (this.appStore?.campaign.timeline.endTime) {
			this.appStore?.campaign.timeline.setScrubberTimeAny(this.appStore?.campaign.timeline.endTime);
		}
		this.appStore?.campaign?.interactionState.onHoverOut({});
		this.appStore?.campaign.interactionState.changeSelected();
	}
}
