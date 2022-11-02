/// <reference types="cypress" />

describe('Command row navigation', () => {
	const camp = 'commandrownav';
	const fileName = 'gt.redeye';

	it('Quicklink breadcrumbs should navigate to command row page destination; Host link should not be clickable', () => {
		cy.uploadCampaign(camp, fileName);

		// Open campaign and select a Host (log Host name)
		cy.selectCampaign(camp);
		cy
			.get('[cy-test=hostName]')
			.eq(1)
			.invoke('text')
			.then((hostName1) => {
				// cy.log(hostName1);

				cy.get('[cy-test=info-row]').eq(1).click();
				cy.get('[cy-test=header]').should('contain', hostName1);

				// Select a command to expand details; verify its background is colored differently
				cy.expandInfoRow(0);
				cy.get('[cy-test=hostBeaconInfo]').should('contain', hostName1);
				cy.get('[cy-test=info-row]').eq(0).should('have.css', 'background-color').and('eq', 'rgb(66, 66, 66)');

				// Click Host name and confirm page does not change
				cy.url().then((currentURL1) => {
					// cy.log(currentURL1);

					cy.get('[cy-test=hostBeaconInfo] > li').contains(hostName1).click();

					cy.url().then((currentURL2) => {
						// cy.log(currentURL2);
						expect(currentURL2).to.equal(currentURL1);

						// Click Command name and confirm page changes and goes to the correct command
						cy
							.get('[cy-test=hostBeaconInfo] > li')
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
		cy
			.get('[cy-test=hostName]')
			.eq(1)
			.invoke('text')
			.then((hostName1) => {
				// cy.log(hostName1);

				// Click Comments tab
				cy.clickCommentsTab();

				// Expand comment details, log details, and click on Host name
				cy.get('[cy-test=expand]').eq(0).click();
				cy
					.get('[cy-test=info-row]')
					.eq(0)
					.invoke('text')
					.then((text) => {
						let commentText = text.split(' ')[1];
						// cy.log(commentText);

						cy.get('[cy-test=hostBeaconInfo] > li').contains(hostName1).click();

						// Page should navigate back to Host/Commands tab -- Host name at top, Commands tab selected
						cy.get('[cy-test=header]').should('contain', hostName1);
						cy.get('[cy-test=commands]').eq(0).invoke('attr', 'tabindex').should('equal', '0');
						cy.get('[cy-test=info-row]').eq(11).should('have.css', 'background-color').and('eq', 'rgb(66, 66, 66)');

						// FUTURE IMPROVEMENT: WOULD LIKE A BETTER WAY OF SELECTING THE HIGHLIGHTED ROW SO I DON'T HAVE TO SPECIFY WHICH ROW SHOULD BE COLORED DIFFERENTLY.
						// CODE BELOW GETS THE CORRECT ROW BUT SELECTS THE TEXT COLOR INSTEAD OF THE FULL ROW COLOR, SO RGB CODES DON'T MATCH.
						// cy
						// 	.get('[cy-test=command-info]')
						// 	.contains(commentText)
						// 	.should('have.css', 'background-color')
						// 	.and('eq', 'rgb(66, 66, 66)');
					});
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
