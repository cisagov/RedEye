/// <reference types="cypress" />

describe('Hide last host', () => {
	const camp = 'hidelasthost';
	const fileName = 'gt.redeye';

	it('Should not be able to hide last host', () => {
		cy.uploadCampaign(camp, fileName);

		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Get name of first host
		cy.get('[cy-test=hostName]')
			.eq(1)
			.invoke('text')
			.as('host')
			.then((hostName1) => {
				// Hide the first host in the list
				cy.showHideItem(1);

				// Verify confirmation modal appears
				cy.verifyDialogBoxAppears();

				// Confirm that you want to hide the host
				cy.confirmShowHide();

				// Confirm first host does not show in list
				cy.get('[cy-test=hostName]').each(($hosts) => {
					expect($hosts.text()).to.not.contain(hostName1);
				});
			});

		// Get name of second/last host
		cy.get('@host').then((hostName2) => {
			// Try to hide the second/last host
			cy.showHideItem(1);

			// Verify notification appears saying it cannot be hidden
			cy.verifyCannotHideFinal();

			// Click to confirm
			cy.confirmShowHide();

			// Verify last host still shows in UI
			cy.get('[cy-test=hosts-view]').should('contain', hostName2);
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
