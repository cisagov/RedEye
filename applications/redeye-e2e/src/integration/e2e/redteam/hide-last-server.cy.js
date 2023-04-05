/// <reference types="cypress" />

describe('Hide last server', () => {
	const camp = 'hideonlyserver';
	const fileName = 'gt.redeye';
	const camp2 = 'hidelastserver';
	const fileName2 = 'smalldata.redeye';

	it('Should not be able to hide only server', () => {
		// NOTE: this dataset only has one server

		cy.uploadCampaign(camp, fileName);

		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Get name of only server
		cy.get('[cy-test=hostName]')
			.eq(0)
			.invoke('text')
			.as('server')
			.then((serverName) => {
				// Try to hide the only server
				cy.showHideItem(0);

				// Verify notification appears saying it cannot be hidden
				cy.get('[cy-test=cannot-hide-final-text1]').should('exist');
				cy.get('[cy-test=cannot-hide-final-text2]').should('exist');

				// Click to confirm
				cy.confirmShowHide();

				// Verify last host still shows in UI
				cy.get('[cy-test=hosts-view]').should('contain', serverName);
			});
	});

	it('Should not be able to hide last server', () => {
		cy.uploadCampaign(camp2, fileName2);

		// Search for new campaign by name
		cy.selectCampaign(camp2);

		// Get name of first server
		cy.get('[cy-test=hostName]')
			.eq(0)
			.invoke('text')
			.as('server')
			.then((serverName1) => {
				// Hide the first server in the list
				cy.showHideItem(0);

				// Verify confirmation modal appears
				cy.verifyDialogBoxAppears();

				// Confirm that you want to hide the server
				cy.confirmShowHide();

				// Confirm first server does not show in list
				cy.get('[cy-test=hostName]').each(($servers) => {
					expect($servers.text()).to.not.contain(serverName1);
				});
			});

		// Get name of seccond server
		cy.get('@server').then((serverName2) => {
			// Hide the first server in the list
			cy.showHideItem(0);

			// Verify confirmation modal appears
			cy.verifyDialogBoxAppears();

			// Confirm that you want to hide the host
			cy.confirmShowHide();

			// Confirm first host does not show in list
			cy.get('[cy-test=hostName]').each(($servers) => {
				expect($servers.text()).to.not.contain(serverName2);
			});
		});

		// Get name of third server
		cy.get('@server').then((serverName3) => {
			// Hide the first server in the list
			cy.showHideItem(0);

			// Verify confirmation modal appears
			cy.verifyDialogBoxAppears();

			// Confirm that you want to hide the host
			cy.confirmShowHide();

			// Confirm first host does not show in list
			cy.get('[cy-test=hostName]').each(($servers) => {
				expect($servers.text()).to.not.contain(serverName3);
			});
		});

		// Get name of fourth/last server
		cy.get('@server').then((serverName4) => {
			// Try to hide the fourth/last server
			cy.showHideItem(0);

			// Verify notification appears saying it cannot be hidden
			cy.get('[cy-test=cannot-hide-final-text1]').should('exist');
			cy.get('[cy-test=cannot-hide-final-text2]').should('exist');

			// Click to confirm
			cy.confirmShowHide();

			// Verify last server still shows in UI
			cy.get('[cy-test=hosts-view]').should('contain', serverName4);
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
		cy.deleteCampaignGraphQL(camp2);
	});
});
