/// <reference types="cypress" />

describe('Logout of application', () => {
	it('Verify logout function works', () => {
		cy.get('[cy-test=user]').realClick();
		cy.get('[cy-test=logout]').realClick();
		cy.get('[cy-test=login-form]').should('be.visible');
	});
});
