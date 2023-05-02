/// <reference types="cypress" />

function selectHost(index) {
	cy.get('[cy-test=hostName]').eq(index).realClick();
	cy.get('[cy-test=command-header]').should('be.visible');
}

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
				cy.get('[cy-test=info-row]').eq(1).realClick();
				cy.get('[cy-test=header]').should('contain', hostName1);

				// Select a command to expand details; verify its background is colored differently
				cy.expandInfoRow(0);
				cy.get('[cy-test=hostBeaconInfo]').should('contain', hostName1);
				cy.get('[cy-test=info-row]').eq(0).should('have.css', 'background-color');

				// Click Host name and confirm page does not change
				cy.url().then((currentURL1) => {
					cy.get('[cy-test=hostBeaconInfo] > li').contains(hostName1).realClick();

					cy.url().then((currentURL2) => {
						expect(currentURL2).to.equal(currentURL1);

						// Click Command name and confirm page changes and goes to the correct command
						cy.get('[cy-test=hostBeaconInfo] > li')
							.last()
							.invoke('text')
							.then((commandName1) => {
								cy.get('[cy-test=hostBeaconInfo] > li').last().realClick();

								cy.get('[cy-test=beacon-username]').should('contain', commandName1);
								cy.url().then((currentURL3) => {
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
				// Click Comments tab
				cy.clickCommentsTab();

				// Expand comment details, log details, and click on Host name
				cy.get('[cy-test=expand]').eq(0).realClick();
				cy.get('[cy-test=info-row]')
					.eq(0)
					.invoke('text')
					.then((text) => {
						let commentText = text.split(' ')[1];

						cy.get('[cy-test=hostBeaconInfo] > li').contains(hostName1).realClick();

						// Page should navigate back to Host/Commands tab -- Host name at top, Commands tab selected
						cy.get('[cy-test=header]').should('contain', hostName1);
						cy.get('[cy-test=commands]').eq(0).invoke('attr', 'tabindex').should('equal', '0');
						cy.get('[cy-test=info-row]').eq(11).should('have.css', 'background-color');
					});
			});
	});

	it('Command row should expand when clicked', () => {
		// Select the campaign and open a host to view the commands
		cy.selectCampaign(camp);
		selectHost(1);

		// Log the starting height of the first command in the list
		cy.get('[cy-test=command-info]')
			.eq(0)
			.invoke('height')
			.then((startingHeight1) => {
				// Click to expand; verify that the height increased
				cy.get('[cy-test=command-info]')
					.eq(0)
					.realClick()
					.invoke('height')
					.then((expandedHeight1) => {
						expect(expandedHeight1).to.be.gt(startingHeight1);
					});
			});
	});

	it('Expanded rows should not collapse when another is expanded', { scrollBehavior: false }, () => {
		// Select the campaign and open a host to view the commands
		cy.selectCampaign(camp);
		selectHost(1);

		// Click first line to expand; log height
		cy.get('[cy-test=command-info]')
			.eq(0)
			.realClick()
			.invoke('height')
			.then((expandedHeight1) => {
				// Click third line to expand; verify height of first line did not change
				cy.get('[cy-test=command-info]').eq(4).realClick();

				cy.get('[cy-test=command-info]')
					.eq(0)
					.invoke('height')
					.then((verifyHeight1) => {
						expect(verifyHeight1).to.eq(expandedHeight1);
					});
			});
	});

	it('Collapse All button should collapse all expanded rows', { scrollBehavior: false }, () => {
		// Select the campaign and open a host to view the commands
		cy.selectCampaign(camp);
		selectHost(1);

		// Log starting height of rows (all are euqual so logging first one only)
		cy.get('[cy-test=command-info]')
			.eq(0)
			.invoke('height')
			.then((startingRowHeight) => {
				// Click to expand first 3 rows
				cy.get('[cy-test=command-info]').eq(0).realClick();
				cy.get('[cy-test=command-info]').eq(2).realClick();
				cy.get('[cy-test=command-info]').eq(4).realClick();

				// Log new height of rows; should be larger than starting height
				cy.get('[cy-test=command-info]')
					.eq(0)
					.invoke('height')
					.then((expandedRow1) => {
						expect(expandedRow1).to.be.gt(startingRowHeight);

						cy.get('[cy-test=command-info]')
							.eq(2)
							.invoke('height')
							.then((expandedRow2) => {
								expect(expandedRow2).to.be.gt(startingRowHeight);

								cy.get('[cy-test=command-info]')
									.eq(4)
									.invoke('height')
									.then((expandedRow3) => {
										expect(expandedRow3).to.be.gt(startingRowHeight);

										// Click "Collapse All" button
										cy.get('[cy-test=collapse-all]').realClick();

										// Log new heights; should equal starting height
										cy.get('[cy-test=command-info]')
											.eq(0)
											.invoke('height')
											.then((collapsedRow1) => {
												expect(collapsedRow1).to.eq(startingRowHeight);

												cy.get('[cy-test=command-info]')
													.eq(2)
													.invoke('height')
													.then((collapsedRow2) => {
														expect(collapsedRow2).to.eq(startingRowHeight);

														cy.get('[cy-test=command-info]')
															.eq(4)
															.invoke('height')
															.then((collapsedRow3) => {
																expect(collapsedRow3).to.eq(startingRowHeight);
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
