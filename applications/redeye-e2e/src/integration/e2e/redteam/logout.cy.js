/// <reference types="cypress" />

describe('Logout of application', () => {
	it('Verify logout function works', () => {
		cy.get('[cy-test=user]').click();
		cy.get('[cy-test=logout]').click();
		cy.get('[cy-test=login-form]').should('be.visible');
	});
});
