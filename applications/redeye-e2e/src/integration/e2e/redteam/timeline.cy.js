/// <reference types="cypress" />

const dayjs = require('dayjs');
dayjs().format();

describe('Timeline tests', () => {
	const camp = 'timelinetests';
	const fileName = 'smalldata.redeye';

	it.skip('Verify timeline navigation features', () => {
		// Upload campaign and open
		cy.uploadCampaign(camp, fileName);

		cy.selectCampaign(camp);

		// Log the starting position of the timeline bar
		cy.get('[cy-test=timeline-scrubber]')
			.invoke('attr', 'x1') // @QA - we are now moving the scrubber using `style="transform:translateX(00px)"`, not `x1` & `x2`
			.as('timeline')
			.then((position1) => {
				// cy.log(position1);

				// Click Play and let the timeline run for a few seconds
				cy.timelinePlayPause();
				cy.wait(1500);

				// Pause the timeline and log its new position - should be different than the starting position
				cy.timelinePlayPause();
				cy.get('@timeline').then((position2) => {
					// cy.log(position2);
					expect(+position1).to.not.equal(+position2);

					cy.timelineBack();
					cy.wait(500);

					cy.get('@timeline').then((position3) => {
						// cy.log(position3);
						expect(+position3).to.be.lessThan(+position2);

						// Click the forward button to move the timeline ahead; verify it is more than the previous position
						cy.timelineForward().click();
						cy.get('@timeline').then((position4) => {
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

		// Update start and end dates
		cy.editTimelineDates();
		cy.changeTimelineStartDate('10/15/20');
		cy.changeTimelineEndDate('10/19/20');

		// Close date picker; verify new dates stuck
		cy.get('[cy-test=timeline-header]').click();
		cy.get('[cy-test=timeline-start-date]').invoke('text').should('contain', '10/15/20');
		cy.get('[cy-test=timeline-end-date]').invoke('text').should('contain', '10/19/20');

		// Reset dates for next test
		cy.resetTimelineDates();
	});

	it('Timeline tooltip info appears correctly', () => {
		// Open campaign
		cy.selectCampaign(camp);

		// Update start and end dates to narrow down timeline
		cy.editTimelineDates();
		cy.changeTimelineStartDate('10/13/20');
		cy.changeTimelineEndDate('10/13/20');

		// Hover over a bar on the timeline and verify that the first tooltip appears showing beacon/command info
		cy.get('[cy-test=timeline-bar]').eq(1).trigger('mouseover');
		cy.get('[cy-test=timeline-tooltip-info]').should('be.visible');
		// cy.get('[cy-test=timeline-beacons]').should('be.visible');
		// cy.get('[cy-test=timeline-beacon-count]').should('be.visible');
		// cy.get('[cy-test=timeline-total-commands]').should('be.visible');
		// cy.get('[cy-test=timeline-total-command-count]').should('be.visible');
		// cy.get('[cy-test=timeline-active-beacons]').should('be.visible');
		// cy.get('[cy-test=timeline-active-beacon-count]').should('be.visible');

		// Click on the timeline bar and verify that the second tooltip appears showing beacon details
		// cy.get('[cy-test=timeline-bar]').eq(1).click();
		// cy.get('[cy-test=timeline-tooltip-info]').should('be.visible');
		// cy.get('[cy-test=timeline-beacon-header]').should('be.visible');
		// cy.get('[cy-test=timeline-command-header]').should('be.visible');
		// cy.get('[cy-test=timeline-beacon-name]').should('be.visible');
		// cy.get('[cy-test=timeline-beacon-operator]').should('be.visible');
		// cy.get('[cy-test=timeline-beacon-command-count]').should('be.visible');

		// Reset dates for next test
		cy.resetTimelineDates();
	});

	it('Information mactches in the two tooltip views', () => {
		// Open campaign
		cy.selectCampaign(camp);

		// Update start and end dates to narrow down timeline
		cy.editTimelineDates();
		cy.changeTimelineStartDate('10/13/20');
		cy.changeTimelineEndDate('10/13/20');

		// Hover to show the first tooltip
		cy.get('[cy-test=timeline-bar]').eq(1).trigger('mouseover');

		// Log information in the first tooltip that appears
		// cy
		// 	.get('[cy-test=timeline-beacon-count]')
		// 	.invoke('text')
		// 	.then((beaconCount1) => {
		// 		cy
		// 			.get('[cy-test=timeline-total-command-count]')
		// 			.invoke('text')
		// 			.then((totalCommandCount1) => {
		// 				// Click to change to second tooltip view
		// 				cy.get('[cy-test=timeline-bar]').eq(1).click();

		// 				// Log information in the second tooltip and verify it matches the first
		// 				cy
		// 					.get('[cy-test=timeline-beacon-name]')
		// 					.its('length')
		// 					.then((beaconCount2) => {
		// 						expect(+beaconCount2).to.eq(+beaconCount1);

		// 						cy
		// 							.get('[cy-test=timeline-beacon-command-count]')
		// 							.eq(0)
		// 							.invoke('text')
		// 							.then((totalCommandCount2) => {
		// 								cy
		// 									.get('[cy-test=timeline-beacon-command-count]')
		// 									.eq(1)
		// 									.invoke('text')
		// 									.then((totalCommandCount3) => {
		// 										expect(+totalCommandCount2 + +totalCommandCount3).to.eq(+totalCommandCount1);
		// 									});
		// 							});
		// 					});
		// 			});
		// 	});
		// Reset dates for next test
		cy.resetTimelineDates();
	});

	it('Clicking beacon info in tooltip displays the correct beacon info', () => {
		// Open campaign
		cy.selectCampaign(camp);

		// Update start and end dates to narrow down timeline
		cy.editTimelineDates();
		cy.changeTimelineStartDate('10/13/20');
		cy.changeTimelineEndDate('10/13/20');

		// Hover to show the first tooltip
		cy.get('[cy-test=timeline-bar]').eq(1).trigger('mouseover');

		// Click to switch to clickable tooltip
		cy.get('[cy-test=timeline-bar]').eq(1).click();

		// Click to open beacon info
		// cy.get('[cy-test=timeline-beacon-name]').eq(1).click();
		// cy.wait(1000);

		// // Verify timeline beacon name matches beacon info
		// cy
		// 	.get('[cy-test=timeline-beacon-name]')
		// 	.eq(1)
		// 	.invoke('text')
		// 	.then((timelineBeaconName) => {
		// 		// cy.log(timelineBeaconName);

		// 		cy
		// 			.get('[cy-test=beaconName]')
		// 			.invoke('text')
		// 			.then((beaconName) => {
		// 				// cy.log(beaconName);
		// 				expect(beaconName).to.eq(timelineBeaconName);
		// 			});
		// 	});

		// Verify timeline beacon operator matches beacon info
		// cy
		// 	.get('[cy-test=timeline-beacon-operator]')
		// 	.eq(1)
		// 	.invoke('text')
		// 	.then((timelineBeaconOperator) => {
		// 		// cy.log(timelineBeaconOperator);

		// 		cy
		// 			.get('[cy-test=userName]')
		// 			.invoke('text')
		// 			.then((userName) => {
		// 				// cy.log(userName);
		// 				expect(userName).to.eq(timelineBeaconOperator);
		// 			});
		// 	});

		// Verify tooltip date matches beacon info (log month and day, then concat -- don't want the year for this test)
		cy.get('[cy-test=timeline-tooltip-date-time]')
			.invoke('text')
			.then((tooltipMonth) => {
				const timelineMonth = tooltipMonth.split('/')[0];

				cy.get('[cy-test=timeline-tooltip-date-time]')
					.invoke('text')
					.then((tooltipDay) => {
						const timelineDay = tooltipDay.split('/')[1];

						const month = timelineMonth;
						const day = timelineDay;
						const timelineDate = month.concat('/').concat(day);

						// cy.get('[cy-test=command-date-time]').each(($date) => {
						// 	expect($date.text()).to.contain(timelineDate);
						// });
					});
			});

		// Verify commands are within the tooltip start/end times

		// Log the tooltip date (incl. year):
		cy.get('[cy-test=timeline-tooltip-date-time]')
			.invoke('text')
			.then((ttDate) => {
				const tooltipDate = ttDate.split(' ')[0];

				// Log the tooltip start time; concatenate with date; convert to Unix:
				cy.get('[cy-test=timeline-tooltip-date-time]')
					.invoke('text')
					.then((text1) => {
						const timelineStartTime = text1.split(' ')[1];
						const timelineStart = tooltipDate.concat(' ').concat(timelineStartTime);
						const timelineStartUnix = dayjs(timelineStart).unix();

						// Log the tooltip end time; concatenate with date; convert to Unix:
						cy.get('[cy-test=timeline-tooltip-date-time]')
							.invoke('text')
							.then((text2) => {
								const timelineEndTime = text2.split(' ')[3];
								const timelineEnd = tooltipDate.concat(' ').concat(timelineEndTime);
								const timelineEndUnix = dayjs(timelineEnd).unix();

								// Verfy all times are within the appropriate timeframe
								// cy.get('[cy-test=command-header]').each(($lineDate) => {
								// 	const commandInfo = $lineDate.attr('title').split(' <')[0];
								// 	const commandInfoUnix = dayjs(commandInfo).unix();
								// 	expect(commandInfoUnix).to.be.gte(timelineStartUnix).and.to.be.lte(timelineEndUnix);
								// });
							});
					});
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
