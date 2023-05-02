/// <reference types="cypress" />

describe('Delete Campaigns', () => {
	const camp = 'deletecampaign';
	const fileName = 'gt.redeye';

	it('Delete a campaign', () => {
		// Upload campaign to ensure one is available
		cy.uploadCampaign(camp, fileName);

		// Search for new campaign by name
		cy.searchForCampaign(camp);

		// Start the delete process but cancel to ensure Cancel button works
		cy.get('[cy-test=campaign-options]').realClick();
		cy.get('[cy-test=delete-campaign]').realClick();
		cy.contains('Cancel').realClick();
		cy.get('[cy-test=campaign-card]').should('contain', camp);

		// Delete campaign
		cy.get('[cy-test=search]').realClick().clear({ force: true });
		cy.wait(1000);
		cy.deleteCampaign(camp);

		cy.reload();

		// // deleted campaign should not be there
		cy.get('[cy-test=campaign-card]').should('not.exist');
	});
});
