/// <reference types="cypress" />

describe('Favorite comments', () => {
	const camp = 'favcomments';
	const fileName = 'gt.redeye';

	it('Add a comment and mark it as a favorite', () => {
		cy.uploadCampaign(camp, fileName);

		cy.selectCampaign(camp);

		// log current number of favorited comments
		cy.clickPresentationMode();

		cy
			.get('[cy-test=favorited] [cy-test=count]')
			.invoke('text')
			.then((resultFavoriteCount1) => {
				//create a new comment and mark it as a favorite
				cy.returnToCampaignCard();

				cy.selectCampaign(camp);

				cy.clickCommandTypesTab();

				cy.selectCommandType('dcsync');

				cy.addNewComment('0', 'Favorite comment', 'favorite');

				cy.favoriteComment(0);

				// log new number of favorited comments and compare to original count
				cy.clickPresentationMode();

				cy.wait(500);

				cy
					.get('[cy-test=favorited] [cy-test=count]')
					.should('be.visible')
					.invoke('text')
					.then((resultFavoriteCount2) => {
						expect(+resultFavoriteCount2).to.equal(+resultFavoriteCount1 + +'1');
					});
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
