/// <reference types="cypress" />

describe('Command row navigation', () => {
	const camp = 'commandrownav';
	const fileName = 'gt.redeye';

	it('Quicklink breadcrumbs should navigate to command row page destination; Host link should not be clickable', () => {
		cy.uploadCampaign(camp, fileName);

		// Open campaign and select a Host (log Host name)
		cy.selectCampaign(camp);
		cy.get('[cy-test=hostName]')
			.eq(1)
			.invoke('text')
			.then((hostName1) => {
				// cy.log(hostName1);

				cy.get('[cy-test=info-row]').eq(1).click();
				cy.get('[cy-test=header]').should('contain', hostName1);

				// Select a command to expand details; verify its background is colored differently
				cy.expandInfoRow(0);
				cy.get('[cy-test=hostBeaconInfo]').should('contain', hostName1);
				cy.get('[cy-test=info-row]').eq(0).should('have.css', 'background-color');

				// Click Host name and confirm page does not change
				cy.url().then((currentURL1) => {
					// cy.log(currentURL1);

					cy.get('[cy-test=hostBeaconInfo] > li').contains(hostName1).click();

					cy.url().then((currentURL2) => {
						// cy.log(currentURL2);
						expect(currentURL2).to.equal(currentURL1);

						// Click Command name and confirm page changes and goes to the correct command
						cy.get('[cy-test=hostBeaconInfo] > li')
							.last()
							.invoke('text')
							.then((commandName1) => {
								// cy.log(commandName1);

								cy.get('[cy-test=hostBeaconInfo] > li').last().click();

								cy.get('[cy-test=beacon-username]').should('contain', commandName1);
								cy.url().then((currentURL3) => {
									// cy.log(currentURL3);
									expect(currentURL3).to.not.equal(currentURL2);
								});
							});
					});
				});
			});
	});

	it('Quicklink breadcrumbs should navigate to the Host/Commands tab', () => {
		// Open campaign and select a Host
		cy.selectCampaign(camp);
		cy.get('[cy-test=hostName]')
			.eq(1)
			.invoke('text')
			.then((hostName1) => {
				// cy.log(hostName1);

				// Click Comments tab
				cy.clickCommentsTab();

				// Expand comment details, log details, and click on Host name
				cy.get('[cy-test=expand]').eq(0).click();
				cy.get('[cy-test=info-row]')
					.eq(0)
					.invoke('text')
					.then((text) => {
						let commentText = text.split(' ')[1];
						// cy.log(commentText);

						cy.get('[cy-test=hostBeaconInfo] > li').contains(hostName1).click();

						// Page should navigate back to Host/Commands tab -- Host name at top, Commands tab selected
						cy.get('[cy-test=header]').should('contain', hostName1);
						cy.get('[cy-test=commands]').eq(0).invoke('attr', 'tabindex').should('equal', '0');
						cy.get('[cy-test=info-row]').eq(11).should('have.css', 'background-color');
					});
			});
	});

	// COMMENTING OUT FOR NOW - PENDING A KNOWN BUG FIX. WILL RE-VISIT WHEN FIX HAS BEEN IMPLEMENTED.
	// it('Command rows should expand when clicked', { scrollBehavior: false }, () => {
	// 	// Select the campaign and open a host to view the commands
	// 	cy.selectCampaign(camp);
	// 	cy.get('[cy-test=hostName]').eq(1).click();

	// 	// Log the starting height of the first command in the list
	// 	cy
	// 		.get('[cy-test=command-info]')
	// 		.eq(0)
	// 		.invoke('height')
	// 		.then((startingHeight1) => {
	// 			// cy.log(startingHeight1);

	// 			// Log the starting height of the second command in the list
	// 			cy
	// 				.get('[cy-test=command-info]')
	// 				.eq(1)
	// 				.invoke('height')
	// 				.then((startingHeight2) => {
	// 					// cy.log(startingHeight2);

	// 					// Log the starting height of the fourth command in the list
	// 					cy
	// 						.get('[cy-test=command-info]')
	// 						.eq(3)
	// 						.invoke('height')
	// 						.then((startingHeight3) => {
	// 							// cy.log(startingHeight3);

	// 							// Click the first command in the list and verify that the height increased
	// 							cy.wait(1000);
	// 							cy
	// 								.get('[cy-test=command-info]')
	// 								.eq(0)
	// 								.click()
	// 								.invoke('height')
	// 								.then((expandedHeight1) => {
	// 									// cy.log(expandedHeight1);
	// 									expect(expandedHeight1).to.be.gt(startingHeight1);

	// 									// Click another command in the list; verify that its height changed and that the height of the first command did not decrease
	// 									cy
	// 										.get('[cy-test=command-info]')
	// 										.eq(1)
	// 										.click()
	// 										.invoke('height')
	// 										.then((expandedHeight2) => {
	// 											// cy.log(expandedHeight2);
	// 											expect(expandedHeight2).to.be.gt(startingHeight2);

	// 											cy
	// 												.get('[cy-test=command-info]')
	// 												.eq(0)
	// 												.click()
	// 												.invoke('height')
	// 												.then((verifyHeight1) => {
	// 													// cy.log(verifyHeight1);
	// 													expect(+verifyHeight1).to.eq(+expandedHeight1);

	// 													// Click another command in the list; verify that its height changed and the height of the other 2 did not decrease
	// 													cy
	// 														.get('[cy-test=command-info]')
	// 														.eq(3)
	// 														.click()
	// 														.invoke('height')
	// 														.then((expandedHeight3) => {
	// 															// cy.log(expandedHeight3);
	// 															expect(expandedHeight3).to.be.gt(startingHeight3);

	// 															cy
	// 																.get('[cy-test=command-info]')
	// 																.eq(0)
	// 																.click()
	// 																.invoke('height')
	// 																.then((verifyHeight1again) => {
	// 																	// cy.log(verifyHeight1again);
	// 																	expect(+verifyHeight1again).to.eq(+expandedHeight1);

	// 																	cy
	// 																		.get('[cy-test=command-info]')
	// 																		.eq(1)
	// 																		.click()
	// 																		.invoke('height')
	// 																		.then((verifyHeight2) => {
	// 																			// cy.log(verifyHeight2);
	// 																			expect(verifyHeight2).to.eq(expandedHeight2);

	// 																			// Click the "Collapse All" button and verify that all command row heights are the same and have decreased from the previous clicks
	// 																			cy.get('[cy-test=collapse-all]').click();

	// 																			cy
	// 																				.get('[cy-test=command-info]')
	// 																				.eq(0)
	// 																				.invoke('height')
	// 																				.then((collapsedHeight1) => {
	// 																					// cy.log(collapsedHeight1);
	// 																					expect(collapsedHeight1).to.eq(startingHeight1);

	// 																					cy
	// 																						.get('[cy-test=command-info]')
	// 																						.eq(1)
	// 																						.invoke('height')
	// 																						.then((collapsedHeight2) => {
	// 																							// cy.log(collapsedHeight2);
	// 																							expect(collapsedHeight2).to.eq(startingHeight2);

	// 																							cy
	// 																								.get('[cy-test=command-info]')
	// 																								.eq(3)
	// 																								.invoke('height')
	// 																								.then((collapsedHeight3) => {
	// 																									// cy.log(collapsedHeight3);
	// 																									expect(collapsedHeight3).to.eq(startingHeight3);
	// 																								});
	// 																						});
	// 																				});
	// 																		});
	// 																});
	// 														});
	// 												});
	// 										});
	// 								});
	// 						});
	// 				});
	// 		});
	// });

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
