import { graphqlRequest } from '../../../../support/utils';

describe('Query Timeline', () => {
	const camp = 'timelineGraphQL';

	it('Query Timeline', () => {
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];
			cy.log(returnedUrl);

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

			const variables = `{"campaignId": "${returnedUrl}"}`;
			graphqlRequest(query, variables).then((res) => {
				const comp = res.body.data.timeline.buckets;
				cy.log(comp);
				expect(comp.length).to.eq(67);
			});
		});

		// cy.returnToCampaignCard();
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
