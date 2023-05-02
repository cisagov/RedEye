import { graphqlRequest } from '../../../../support/utils';

describe('Query Timeline', () => {
	const camp = 'timelineGraphQL';

	it('Query Timeline', () => {
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];

			const query = `query timeline(
				$campaignId: String!
				$suggestedBuckets: Float
			  ) {
				timeline(
				  campaignId: $campaignId
				  suggestedBuckets: $suggestedBuckets
				) {
				  buckets {
					bucketStartTime
				  }
				}
			  }`;

			const variables = { campaignId: returnedUrl };

			graphqlRequest(query, variables).then((res) => {
				const comp = res.body.data.timeline.buckets;
				expect(comp.length).to.eq(67);
			});
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
