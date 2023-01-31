/// <reference types="cypress" />

const { Time } = require('@blueprintjs/icons/lib/esm/generated/16px/paths');
const { time } = require('console');

describe('Timeline tests', () => {
	const camp = '200817';
	// const fileName = 'gt.redeye';

	it('Verify timeline navigation features', () => {
		// cy.uploadCampaign(camp, fileName);

		// Upload campaign and open
		cy.get('[cy-test=add-campaign-btn]').click();
		cy.uploadLogs('cypress', camp);
		cy.wait(500);
		cy.get('[cy-test=close-log]').click();
		cy.reload();
		cy.wait(7000);

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

	it('Change timeline dates', () => {
		// Open campaign
		cy.selectCampaign(camp);
		cy.get('[cy-test=timeline]').should('be.visible');

		// Update start and end dates - note: need to add data selectors for start/end dates
		cy.get('[cy-test=timeline-dates]').click();
		cy.get('.bp4-input').eq(0).click().clear().type('10/15/20');
		cy.get('.bp4-input').eq(1).click().clear().type('10/19/20');

		// Close date picker; verify new dates stuck
		cy.get('[cy-test=timeline-header]').click();
		cy.get('[cy-test=timeline-start-date]').invoke('text').should('contain', '10/15/20');
		cy.get('[cy-test=timeline-end-date]').invoke('text').should('contain', '10/19/20');

		// Reset dates for next test
		cy.get('[cy-test=reset-timeline-dates]');
	});

	it('Timeline tooltip info appears correctly', () => {
		// Open campaign
		cy.selectCampaign(camp);
		cy.get('[cy-test=timeline]').should('be.visible');

		// Update start and end dates to narrow down timeline
		cy.get('[cy-test=timeline-dates]').click();
		cy.get('.bp4-input').eq(0).click().clear().type('10/13/20');
		cy.get('.bp4-input').eq(1).click().clear().type('10/13/20');

		// Hover over a bar on the timeline and verify that the first tooltip appears showing beacon/command info
		cy.get('[cy-test=timeline-bar]').eq(1).trigger('mouseover');
		cy.get('[cy-test=timeline-tooltip-static]').should('be.visible');
		cy.get('[cy-test=timeline-beacons]').should('be.visible');
		cy.get('[cy-test=timeline-beacon-count]').should('be.visible');
		cy.get('[cy-test=timeline-total-commands]').should('be.visible');
		cy.get('[cy-test=timeline-total-command-count]').should('be.visible');
		cy.get('[cy-test=timeline-active-beacons]').should('be.visible');
		cy.get('[cy-test=timeline-active-beacon-count]').should('be.visible');

		// Click on the timeline bar and verify that the second tooltip appears showing beacon details
		cy.get('[cy-test=timeline-bar]').eq(1).click();
		cy.get('[cy-test=timeline-tooltip-clickable]').should('be.visible');
		cy.get('[cy-test=timeline-beacon-header]').should('be.visible');
		cy.get('[cy-test=timeline-command-header]').should('be.visible');
		cy.get('[cy-test=timeline-beacon-name]').should('be.visible');
		cy.get('[cy-test=timeline-beacon-operator]').should('be.visible');
		cy.get('[cy-test=timeline-beacon-command-count]').should('be.visible');

		// Reset dates for next test
		cy.get('[cy-test=reset-timeline-dates]');
	});

	it('Information mactches in the two tooltip views', () => {
		// Open campaign
		cy.selectCampaign(camp);
		cy.get('[cy-test=timeline]').should('be.visible');

		// Update start and end dates to narrow down timeline
		cy.get('[cy-test=timeline-dates]').click();
		cy.get('.bp4-input').eq(0).click().clear().type('10/13/20');
		cy.get('.bp4-input').eq(1).click().clear().type('10/13/20');

		// Hover to show the first tooltip
		cy.get('[cy-test=timeline-bar]').eq(1).trigger('mouseover');

		// Log information in the first tooltip that appears
		cy
			.get('[cy-test=timeline-beacon-count]')
			.invoke('text')
			.then((beaconCount1) => {
				// cy.log(beaconCount1);

				cy
					.get('[cy-test=timeline-total-command-count]')
					.invoke('text')
					.then((totalCommandCount1) => {
						// cy.log(totalCommandCount1);

						// Click to change to second tooltip view
						cy.get('[cy-test=timeline-bar]').eq(1).click();

						// Log information in the second tooltip and verify it matches the first
						cy
							.get('[cy-test=timeline-beacon-name]')
							.its('length')
							.then((beaconCount2) => {
								// cy.log(beaconCount2);
								expect(+beaconCount2).to.eq(+beaconCount1);

								cy
									.get('[cy-test=timeline-beacon-command-count]')
									.eq(0)
									.invoke('text')
									.then((totalCommandCount2) => {
										// cy.log(totalCommandCount2);
										cy
											.get('[cy-test=timeline-beacon-command-count]')
											.eq(1)
											.invoke('text')
											.then((totalCommandCount3) => {
												// cy.log(totalCommandCount3);

												expect(+totalCommandCount2 + +totalCommandCount3).to.eq(+totalCommandCount1);
											});
									});
							});
					});
			});
		// Reset dates for next test
		cy.get('[cy-test=reset-timeline-dates]');
	});

	it('Clicking beacon info in tooltip opens the correct beacon', () => {
		// Open campaign
		cy.selectCampaign(camp);
		cy.get('[cy-test=timeline]').should('be.visible');

		// Update start and end dates to narrow down timeline
		cy.get('[cy-test=timeline-dates]').click();
		cy.get('.bp4-input').eq(0).click().clear().type('10/13/20');
		cy.get('.bp4-input').eq(1).click().clear().type('10/13/20');

		// Hover to show the first tooltip
		cy.get('[cy-test=timeline-bar]').eq(1).trigger('mouseover');

		// Click to switch to clickable tooltip
		cy.get('[cy-test=timeline-bar]').eq(1).click();

		// Log the info showing in the toolip
		cy
			.get('[cy-test=timeline-tooltip-date-time]')
			.invoke('text')
			.then((month) => {
				const timelineMonth = month.split('/')[0];
				cy.log(timelineMonth);
				cy
					.get('[cy-test=timeline-tooltip-date-time]')
					.invoke('text')
					.then((day) => {
						const timelineDay = day.split('/')[1];
						cy.log(timelineDay);

						cy
							.get('[cy-test=timeline-tooltip-date-time]')
							.invoke('text')
							.then((text1) => {
								const timelineStartTime = text1.split(' ')[1];
								cy.log(timelineStartTime);

								cy
									.get('[cy-test=timeline-tooltip-date-time]')
									.invoke('text')
									.then((text2) => {
										const timelineEndTime = text2.split(' ')[3];
										cy.log(timelineEndTime);

										cy
											.get('[cy-test=timeline-beacon-name]')
											.eq(1)
											.invoke('text')
											.then((timelineBeaconName) => {
												// cy.log(timelineBeaconName);

												cy
													.get('[cy-test=timeline-beacon-operator]')
													.eq(1)
													.invoke('text')
													.then((timelineBeaconOperator) => {
														// cy.log(timelineBeaconOperator);

														cy
															.get('[cy-test=timeline-beacon-command-count]')
															.eq(1)
															.invoke('text')
															.then((timelineCommandCount) => {
																// cy.log(timelineCommandCount);

																// Click to open beacon info
																cy.get('[cy-test=timeline-beacon-name]').eq(1).click();
																cy.wait(1000);

																// Verify information that opens matches tooltip
																cy
																	.get('[cy-test=beaconName]')
																	.invoke('text')
																	.then((beaconName) => {
																		// cy.log(beaconName);
																		expect(beaconName).to.eq(timelineBeaconName);

																		cy
																			.get('[cy-test=userName]')
																			.invoke('text')
																			.then((userName) => {
																				// cy.log(userName);
																				expect(userName).to.eq(timelineBeaconOperator);

																				const month = timelineMonth;
																				const day = timelineDay;
																				const timelineDate = month.concat('/').concat(day);
																				cy.get('[cy-test=command-date-time]').each(($menu) => {
																					expect($menu.text()).to.contain(timelineDate);

																				// WIP -- want to compare the times showning and make sure they're within the range in the tooltip
																					// cy
																				// 	.get('[cy-test=command-date-time]')
																				// 	.eq(0)
																				// 	.invoke('text')
																				// 	.then((time1) => {
																				// 		const command1 = time1.split(' ')[1];
																				// 		cy.log(command1);
																				// 		// const timeCommand1 = new Date(command1)
																				// 		// cy.log(timeCommand1)
																				// 		// expect(timeCommand1).to.be.gte(start).and.to.be.lte(end)

																				// 		const start = new Time(timelineStartTime);
																				// 		const end = new Time(timelineEndTime);
																				// 		const timeCommand1 = new Time(command1);

																				// 		cy.log(start)
																				// 		cy.log(end)
																				// 		cy.log(timeCommand1)

																				// 		// expect(timeCommand1).to.be.gte(start).and.to.be.lte(end);
																					});

																				// });
																			});
																	});
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
