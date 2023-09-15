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
			.each(($li) =>
				beacs.push(`${$li.find('[cy-test=beacon-time]').text()}${$li.find('[cy-test=beacon-display-name]').text()}`)
			)
			.then(() => {
				// cy.log(beacs.join(', '));
				cy.wrap(beacs).should('deep.equal', [
					'08/17—08/17COMPUTER02 / 330588776 · jdoe',
					'08/17—08/17COMPUTER02 / 2146137244 · jdoe *',
					'08/17—08/17COMPUTER03 / 500978634 · SYSTEM *',
					'08/17—08/17COMPUTER03 / 1042756528 · user01',
				]);
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
