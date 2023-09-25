/// <reference types="cypress" />

let origBeaconName;
let updatedBeaconName;
let origTOD;
let updatedTOD;
let origType;
let updatedType;

describe('Update Beacon details', () => {
	const camp = 'updatebeacondetails';
	const fileName = 'gt.redeye';
	const newBeaconName = 'Beacon 1';
	const newTOD = '08/17/20 13:33'; // could fail based on browser timezone // use moment.tz.guess() to offset?

	it.only('Rename a beacon and change time of death', () => {
		cy.uploadCampaign(camp, fileName);

		// Search for new campaign by name, go go Beacons tab, select Beacon
		cy.selectCampaign(camp);
		cy.clickBeaconsTab();
		cy.selectBeacon(0);

		// Go to Details tab and get current info for the beacon
		cy.clickDetailsTab();

		cy.get('[cy-test=beacon-display-name]')
			.invoke('attr', 'value')
			.then((resultBeacon1) => {
				origBeaconName = resultBeacon1;
			});

		cy.get('[cy-test=beacon-time-of-death]')
			.find('.bp5-input')
			.invoke('attr', 'value')
			.then((tod1) => {
				origTOD = tod1;
			});

		// Change beacon name and save
		cy.get('[cy-test=beacon-display-name]').click().clear().type(newBeaconName);
		cy.get('[cy-test=save-beacon-name]').click({ force: true });

		// Change TOD and save
		cy.get('input[type=text]').eq(1).click().clear().type(newTOD);
		cy.wait(1000);
		cy.get('[cy-test=save-beacon-time-of-death]').click({ force: true });
		cy.wait(500);

		// Leave page, then return to verify new beacon name persisted
		cy.clickExplorerMode();
		cy.clickBeaconsTab();
		cy.selectBeacon(0);
		cy.clickDetailsTab();

		cy.get('[cy-test=beacon-display-name]')
			.invoke('attr', 'value')
			.then((resultBeacon2) => {
				updatedBeaconName = resultBeacon2;
				expect(updatedBeaconName).to.contain(newBeaconName).and.to.not.contain(origBeaconName);
			});

		// Verify new TOD persisted
		cy.get('[cy-test=beacon-time-of-death]')
			.find('.bp5-input')
			.invoke('attr', 'value')
			.then((tod2) => {
				updatedTOD = tod2;
				expect(updatedTOD).to.equal(newTOD);
			});
	});

	it('Update Beacon type', () => {
		// Search for new campaign by name, go go Beacons tab, select Beacon
		cy.selectCampaign(camp);
		cy.clickBeaconsTab();
		cy.selectBeacon(0);

		// Go to Details tab and get current info for the beacon
		cy.clickDetailsTab();
		cy.get('[cy-test=type-dropdown]')
			.invoke('text')
			.then((type1) => {
				origType = type1;
			});

		// Click dropdown to change Type
		cy.get('[cy-test=type-dropdown]').click();
		cy.get('[cy-test=dns]').click();

		// Leave page, then return to verify new Type persisted
		cy.clickExplorerMode();
		cy.clickBeaconsTab();
		cy.selectBeacon(0);
		cy.clickDetailsTab();

		cy.clickDetailsTab();
		cy.get('[cy-test=type-dropdown]')
			.invoke('text')
			.then((type2) => {
				updatedType = type2;
				expect(updatedType).to.eq('dns').and.to.not.eq(origType);
			});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
