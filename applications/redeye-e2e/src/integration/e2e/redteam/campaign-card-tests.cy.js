/// <reference types="cypress" />

describe('Search and filter campaigns and verify beacon counts', () => {
	const camp = 'campaigncard';
	const fileName = 'gt.redeye';
	const cmd = 'exit';

	it('Filter campaign card', () => {
		cy.uploadCampaign(camp, fileName);
		cy.searchForCampaign(camp);
		cy.get('[cy-test=search]').click().clear();
	});

	it('Open campaign to search', () => {
		cy.selectCampaign(camp);
		cy.clickSearch();
		cy.get('[cy-test=search]').click().type(cmd).type('{enter}');
		cy.get('[cy-test=search-result-item]').should('have.length.gt', 0).and('contain', cmd);
		cy.closeSearch();
	});

	it('Verify campaign card beacon number matches actual campaign', () => {
		cy.searchForCampaign(camp);
		let divNumber = '';
		cy.get('[cy-test=beacon-count]').then((number) => {
			divNumber = number.text().split(' ').shift();
			cy.get('[cy-test=beacon-count]').should('contain', divNumber);
		});
		cy.selectCampaign(camp);

		cy.clickBeaconsTab();

		cy.get('[data-test-id=virtuoso-item-list] [cy-test=beacons-row]')
			.its('length')
			.then((resultSearch1) => {
				expect(+divNumber).to.equal(resultSearch1);
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
