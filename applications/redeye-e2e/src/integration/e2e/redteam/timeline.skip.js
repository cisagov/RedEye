/// <reference types="cypress" />

describe('Timeline tests', () => {
	const camp = 'timeline';
	const fileName = 'testdata.redeye';

	it.only('Verify timeline features', () => {
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
				cy.get('[cy-test=timeline-play-pause]').click();

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
		cy.get('.bp4-input').eq(0).click().clear().type('10/12/20');
		cy.get('.bp4-input').eq(1).click().clear().type('11/09/20');

		// Close date picker; verify new dates stuck
		cy.get('[cy-test=timeline-header]').click();
		cy.get('[cy-test=timeline-dates]').invoke('text').should('contain', '10/12/20').and('contain', '11/09/20');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
