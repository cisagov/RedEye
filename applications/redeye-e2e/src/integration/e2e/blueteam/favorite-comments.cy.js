/// <reference types="cypress" />

describe('Cannot add comments to Favorites', () => {
	const camp = 'favcomments';
	const fileName = 'gt.redeye';

	it('Favorite comment button should be disabled', () => {
		cy.uploadCampaignBlue(camp, fileName);

		cy.selectCampaign(camp);

		cy.clickCommentsTab();

		cy.viewAllComments();

		cy.get('[cy-test=fav-comment]').should('be.disabled');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
