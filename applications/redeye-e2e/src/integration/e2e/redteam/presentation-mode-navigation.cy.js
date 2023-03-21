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

		// Verify slide count starts at 1
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
		// Open campaign
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

	it('Can switch between presentations using the back arrow', () => {
		// Open campaign
		cy.selectCampaign(camp);

		// Go to Presentation Mode
		cy.clickPresentationMode();

		// Click "All Comments" to open presentation
		cy.get('[cy-test=all]').click();

		// Navigate through a few slides
		cy.get('[cy-test=next-slide]').click().click().click();

		// Click Back button to exit presentation
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
