/// <reference types="cypress" />

import { graphqlRequest } from '../../support/utils';

describe('Command counts', () => {
	const camp = 'commandcounts';
	const fileName = 'gt.redeye';

	it('Verify command counts on campaign card against counts on Hosts tab of campaign', () => {
		cy.uploadCampaign(camp, fileName);

		cy.searchForCampaign(camp);

		// Log starting number of campaign commands on campaign card
		cy.get('[cy-test=command-count]').then((number1) => {
			let commandTotal = number1.text().split(' ').shift();
			cy.get('[cy-test=command-count]').should('contain', commandTotal);

			// Open campaign and log command counts showing under Host tab - should equal number showing on campaign card
			cy.selectCampaign(camp);
			cy
				.get('[cy-test=row-command-count]')
				.eq(0)
				.invoke('text')
				.then((countRow1) => {
					// cy.log(countRow1);

					cy
						.get('[cy-test=row-command-count]')
						.eq(1)
						.invoke('text')
						.then((countRow2) => {
							// cy.log(countRow2);

							expect(+countRow1 + +countRow2).to.eq(+commandTotal);
						});
				});
		});
	});

	it('Verify command counts on campaign card against counts on Beacons tab of campaign', () => {
		cy.searchForCampaign(camp);

		// Log starting number of campaign commands on campaign card
		cy.get('[cy-test=command-count]').then((number1) => {
			let commandTotal = number1.text().split(' ').shift();
			cy.get('[cy-test=command-count]').should('contain', commandTotal);

			// Open campaign and go to Beacons tab
			cy.selectCampaign(camp);
			cy.clickBeaconsTab();

			// Log number of commands for each beacon - should equal number on campaign card
			cy
				.get('[cy-test=row-command-count]')
				.eq(0)
				.invoke('text')
				.then((countRow1) => {
					// cy.log(countRow1);

					cy
						.get('[cy-test=row-command-count]')
						.eq(1)
						.invoke('text')
						.then((countRow2) => {
							// cy.log(countRow2);

							cy
								.get('[cy-test=row-command-count]')
								.eq(2)
								.invoke('text')
								.then((countRow3) => {
									// cy.log(countRow3);

									cy
										.get('[cy-test=row-command-count]')
										.eq(3)
										.invoke('text')
										.then((countRow4) => {
											// cy.log(countRow4);

											cy
												.get('[cy-test=row-command-count]')
												.eq(4)
												.invoke('text')
												.then((countRow5) => {
													// cy.log(countRow5);

													expect(+countRow1 + +countRow2 + +countRow3 + +countRow4 + +countRow5).to.eq(+commandTotal);
												});
										});
								});
						});
				});
		});
	});

	it('Verify command counts match the total for each Host in campaign', () => {
		cy.selectCampaign(camp);

		// Log name and command count for first host
		cy
			.get('[cy-test=hostName]')
			.eq(1)
			.invoke('text')
			.then((nameHost1) => {
				// cy.log(nameHost1);

				cy
					.get('[cy-test=row-command-count]')
					.eq(0)
					.invoke('text')
					.then((countHost1) => {
						// cy.log(countHost1);

						// Click host to open details
						cy.get('[cy-test=info-row]').eq(1).click();

						// Log number of commands showing - should match umber in host row

						cy.url().then((url) => {
							let returnedUrl = url.split('/')[5];
							// cy.log(returnedUrl);

							const query = `query commandIds($beaconId: String, $campaignId: String!, $commandIds: [String!], $commandType: String, $hostId: String, $operatorId: String, $sort: SortType) {
						commandIds(beaconId: $beaconId, campaignId: $campaignId, commandIds: $commandIds, commandType: $commandType, hostId: $hostId, operatorId: $operatorId, sort: $sort)
					  }`;

							const variables = `{"campaignId": "${returnedUrl}", "hostId": "${nameHost1}", "sort": { "sortBy": "time", "direction": "ASC"}}`;
							graphqlRequest(query, variables).then((res) => {
								// cy.log(res.body.data.commandIds);
								expect(res.body.data.commandIds).length(countHost1);
							});
						});
					});
			});

		// Go back to Host list; log name and command count for second host
		cy.clickExplorerMode();
		cy
			.get('[cy-test=hostName]')
			.eq(2)
			.invoke('text')
			.then((nameHost2) => {
				// cy.log(nameHost2);

				cy
					.get('[cy-test=row-command-count]')
					.eq(1)
					.invoke('text')
					.then((countHost2) => {
						// cy.log(countHost2);

						// Click host to open details
						cy.get('[cy-test=info-row]').eq(2).click();

						// Log number of commands showing - should match umber in host row

						cy.url().then((url) => {
							let returnedUrl = url.split('/')[5];
							// cy.log(returnedUrl);

							const query = `query commandIds($beaconId: String, $campaignId: String!, $commandIds: [String!], $commandType: String, $hostId: String, $operatorId: String, $sort: SortType) {
						commandIds(beaconId: $beaconId, campaignId: $campaignId, commandIds: $commandIds, commandType: $commandType, hostId: $hostId, operatorId: $operatorId, sort: $sort)
					  }`;

							const variables = `{"campaignId": "${returnedUrl}", "hostId": "${nameHost2}", "sort": { "sortBy": "time", "direction": "ASC"}}`;
							graphqlRequest(query, variables).then((res) => {
								// cy.log(res.body.data.commandIds);
								expect(res.body.data.commandIds).length(countHost2);
							});
						});
					});
			});
	});

	it('Verify command counts from Search modal', () => {
		// Open campaign and go to Search modal
		cy.selectCampaign(camp);
		cy.clickSearch();

		// Enter search term
		cy.searchCampaignFor('exit');

		// Log the number of commands showing for the Command Type result
		cy
			.get('[cy-test=command-count]')
			.invoke('text')
			.then((commandCount1) => {
				// cy.log(commandCount1);

				// Click the Command Type to go to the list of commands; verify count matches number in search
				cy.get('[cy-test=search-result-item]').contains('Command Type').click();
				cy
					.get('[cy-test=info-row]')
					.its('length')
					.then((commandCount2) => {
						// cy.log(commandCount2);
						expect(+commandCount2).to.eq(+commandCount1);
					});
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
