/// <reference types="cypress" />

describe('Command counts', () => {
	const camp = 'commandcounts';
	const fileName = 'gt.redeye';

	it('Verify command counts on front page against campaign details', () => {
		cy.uploadCampaign(camp, fileName);

		cy.searchForCampaign(camp);

		// Log starting number of campaign comments on campaign card
		cy.get('[cy-test=command-count]').then((number1) => {
			const divNumber1 = number1.text().split(' ').shift();
			cy.get('[cy-test=command-count]').should('contain', divNumber1);

			// Open campaign and log command counts showing under Host tab
			cy.selectCampaign(camp);
			cy
				.get('[cy-test=info-row]')
				.eq(1)
				.invoke('text')
				.then((textRow1) => {
					cy.log(textRow1);

					// this logs the text as one long string with no spaces or characters.
					// Need to find a different way to get just the number of commands
				});
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
