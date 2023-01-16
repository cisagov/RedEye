/// <reference types="cypress" />

describe('Duplicate Campaign', () => {
	const camp = 'duplicatecampaign';
	const camp1 = 'DuplicateCampaign';
	const camp2 = 'duplicateCampaign';
	const camp3 = 'DUPLICATECAMPAIGN';
	const fileName = 'gt.redeye';

	it('Try to create a campaign with the same name as another using different cases', () => {
		// Upload campaign to ensure one is available
		cy.uploadCampaignBlue(camp, fileName);

		// Search for new campaign by name
		cy.searchForCampaign(camp);

		// Upload another campaign with the same name
		cy.get('[cy-test=add-campaign-btn]').click();
		cy.get('[cy-test=new-camp-name]').click().type(camp);
		cy.fixture(fileName, { encoding: null }).as('myFixture');
		cy.get('[cy-test=browse-for-file]').selectFile('@myFixture');
		cy.get('[cy-test=import-database]').should('be.disabled');

		// Try using the same name but different case
		cy.get('[cy-test=new-camp-name]').click().clear().type(camp1);
		cy.get('[cy-test=browse-for-file]').selectFile('@myFixture');
		cy.get('[cy-test=import-database]').should('be.disabled');

		// Try using the same name but different case
		cy.get('[cy-test=new-camp-name]').click().clear().type(camp2);
		cy.get('[cy-test=browse-for-file]').selectFile('@myFixture');
		cy.get('[cy-test=import-database]').should('be.disabled');

		// Try using the same name but different case
		cy.get('[cy-test=new-camp-name]').click().clear().type(camp3);
		cy.get('[cy-test=browse-for-file]').selectFile('@myFixture');
		cy.get('[cy-test=import-database]').should('be.disabled');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
