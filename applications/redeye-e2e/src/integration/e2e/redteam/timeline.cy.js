/// <reference types="cypress" />

const dayjs = require('dayjs');
dayjs().format();

describe('Timeline tests', () => {
	const camp = 'timelinetests';
	const fileName = 'smalldata.redeye';
	const camp2 = 'timelinepositions';
	const fileName2 = 'gt.redeye';

	it('Verify timeline navigation features', () => {
		// Upload campaign and open
		cy.uploadCampaign(camp2, fileName2);
		cy.selectCampaign(camp2);

		// Log the starting position of the timeline bar
		cy.get('[cy-test=timeline-scrubber]')
			.invoke('attr', 'style')
			.as('timeline')
			.then((text1) => {
				const pattern1 = /[0-9]+/g;
				const position1 = text1.match(pattern1)[0];

				// Verify "All Time" toggle is on
				cy.get('[cy-test=all-time-switch]').should('be.checked');

				// Click Play and let the timeline run for a few seconds
				cy.timelinePlayPause();
				cy.wait(1000);

				// Pause the timeline and log its new position - should be different than the starting position
				cy.timelinePlayPause();
				cy.wait(1000);
				cy.get('@timeline').then((text2) => {
					const pattern2 = /[0-9]+/g;
					const position2 = text2.match(pattern2)[0];

					expect(+position1).to.not.equal(+position2);

					// Verify "All Time" toggle is off
					cy.get('[cy-test=all-time-switch]').should('not.be.checked');

					// Click the back button to move the timeline backward; verify its position is less than the previous position
					cy.timelineBack();
					cy.wait(1000);

					cy.get('@timeline').then((text3) => {
						const pattern3 = /[0-9]+/g;
						const position3 = text3.match(pattern3)[0];

						expect(+position3).to.be.lessThan(+position2);

						// Click the forward button to move the timeline ahead; verify its position is more than the previous position
						cy.timelineForward().click();
						cy.get('@timeline').then((text4) => {
							const pattern4 = /[0-9]+/g;
							const position4 = text4.match(pattern4)[0];

							expect(+position4).to.be.greaterThan(+position3);
						});
					});
				});
			});
		// Delete campaign
		cy.deleteCampaignGraphQL(camp2);
	});

	it('Change timeline dates', () => {
		// Upload campaign and open
		cy.uploadCampaign(camp, fileName);
		cy.selectCampaign(camp);

		// Update start and end dates
		cy.editTimelineDates();
		cy.changeTimelineStartDate('10/15/20');
		cy.changeTimelineEndDate('10/19/20' + '{enter}');

		// Close date picker; verify new dates stuck
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
		cy.changeTimelineEndDate('10/13/20{enter}');

		// Hover over a bar on the timeline and verify that the condensed tooltip info appears
		cy.get('[cy-test=timeline-bar]').eq(1).trigger('mouseover');
		cy.get('[cy-test=timeline-tooltip-info]').should('be.visible');
		cy.get('[cy-test=timeline-beacon-count]').should('be.visible');
		cy.get('[cy-test=timeline-show-more-less]').should('be.visible');

		// Click "Show More" and verify that the additional information appears showing beacon details
		cy.get('[cy-test=timeline-show-more-less]').click();
		cy.get('[cy-test=timeline-tooltip-info]').should('be.visible');
		cy.get('[cy-test=timeline-tooltip-date-time]').should('be.visible');
		cy.get('[cy-test=timeline-beacon-count]').should('be.visible');
		cy.get('[cy-test=timeline-beacon-name]').should('be.visible');
		cy.get('[cy-test=timeline-beacon-command-count]').should('be.visible');
		cy.get('[cy-test=timeline-show-more-less]').should('be.visible');

		// Reset dates for next test
		cy.resetTimelineDates();
	});

	it('Clicking beacon info in tooltip displays the correct beacon info', () => {
		// Open campaign
		cy.selectCampaign(camp);

		// Update start and end dates to narrow down timeline
		cy.editTimelineDates();
		cy.changeTimelineStartDate('10/13/20');
		cy.changeTimelineEndDate('10/13/20{enter}');

		// Hover to show the tooltip
		cy.get('[cy-test=timeline-bar]').eq(1).trigger('mouseover');

		// Show the beacon names
		cy.get('[cy-test=timeline-show-more-less]').click();

		// Click to open beacon info for the second one showing
		cy.get('[cy-test=timeline-beacon-name]').eq(1).click();
		cy.wait(1000);

		// Verify timeline beacon name matches beacon info
		cy.get('[cy-test=timeline-beacon-name]')
			.eq(1)
			.invoke('text')
			.then((timelineName) => {
				const timelineBeaconName = timelineName.split(' / ')[1];
				cy.log(timelineBeaconName);

				cy.get('[cy-test=panel-header]')
					.invoke('text')
					.then((beaconName) => {
						// cy.log(beaconName);
						expect(beaconName).to.eq(timelineBeaconName);
					});
			});

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

						cy.get('[cy-test=command-date-time]').each(($date) => {
							expect($date.text()).to.contain(timelineDate);
						});
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
								cy.get('[cy-test=command-header]').each(($lineDate) => {
									const commandInfo = $lineDate.attr('title').split(' <')[0];
									const commandInfoUnix = dayjs(commandInfo).unix();
									expect(commandInfoUnix).to.be.gte(timelineStartUnix).and.to.be.lte(timelineEndUnix);
								});
							});
					});
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
