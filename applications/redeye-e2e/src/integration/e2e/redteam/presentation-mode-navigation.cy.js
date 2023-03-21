/// <reference types="cypress" />

describe('Presentation Mode Navigation', () => {
	const camp = 'presentationmode';
	const fileName = 'gt.redeye';

	it('Can navigate forward and backward in Presentation Mode', () => {
		// Upload and open campaign
		cy.uploadCampaign(camp, fileName);
		cy.selectCampaign(camp);

		// Go to Presentation Mode
		cy.clickPresentationMode();

		// Click "All Comments" to open presentation
		cy.get('[cy-test=all]').click();

		// Verify back button is disabled, Next button is enabled
		cy.get('[cy-test=previous-slide]').should('be.disabled');
		cy.get('[cy-test=next-slide]').should('be.enabled');

		// Log slide count - should be at 1 -- NEEDS WORK
		cy.get('[cy-test=slide-selector]').invoke('text').should('equal', '1');

		// Click "Next" three times
		cy.get('[cy-test=next-slide]').click().click().click();

		// Verify now on slide 4
		cy.get('[cy-test=slide-selector]').invoke('text').should('equal', '4');

		// Click back button twice
		cy.get('[cy-test=previous-slide]').click().click();

		// Verify now on slide 2
		cy.get('[cy-test=slide-selector]').invoke('text').should('equal', '2');
	});

	it('Can navigate to a specific slide using dropdown', () => {
		// Upload and open campaign
		cy.selectCampaign(camp);

		// Go to Presentation Mode
		cy.clickPresentationMode();

		// Click "All Comments" to open presentation
		cy.get('[cy-test=all]').click();

		// Select slide #3 from the dropdown options
		cy.get('[cy-test=slide-selector]').click();
		cy.get('[cy-test=slide-number-selector]').eq(2).click();

		// Verify you are on slide #3
		cy.get('[cy-test=slide-selector]').invoke('text').should('equal', '3');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
