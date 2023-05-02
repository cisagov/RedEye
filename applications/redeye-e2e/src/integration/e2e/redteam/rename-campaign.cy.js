/// <reference types="cypress" />

describe('Rename campaign', () => {
	const camp = 'Rename';
	const fileName = 'gt.redeye';
	const rename = '_updated';

	it('Rename campaign', () => {
		cy.uploadCampaign(camp, fileName);

		cy.searchForCampaign(camp);

		cy.get('[cy-test=campaign-options]').realClick();

		cy.get('[cy-test=rename-campaign]').realClick();

		cy.get('[cy-test=new-campaign-name').realClick().realType(rename, { force: true });

		cy.wait(100);

		cy.get('[cy-test=rename-button]').realClick();

		cy.get('[cy-test=campaign-name]').eq(0).should('contain', rename);

		cy.get('[cy-test=campaign-options]').eq(0).realClick();

		cy.get('[cy-test=rename-campaign]').realClick();

		cy.get('[cy-test=new-campaign-name').realClick().clear().realType(camp, { force: true });

		cy.wait(500);

		cy.get('[cy-test=rename-button]').realClick();

		cy.wait(500);

		cy.get('[cy-test=campaign-name]').eq(0).should('not.contain', rename);

		cy.get('[cy-test=search]').realClick().clear();

		cy.deleteCampaignGraphQL(camp);
	});
});
