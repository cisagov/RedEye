/// <reference types="cypress" />

describe('Hide a beacon', () => {
	const camp = 'hideshowbeacon';
	const fileName = 'gt.redeye';

	it('Hide beacon using toggle in left nav panel', () => {
		cy.uploadCampaign(camp, fileName);

		// Search for new campaign by name
		cy.selectCampaign(camp);

		// Toggle off switch for hidden beacons
		cy.get('[cy-test=general-settings]').click();
		cy.get('[cy-test=show-hide-beacons]').uncheck({ force: true });

		cy.closeRawLogs();

		cy.clickBeaconsTab();

		// Hide a beacon
		cy.get('[data-test-id=virtuoso-item-list] [cy-test=beacons-row]').eq(0).click();
		cy.get('[cy-test=Metadata]').click();
		cy
			.get('[cy-test=beacon-display-name]')
			.invoke('attr', 'value')
			.then((resultBeacon1) => {
				cy.get('[cy-test=show-hide-this-beacon]').click();
				cy.contains('Hide Beacon').click();

				cy.clickBeaconsTab();

				// Verify beacon no longer shows
				cy.get('[cy-test=beacons-view]').should('not.contain', resultBeacon1);

				// Toggle switch back on
				cy.get('[cy-test=general-settings]').click();
				cy.get('[cy-test=show-hide-beacons]').check({ force: true });
				cy.wait('@servers');

				cy.get('[cy-test=close-log').click();
				cy.clickBeaconsTab();

				// Verify beacon now shows again
				cy.get('[cy-test=beacons-view]').should('contain', resultBeacon1);

				// Unhide the beacon
				cy.get('[data-test-id=virtuoso-item-list] [cy-test=beacons-row]').contains(resultBeacon1).click();
				cy.get('[cy-test=Metadata]').click();
				cy.get('[cy-test=show-hide-this-beacon]').click();
				cy.wait('@servers');

				cy.contains('Show Beacon').click();
				cy.wait('@toggleBeaconHidden');

				// Toggle off switch for hidden beacons
				cy.get('[cy-test=general-settings]').click();
				cy.get('[cy-test=show-hide-beacons]').uncheck({ force: true });
				cy.wait('@servers');

				cy.get('[cy-test=close-log').click();
				cy.clickBeaconsTab();

				// Verify beacon shows
				cy.get('[cy-test=beacons-view]').should('contain', resultBeacon1);
			});
	});

	it('Hide beacon using toggle on main page', () => {
		// Toggle off switch for hidden beacons
		cy.get('[cy-test=settings]').click();

		cy.get('[cy-test=show-hide-beacons]').uncheck({ force: true });

		cy.closeRawLogs();

		// Search for new campaign by name
		cy.selectCampaign(camp);

		cy.clickBeaconsTab();
		// Hide a beacon
		cy.get('[data-test-id=virtuoso-item-list] [cy-test=beacons-row]').eq(0).click();
		cy.get('[cy-test=Metadata]').click();
		cy
			.get('[cy-test=beacon-display-name]')
			.invoke('attr', 'value')
			.then((resultBeacon1) => {
				let result1 = resultBeacon1;
				cy.log(result1);

				cy.get('[cy-test=show-hide-this-beacon]').click();
				cy.wait('@servers');

				cy.contains('Hide Beacon').click();

				cy.clickBeaconsTab();

				// Verify beacon no longer shows
				cy.get('[cy-test=beacons-view]').should('not.contain', result1);

				// Toggle switch back on
				cy.returnToCampaignCard();
				cy.get('[cy-test=settings]').click();
				cy.get('[cy-test=show-hide-beacons]').check({ force: true });

				//CLOSE SETTINGS
				cy.get('[cy-test=close-log').click();

				// Verify beacon now shows again
				cy.selectCampaign(camp);

				cy.clickBeaconsTab();

				cy.get('[cy-test=beacons-view]').should('contain', result1);

				// Unhide the beacon
				cy.get('[data-test-id=virtuoso-item-list] [cy-test=beacons-row]').contains(result1).click();
				cy.get('[cy-test=Metadata]').click();
				cy.get('[cy-test=show-hide-this-beacon]').click();
				cy.wait('@servers');
				cy.contains('Show Beacon').click();
				cy.wait('@toggleBeaconHidden');

				// Toggle off switch for hidden beacons
				cy.returnToCampaignCard();
				cy.get('[cy-test=settings]').click();
				cy.get('[cy-test=show-hide-beacons]').uncheck({ force: true });
				cy.wait('@servers');
				cy.get('[cy-test=close-log').click();

				// Verify beacon shows
				cy.selectCampaign(camp);

				cy.clickBeaconsTab();

				cy.get('[cy-test=beacons-view]').should('contain', result1);
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
