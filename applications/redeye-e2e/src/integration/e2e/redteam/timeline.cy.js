/// <reference types="cypress" />

describe('Timeline tests', () => {
	const camp = 'timeline';
	const fileName = 'gt.redeye';

	it('Verify timeline features', () => {
		cy.uploadCampaign(camp, fileName);

		cy.selectCampaign(camp);

		cy.get('[cy-test=timeline]').should('be.visible');

		// Log the starting position of the timeline bar
		cy
			.get('[cy-test=timeline-animated-line]')
			.invoke('attr', 'x1')
			.then((position1) => {
				// cy.log(position1);

				// Click Play and let the timeline run for a few seconds
				cy.get('[cy-test=timeline-play-pause]').click();
				cy.wait(1500);

				// Pause the timeline and log its new position - should be different than the starting position
				cy.get('[cy-test=timeline-play-pause]').click();
				cy
					.get('[cy-test=timeline-animated-line]')
					.invoke('attr', 'x1')
					.then((position2) => {
						// cy.log(position2);
						expect(position1).to.not.equal(position2);

						cy.get('[cy-test=timeline-back]').click();

						cy
							.get('[cy-test=timeline-animated-line]')
							.invoke('attr', 'x1')
							.then((position3) => {
								// cy.log(position3);
								expect(+position3).to.be.lessThan(+position2);

								// Click the forward button to move the timeline ahead 3 places; verify it is more than the previous position
								cy.get('[cy-test=timeline-forward]').click().click().click();
								cy
									.get('[cy-test=timeline-animated-line]')
									.invoke('attr', 'x1')
									.then((position4) => {
										// cy.log(position4);
										expect(+position4).to.be.greaterThan(+position3);
									});
							});
					});
			});
	});

	// //Commenting out (skipping causes test to fail) - the current dataset only covers one day, so dates cannot be changegd.
	// it('Change timeline dates', () => {
	// 	// Open campaign
	// 	cy.selectCampaign(camp);
	// 	cy.get('[cy-test=timeline]').should('be.visible');

	// 	// Update start and end dates - note: need to add data selectors for start/end dates
	// 	cy.get('[cy-test=timeline-dates]').click();
	// 	cy.get('.bp4-input').eq(0).click().clear().type('10/12/20');
	// 	cy.get('.bp4-input').eq(1).click().clear().type('11/09/20');

	// 	// Close date picker; verify new dates stuck
	// 	cy.get('[cy-test=timeline-header]').click();
	// 	cy.get('[cy-test=timeline-dates]').invoke('text').should('contain', '10/12/20').and('contain', '11/09/20');
	// });

	// SPLIT INTO MULTIPLE TESTS FOR EACH COMPONENT BEING TESTED
	it('Timeline tooltip appears as appropriate', () => {
		// Open campaign
		cy.selectCampaign(camp);
		cy.get('[cy-test=timeline]').should('be.visible');

		// Hover over a bar on the timeline and verify that the tooltip appears showing beacon/command info
		cy.get('[cy-test=timeline-bar]').eq(4).trigger('mouseover');
		cy.get('[cy-test=timeline-tooltip-static]').should('be.visible');
		cy.get('[cy-test=timeline-beacons]').should('be.visible');
		cy.get('[cy-test=timeline-beacon-count]').should('be.visible');
		cy.get('[cy-test=timeline-total-commands]').should('be.visible');
		cy.get('[cy-test=timeline-total-command-count]').should('be.visible');
		cy.get('[cy-test=timeline-active-beacons]').should('be.visible');
		cy.get('[cy-test=timeline-active-beacon-count]').should('be.visible');

		// Log # beacons and commands showing in static tooltip to compare to clickable tooltip
		cy
			.get('[cy-test=timeline-beacon-count]')
			.invoke('text')
			.then((beaconCount1) => {
				cy.log(beaconCount1);

				cy
					.get('[cy-test=timeline-total-command-count]')
					.invoke('text')
					.then((totalCommandCount1) => {
						cy.log(totalCommandCount1);

						// Click on the timeline bar and verify tooltip info changes
						cy.get('[cy-test=timeline-bar]').eq(4).click();
						cy.get('[cy-test=timeline-tooltip-clickable]').should('be.visible');
						cy.get('[cy-test=timeline-beacon-header]').should('be.visible');
						cy.get('[cy-test=timeline-command-header]').should('be.visible');
						cy.get('[cy-test=timeline-beacon-name]').should('be.visible');
						cy.get('[cy-test=timeline-beacon-operator]').should('be.visible');
						cy.get('[cy-test=timeline-beacon-command-count]').should('be.visible');

						// Verify number of beacons matches count in other tooltip view
						cy
							.get('[cy-test=timeline-beacon-name]')
							.its('length')
							.then((beaconCount2) => {
								cy.log(beaconCount2);
								expect(+beaconCount2).to.eq(+beaconCount1);

								// Verify number of commands matches count in other tooltip view
								cy
									.get('[cy-test=timeline-beacon-command-count]')
									.invoke('text')
									.then((totalCommandCount2) => {
										cy.log(totalCommandCount2);
										expect(+totalCommandCount2).to.eq(+totalCommandCount1);
									});
							});

						// Log the beacon info showing in the tooltip
						// Start time
						cy
							.get('[cy-test=timeline-tooltip-date-time]')
							.invoke('text')
							.then((text) => {
								let timelineStartTime = text.split(' ')[1];
								cy.log(timelineStartTime);

								// Beacon name
								cy
									.get('[cy-test=timeline-beacon-name]')
									.invoke('text')
									.then((timelineBeaconName) => {
										cy.log(timelineBeaconName);

										// Operator username
										cy
											.get('[cy-test=timeline-beacon-operator]')
											.invoke('text')
											.then((timelineBeaconOperator) => {
												cy.log(timelineBeaconOperator);

												// Click on the beacon within the tooltip
												cy.get('[cy-test=timeline-beacon-name]').click();
												cy.wait(1000);

												// Verify that the info displayed on the left matches the beacon info in the tooltip
												// Beacon name
												cy
													.get('[cy-test=beaconName]')
													.invoke('text')
													.then((beaconName) => {
														cy.log(beaconName);
														expect(beaconName).to.eq(timelineBeaconName);

														// Operator username
														cy
															.get('[cy-test=userName]')
															.invoke('text')
															.then((userName) => {
																cy.log(userName);
																expect(userName).to.eq(timelineBeaconOperator);
															});

														// Commands
														// cy.get('[cy-test=command-date-time]').contains(timelineStartTime).its('length').then(commandCount => {
														// 	cy.log(commandCount)
														// 	// this sort of works -- but only counts the first instance where the time matches, not ALL instances
														// })
														cy
															.get('[cy-test=command-date-time]')
															.invoke('text')
															.then(($text) => {
																let count = $text.includes(timelineStartTime).its('length');
																cy.log(count);
															});
													});
											});
									});
							});
					});
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
