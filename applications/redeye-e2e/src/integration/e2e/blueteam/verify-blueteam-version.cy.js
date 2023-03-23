/// <reference types="cypress" />

describe('Verify Blue Team Version', () => {
	it('Should Only See Upload from File', () => {
		cy.get('[cy-test=add-campaign-btn]').click();

		cy.get('[cy-test=upload-from-file]').should('be.visible');

		cy.get('[cy-test=create-new-camp]').click();

		cy.get('[cy-test=blue-team-source-warning]').should('be.visible');
	});
});
