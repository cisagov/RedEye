/// <reference types="cypress" />

describe('Beacon counts', () => {
	const camp = 'beaconcounts';
	const fileName = 'gt.redeye';

	it('Verify beacon counts on campaign card against counts on Hosts tab of campaign', () => {
		cy.uploadCampaign(camp, fileName);
		cy.searchForCampaign(camp);

		// Log starting number of campaign comments on campaign card
		cy.get('[cy-test=beacon-count]').then((number1) => {
			const beaconTotal = number1.text().split(' ').shift();
			cy.get('[cy-test=beacon-count]').should('contain', beaconTotal);

			// Open campaign and add up counts of beacons by host - should equal number showing on campaign
			cy.selectCampaign(camp);
			cy.get('[cy-test=row-beacon-count]')
				.eq(0)
				.invoke('text')
				.then((countRow1) => {
					// cy.log(countRow1);

					cy.get('[cy-test=row-beacon-count]')
						.eq(1)
						.invoke('text')
						.then((countRow2) => {
							// cy.log(countRow2);

							expect(+countRow1 + +countRow2).to.eq(+beaconTotal);
						});
				});
		});
	});

	it('Verify beacon counts on campaign card against number on Beacons tab of campaign', () => {
		cy.searchForCampaign(camp);

		// Log starting number of campaign comments on campaign card
		cy.get('[cy-test=beacon-count]').then((number1) => {
			const beaconTotal = number1.text().split(' ').shift();
			cy.get('[cy-test=beacon-count]').should('contain', beaconTotal);

			// Open campaign and count number of beacons showing under Beacons tab - should equal number showing on campaign card
			cy.selectCampaign(camp);
			cy.clickBeaconsTab();
			cy.get('[cy-test=beacons-row]')
				.its('length')
				.then((countBeaconRows) => {
					// cy.log(countBeaconRows);

					expect(+countBeaconRows).to.eq(+beaconTotal);
				});
		});
	});

	it('Verify beacon counts on Hosts tab are accurate', () => {
		cy.selectCampaign(camp);

		// Open campaign and log beacon count for first host
		cy.get('[cy-test=row-beacon-count]')
			.eq(0)
			.invoke('text')
			.then((countHost1) => {
				// cy.log(countHost1);

				// Click host to open details
				cy.get('[cy-test=info-row]').eq(1).click();

				// Go to Beacons tab and log number of beacons showing - should match count in host row
				cy.clickBeaconsTab();
				cy.get('[cy-test=info-row]')
					.its('length')
					.then((countBeaconsHost1) => {
						// cy.log(countBeaconsHost1);
						expect(+countBeaconsHost1).to.eq(+countHost1);
					});
			});
		// Go back to Hosts and log beacon count for second host
		cy.clickExplorerMode();
		cy.get('[cy-test=row-beacon-count]')
			.eq(1)
			.invoke('text')
			.then((countHost2) => {
				// cy.log(countHost2);

				// Click host to open deatails
				cy.get('[cy-test=info-row]').eq(2).click();

				// Go to Beacons tab and log number of beacons showing - should match count in host row
				cy.clickBeaconsTab();
				cy.get('[cy-test=info-row]')
					.its('length')
					.then((countBeaconsHost2) => {
						// cy.log(countBeaconsHost2);
						expect(+countBeaconsHost2).to.eq(+countHost2);
					});
			});
	});

	// PENDING BUG FIX -- BLDSTRIKE-600
	// COMMENTING OUT UNTIL FIXED (skipping makes test fail)

	// it('Verify beacon counts on Operator tab are accurate', () => {
	// 	cy.selectCampaign(camp);

	// 	// Open campaign and go to Operator tab; log beacon count
	// 	cy.clickOperatorsTab();
	// 	cy.get('[cy-test=row-beacon-count]')
	// 		.invoke('text')
	// 		.then((countRow) => {
	// 			// cy.log(countRow);

	// 			// Open operator and go to Beacons tab
	// 			cy.get('[cy-test=operator-row]').click();
	// 			cy.clickBeaconsTab();
	// 			// Log number of beacons showing - should match number from Operator tab count
	// 			cy.get('[cy-test=info-row]')
	// 				.its('length')
	// 				.then((countOperatorBeacons) => {
	// 					// cy.log(countOperatorBeacons);
	// 					expect(+countOperatorBeacons).to.eq(+countRow);
	// 				});
	// 		});
	// });

	// it('Verify beacon counts from Search modal', () => {
	// 	// Open campaign and go to Search modal
	// 	cy.selectCampaign(camp);
	// 	cy.clickSearch();

	// 	// Enter search term
	// 	cy.searchCampaignFor('analyst');

	// 	// Log the number of commands showing for the Operator result
	// 	cy.get('[cy-test=beacon-count]')
	// 		.invoke('text')
	// 		.then((beaconCount1) => {
	// 			// cy.log(beaconCount1);

	// 			// Click the Operator, go to list of beacons; verify count matches number in search
	// 			cy.get('[cy-test=search-result-item]').contains('Operator').click();
	// 			cy.clickBeaconsTab();
	// 			cy.get('[cy-test=info-row]')
	// 				.its('length')
	// 				.then((beaconCount2) => {
	// 					// cy.log(beaconCount2);
	// 					expect(+beaconCount2).to.eq(+beaconCount1);
	// 				});
	// 		});
	// });

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
