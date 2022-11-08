/// <reference types="cypress" />

describe('Command counts', () => {
	const camp = 'commandcounts';
	const fileName = 'gt.redeye';

	it('Verify command counts on campaign card against counts on Hosts tab of campaign', () => {
		cy.uploadCampaign(camp, fileName);

		cy.searchForCampaign(camp);

		// Log starting number of campaign commands on campaign card
		cy.get('[cy-test=command-count]').then((number1) => {
			const commandTotal = number1.text().split(' ').shift();
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
			const commandTotal = number1.text().split(' ').shift();
			cy.get('[cy-test=command-count]').should('contain', commandTotal);

			// Open campaign and go to Beacons tab
			cy.selectCampaign(camp);
			cy.get('[cy-test=beacons]').click();

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

	// IGNORE FOR NOW -- NEED A WAY TO COUNT ALL ROWS. CURRENTLY ONLY COUNTS THOSE THAT SHOW IN THE UI WHEREVER THE SCROLL BAR IS
	// it.skip('Verify command counts match the total for each Host in campaign', () => {
	// 	cy.selectCampaign(camp);

	// 	// Open campaign and log command count for first host
	// 	cy
	// 		.get('[cy-test=row-command-count]')
	// 		.eq(0)
	// 		.invoke('text')
	// 		.then((countHost1) => {
	// 			cy.log(countHost1);

	// 			// Click host to open details
	// 			cy.get('[cy-test=info-row]').eq(1).click();

	// 			// Log number of commands showing - should match umber in host row
	// 			cy.wait(1000);
	// 			cy.get('[data-test-id=virtuoso-scroller]').scrollTo('bottom');
	// 			cy.wait(1000);

	// 			cy
	// 				.get('[cy-test=command-info]')

	// 				.its('length')
	// 				.then((countCommandsHost1) => {
	// 					cy.log(countCommandsHost1);
	// 					expect(+countCommandsHost1).to.eq(+countHost1);
	// 					// This only counts the commands that are showing in the UI -- doesn't count those that you have to scroll down to see. Figure out how to fix this
	// 				});
	// 		});
	// });

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
