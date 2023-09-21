/// <reference types="cypress" />

describe('Verify Blue Team Version', () => {
	it('Should Only See Upload from File', () => {
		cy.get('[cy-test=add-campaign-btn]').click();

		cy.get('[cy-test=create-new-camp]').select(1);

		cy.get('[cy-test=bt-warning]')
			.should('be.visible')
			.and('contain.text', 'This upload source is not available in BlueTeam mode.');
	});
});
