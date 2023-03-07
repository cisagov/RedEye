/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />

describe('Timeline tests', () => {
	const camp = '200817';

	it('Verify timeline features', () => {
		cy.get('[cy-test=add-campaign-btn]').click();

		cy.uploadLogs('seb', camp);

		cy.wait(500);

		cy.get('[cy-test=close-log]').click();

		cy.reload();

		cy.get('[cy-test=beacon-count]').invoke('text').should('contain', '4');

		cy.get('[cy-test=command-count]').invoke('text').should('contain', '7');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
