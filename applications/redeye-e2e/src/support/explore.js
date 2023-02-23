/// <reference types="cypress" />

/*
 *
 *
 *************COMMANDS RELATED TO EXPLORER VIEW TABS AND MODES*************
 *
 *
 */
//CLICK ON ALL TABS
Cypress.Commands.add('clickAllTabs', () => {
	cy.get('div.bp4-tab-list').should('be.visible').children().click({ multiple: true, force: true });
});

//CLICK ON THE TABS AVAILABLE ON OVERVIEW PANEL
Cypress.Commands.add('clickTab', (name) => {
	cy.get(`[cy-test="${[name]}"]`).click();
});

//CLICK SEARCH ON EXPLORER PANEL
Cypress.Commands.add('clickSearch', () => {
	cy.get('[cy-test=search-mode]').click();
});

//CLICK PRESENTATION MODE ON EXPLORER PANEL
Cypress.Commands.add('clickPresentationMode', () => {
	cy.get('[cy-test=presentation-mode').click();
	cy.wait('@presentationItems');
	cy.get('[cy-test=favorited]').should('be.visible');
	cy.get('.superGraph').should('be.visible');
	cy.wait(800);
});

//CLICK EXPLORER ON EXPLORER PANEL
Cypress.Commands.add('clickExplorerMode', () => {
	cy.get('[cy-test=explorer-mode]').click();
});

//CLICK USER SETTINGS ON EXPLORER PANEL
Cypress.Commands.add('clickUserSettings', () => {
	cy.get('[cy-test=user-settings]').click();
});

//CLICK GENERAL SETTINGS ON EXPLORER PANEL
Cypress.Commands.add('clickGeneralSettings', () => {
	cy.get('[cy-test=general-settings]').click();
});

//CLICK ABOUT MODAL ON EXPLORER PANEL
Cypress.Commands.add('clickAboutModal', () => {
	cy.get('[cy-test=help-btn]').click();
	cy.get('[cy-test=about-modal]').should('be.visible');
});

//CLICK ON COMMAND TYPES TAB
Cypress.Commands.add('clickCommandTypesTab', () => {
	cy.get('[cy-test=command-overview]').click();
});

// CLICK ON OPERATORS TAB
Cypress.Commands.add('clickOperatorsTab', () => {
	cy.get('[cy-test=operators]').click();
});

//CLICK COMMENTS ON EXPLORER OVERVIEW PANEL
Cypress.Commands.add('clickCommentsTab', () => {
	cy.get('[cy-test=comments]').click();
	cy.wait(500);
});

//CLICK BEACONS ON EXPLORER OVERVIEW PANEL
Cypress.Commands.add('clickBeaconsTab', () => {
	cy.get('[cy-test=beacons]').click();
	cy.wait(500);
});

//Return to Campaign Card
Cypress.Commands.add('returnToCampaignCard', () => {
	cy.get('[cy-test=return-campaign-menu]').first().click({ force: true });
	cy.wait('@campaigns');
});

//EXPAND THE ROW
Cypress.Commands.add('expandInfoRow', (index) => {
	cy.get('[cy-test=info-row]').eq(index).find('[cy-test=expand]').click();
});

//SELECT BEACON FROM OVERVIEW PANEL
Cypress.Commands.add('clickBeaconPanelList', (index) => {
	cy.get('div[cy-test=beacons]').eq(index).click();
});

//OVERVIEW VIEW OF BEACONS ON HOME PAGE
Cypress.Commands.add('beaconListShouldContain', (text) => {
	cy.get('div[cy-test=beacons]').should('contain', text);
});

//TOTAL BEACONS
Cypress.Commands.add('totalBeacons', (num) => {
	cy.get('div[cy-test=beacons]').should('have.length', num);
});

// SELECT HOST BY NAME
Cypress.Commands.add('selectHostByName', (campaignName) => {
	cy.get('[cy-test=hostName]').contains(campaignName).click();
});

// PLAY OR PAUSE THE TIMELINE
Cypress.Commands.add('timelinePlayPause', () => {
	cy.get('[cy-test=timeline-play-pause]').click();
});

// MOVE TIMELIME BACK
Cypress.Commands.add('timelineBack', () => {
	cy.get('[cy-test=timeline-back]').click();
});

// MOVE TIMELINE FORWARD
Cypress.Commands.add('timelineForward', () => {
	cy.get('[cy-test=timeline-forward]').click();
});

// RESET TIMELINE DATES
Cypress.Commands.add('resetTimelineDates', () => {
	cy.get('[cy-test=reset-timeline-dates]');
});

// CLICK TO EDIT TIMELINE DATES
Cypress.Commands.add('editTimelineDates', () => {
	cy.get('[cy-test=timeline-dates]').click();
});

// CHANGE TIMELINE START DATE
Cypress.Commands.add('changeTimelineStartDate', (newStartDate) => {
	cy.get('.bp4-input').eq(0).click().clear().type(newStartDate);
});

// CHANGE TIMELINE END DATE
Cypress.Commands.add('changeTimelineEndDate', (newEndDate) => {
	cy.get('.bp4-input').eq(1).click().clear().type(newEndDate);
});
