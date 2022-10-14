/// <reference types="cypress" />

describe('Rename campaign', () => {
	const camp = 'Rename';
	const fileName = 'gt.redeye';
	const rename = '_updated';

	it('Rename campaign', () => {
		cy.uploadCampaign(camp, fileName);

		cy.searchForCampaign(camp);

		cy.get('[cy-test=campaign-options]').click();

		cy.get('[cy-test=rename-campaign]').click();

		cy
			.get('[cy-test=new-campaign-name')
			.click()
			.type(rename, { force: true });

		cy.wait(100);

		cy.get('[cy-test=rename-button]').click();

		cy.get('[cy-test=campaign-name]').eq(0).should('contain', rename);

		cy.get('[cy-test=campaign-options]').eq(0).click();

		cy.get('[cy-test=rename-campaign]').click();

		cy
			.get('[cy-test=new-campaign-name')
			.click()
			.clear()
			.type(camp, { force: true });

		cy.wait(500);

		cy.get('[cy-test=rename-button]').click();

		cy.wait(500);

		cy.get('[cy-test=campaign-name]').eq(0).should('not.contain', rename);

		cy.get('[cy-test=search]').click().clear();

		cy.deleteCampaignGraphQL(camp);
	});
});
