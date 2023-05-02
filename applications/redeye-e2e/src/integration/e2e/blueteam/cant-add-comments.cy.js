/// <reference types="cypress" />

describe('Verify Adding Comments are disabled, but able to view exisiting comments', () => {
	const camp = 'cannotaddcomments';
	const fileName = 'gt.redeye';

	it('Cannot Add Comments', () => {
		cy.uploadCampaignBlue(camp, fileName);

		cy.selectCampaign(camp);

		cy.selectHostByName('COMPUTER02');

		//Click on first visible add comment button
		cy.get('[cy-test=add-comment]').should('be.visible').first().realClick();

		//Comment box should not exist
		cy.get('[cy-test=comment-input]').should('not.exist');

		//Favorite button should be disabled
		cy.get('[cy-test=fav-comment]').should('be.disabled');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
