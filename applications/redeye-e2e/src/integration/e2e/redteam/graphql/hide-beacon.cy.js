import { graphqlRequest, mutRequest } from '../../../../support/utils';

describe('Hide a Beacon using GraphQL', () => {
	const camp = 'hideBeaconGraphQL';

	it('Hide a beacon', () => {
		cy.showHiddenItems();
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);
		cy.clickBeaconsTab();

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];

			const mutation = `mutation toggleBeaconHidden($beaconId: String!, $campaignId: String!) {
				toggleBeaconHidden(beaconId: $beaconId, campaignId: $campaignId) {
				  hidden
				}
			  }
				  `;

			const variables1 = { beaconId: 'COMPUTER02-1166658656', campaignId: returnedUrl };
			mutRequest(mutation, variables1);

			const query = `query beacons($campaignId: String!) {
					beacons(campaignId: $campaignId) {
					  meta {
						id
					  }
					}
				  }
				  `;

			const variables2 = { campaignId: returnedUrl };

			graphqlRequest(query, variables2).then((res) => {
				const comp = res.body.data.beacons;
				expect(comp.length).to.eq(5);

				const co = res.body.data.beacons.map((ty) => ty.id);
				expect(co).to.not.include('1166658656');
			});
		});
		cy.returnToCampaignCard();
		cy.doNotShowHiddenItems();
		cy.selectCampaign(camp);
		cy.clickBeaconsTab();
		const beacs = [];
		cy.get('[cy-test=beacons-row]')
			.each(($li) => beacs.push($li.text()))
			.then(() => {
				// cy.log(beacs.join(', '));
				cy.wrap(beacs).should('deep.equal', [
					'08/17—08/17330588776 · jdoejdoe9',
					'08/17—08/172146137244 · jdoe *jdoe *9',
					'08/17—08/17500978634 · SYSTEM *SYSTEM *8',
					'08/17—08/171042756528 · user01user0114',
				]);
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
