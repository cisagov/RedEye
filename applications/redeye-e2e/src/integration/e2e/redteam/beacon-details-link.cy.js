/// <reference types="cypress" />

let linkText;

describe('Beacon Details link', () => {
	const camp = 'beacondetailslink';
	const fileName = 'gt.redeye';

	it('Link on Beacon Details redirects appropriately', () => {
		cy.uploadCampaign(camp, fileName);

		// Search for new campaign by name, go go Beacons tab, select Beacon
		cy.selectCampaign(camp);
		cy.clickBeaconsTab();
		cy.selectBeacon(0);

		// Go to Details tab and get link details
		cy.clickDetailsTab();
		cy.get('[cy-test=meta-link]')
			.invoke('text')
			.then((link) => {
				linkText = link;
			});

		// Click link and verify it redirected to the correct place
		cy.get('[cy-test=meta-link]').click();
		cy.get('[cy-test=panel-header]')
			.invoke('text')
			.then((redirect) => {
				expect(redirect).to.eq(linkText);
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
