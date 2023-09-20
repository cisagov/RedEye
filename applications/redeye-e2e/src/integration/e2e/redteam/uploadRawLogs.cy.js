/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />

describe('Upload raw log', () => {
	const camp = '200817';

	it('Upload raw log and verify counts', () => {
		cy.get('[cy-test=add-campaign-btn]').click();

		cy.get('[cy-test=create-new-camp]').select(1);

		cy.uploadLogs('seb', camp, 'cobalt-strike-parser');

		cy.wait(500);

		cy.get('[cy-test=close-log]').click();

		cy.reload();

		cy.get('[cy-test=beacon-count]', { timeout: 25000 }).invoke('text').should('contain', '3');

		cy.get('[cy-test=command-count]').invoke('text').should('contain', '7');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
