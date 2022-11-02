import { graphqlRequest } from '../../../../support/utils';

let cmdId;
describe('Query Commands & CommandsIds', () => {
	it('Query Commands', () => {
		const camp = 'goldenticket';

		// cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);

		cy.clickCommandsTypesTab();

		cy.selectCommandType('elevate');

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];
			cy.log(returnedUrl);

			const query = `query commandIds($beaconId: String, $campaignId: String!, $commandIds: [String!], $commandType: String, $hostId: String, $operatorId: String, $sort: SortType) { 
          commandIds(beaconId: $beaconId, campaignId: $campaignId, commandIds: $commandIds, commandType: $commandType, hostId: $hostId, operatorId: $operatorId, sort: $sort) 
        }`;
			const variables = `{"campaignId": "${returnedUrl}", "commandType": "elevate", "sort": { "sortBy": "time", "direction": "ASC"}}`;
			graphqlRequest(query, variables).then((res) => {
				let cmdId = res.body.data.commandIds.toString();
				cy.log(cmdId);

				const query1 = `query commands($beaconId: String, $campaignId: String!, $commandIds: [String!], $commandType: String, $hostId: String, $operatorId: String, $sort: SortType) {
          commands(beaconId: $beaconId, campaignId: $campaignId, commandIds: $commandIds, commandType: $commandType, hostId: $hostId, operatorId: $operatorId, sort: $sort)
        }`;
				const variables1 = `{"campaignId": "${returnedUrl}",  "commandIds": ["a1117439-359c-4b28-a634-1a43912d0d6a"] "}`;
				graphqlRequest(query1, variables1).then((res1) => {
					cy.log(res1.body);
				});
			});
		});
	});
	// cy.returnToCampaignCard();

	// cy.deleteCampaign(camp);
});
