/// <reference types="cypress" />

describe('Command counts', () => {
	const camp = 'commandcounts';
	const fileName = 'gt.redeye';

	it('Verify command counts on front page against campaign details', () => {
		cy.uploadCampaign(camp, fileName);

		cy.searchForCampaign(camp);

		// Log starting number of campaign comments on campaign card
		cy.get('[cy-test=command-count]').then((number1) => {
			const commandTotal = number1.text().split(' ').shift();
			cy.get('[cy-test=command-count]').should('contain', commandTotal);

			// Open campaign and log command counts showing under Host tab
			cy.selectCampaign(camp);
			cy
				.get('[cy-test=row-command-count]')
				.eq(0)
				.invoke('text')
				.then((countRow1) => {
					cy.log(countRow1);

					cy
						.get('[cy-test=row-command-count]')
						.eq(1)
						.invoke('text')
						.then((countRow2) => {
							cy.log(countRow2);

							expect(+countRow1 + +countRow2).to.eq(+commandTotal);
						});
				});
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
