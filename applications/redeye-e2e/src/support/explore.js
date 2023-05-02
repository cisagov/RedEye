/* eslint-disable cypress/no-unnecessary-waiting */

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
	cy.get(`[cy-test="${[name]}"]`).realClick();
});

// *******************************************
// LEFT-HAND NAVIGATION OPTIONS
// *******************************************

// RETURN TO CAMPAIGN CARD
Cypress.Commands.add('returnToCampaignCard', () => {
	cy.get('[cy-test=return-campaign-menu]').first().click({ force: true });
	cy.wait('@campaigns');
});

// CLICK EXPLORER ON EXPLORER PANEL
Cypress.Commands.add('clickExplorerMode', () => {
	cy.get('[cy-test=explorer-mode]').realClick();
});

// CLICK PRESENTATION MODE ON EXPLORER PANEL
Cypress.Commands.add('clickPresentationMode', () => {
	cy.get('[cy-test=presentation-mode').realClick();
	cy.wait('@presentationItems');
	cy.get('div.bp4-spinner-annimation').should('not.exist');
	cy.get('[cy-test=favorited]').should('be.visible');
	cy.get('.superGraph').should('be.visible');

	cy.wait(1000);
});

// CLICK SEARCH ON EXPLORER PANEL
Cypress.Commands.add('clickSearch', () => {
	cy.get('[cy-test=search-mode]').realClick();
});

// CLICK USER SETTINGS ON EXPLORER PANEL
Cypress.Commands.add('clickUserSettings', () => {
	cy.get('[cy-test=user-settings]').realClick();
});

// CLICK GENERAL SETTINGS ON EXPLORER PANEL
Cypress.Commands.add('clickGeneralSettings', () => {
	cy.get('[cy-test=settings]').realClick();
});

// CLICK ABOUT MODAL ON EXPLORER PANEL
Cypress.Commands.add('clickAboutModal', () => {
	cy.get('[cy-test=help-btn]').realClick();
	cy.get('[cy-test=about-modal]').should('be.visible');
});

// *******************************************
// TABS ACROSS THE TOP
// *******************************************
// CLICK HOSTS TAB
Cypress.Commands.add('clickHostsTab', () => {
	cy.get('[cy-test=hosts]').realClick();
});

// CLICK OPERATORS TAB
Cypress.Commands.add('clickOperatorsTab', () => {
	cy.get('[cy-test=operators]').realClick();
});

// CLICK COMMENTS ON EXPLORER OVERVIEW PANEL
Cypress.Commands.add('clickCommentsTab', () => {
	cy.get('[cy-test=comments]').realClick();
	cy.wait(500);
});

// CLICK BEACONS ON EXPLORER OVERVIEW PANEL
Cypress.Commands.add('clickBeaconsTab', () => {
	cy.get('[cy-test=beacons]').realClick();
	cy.wait(500);
});

// CLICK COMMAND TYPES TAB
Cypress.Commands.add('clickCommandTypesTab', () => {
	cy.get('[cy-test=command-overview]').realClick();
});

// CLICK COMMANDS TAB
Cypress.Commands.add('clickCommandsTab', () => {
	cy.get('[cy-test=commands]').realClick();
});

//CLICK META TAB
Cypress.Commands.add('clickMetaTab', () => {
	cy.get('[cy-test=Metadata]').realClick();
	cy.wait(500);
});

// *******************************************
// ACTIONS WITHIN ITEMS
// *******************************************

// EXPAND THE ROW
Cypress.Commands.add('expandInfoRow', (index) => {
	cy.get('[cy-test=info-row]').eq(index).find('[cy-test=expand]').realClick();
});

// SELECT BEACON FROM OVERVIEW PANEL
Cypress.Commands.add('clickBeaconPanelList', (index) => {
	cy.get('div[cy-test=beacons]').eq(index).realClick();
});

// OVERVIEW VIEW OF BEACONS ON HOME PAGE
Cypress.Commands.add('beaconListShouldContain', (text) => {
	cy.get('div[cy-test=beacons]').should('contain', text);
});

// TOTAL BEACONS
Cypress.Commands.add('totalBeacons', (num) => {
	cy.get('div[cy-test=beacons]').should('have.length', num);
});

// SELECT HOST BY NAME
Cypress.Commands.add('selectHostByName', (campaignName) => {
	cy.get('[cy-test=hostName]').contains(campaignName).realClick();
});

// *******************************************
// TIMELINE ACTIONS
// *******************************************

// PLAY OR PAUSE THE TIMELINE
Cypress.Commands.add('timelinePlayPause', () => {
	cy.get('[cy-test=timeline-play-pause]').realClick();
});

// MOVE TIMELIME BACK
Cypress.Commands.add('timelineBack', () => {
	cy.get('[cy-test=timeline-back]').realClick();
});

// MOVE TIMELINE FORWARD
Cypress.Commands.add('timelineForward', () => {
	cy.get('[cy-test=timeline-forward]').realClick();
});

// RESET TIMELINE DATES
Cypress.Commands.add('resetTimelineDates', () => {
	cy.get('[cy-test=reset-timeline-dates]');
});

// CLICK TO EDIT TIMELINE DATES
Cypress.Commands.add('editTimelineDates', () => {
	cy.get('[cy-test=timeline-dates]').realClick();
});

// CHANGE TIMELINE START DATE
Cypress.Commands.add('changeTimelineStartDate', (newStartDate) => {
	cy.get('.bp4-input').eq(0).realClick().clear().type(newStartDate);
});

// CHANGE TIMELINE END DATE
Cypress.Commands.add('changeTimelineEndDate', (newEndDate) => {
	cy.get('.bp4-input').eq(1).realClick().clear().type(newEndDate);
});

// *******************************************
// SEARCH MODAL
// *******************************************

// OPEN SEARCH MODAL FILTER OPTIONS
Cypress.Commands.add('filterSearchResults', () => {
	cy.get('[cy-test=filter-search]').realClick();
});

// FILTER TO BEACONS
Cypress.Commands.add('filterToBeacons', () => {
	cy.get('[cy-test=Beacons]').realClick();
});

// FILTER TO COMMANDS
Cypress.Commands.add('filterToCommands', () => {
	cy.get('[cy-test=Commands]').realClick();
});

// FILTER TO HOSTS
Cypress.Commands.add('filterToHosts', () => {
	cy.get('[cy-test=Hosts]').realClick();
});

// FILTER TO SERVERS
Cypress.Commands.add('filterToServers', () => {
	cy.get('[cy-test=Teamservers]').realClick();
});

// REMOVE FILTER
Cypress.Commands.add('removeFilter', () => {
	cy.get('[cy-test=remove-filter]').realClick();
});

// OPEN SEARCH MODAL SORT OPTIONS
Cypress.Commands.add('sortSearchResults', () => {
	cy.get('[cy-test=sort-search]').realClick();
});

// SORT BY NAME
Cypress.Commands.add('sortByName', () => {
	cy.get('[cy-test=Name]').realClick();
});

// SORT BY RELEVANCE
Cypress.Commands.add('sortByRelevance', () => {
	cy.get('[cy-test=Relevance]').realClick();
});

// SORT BY TYPE
Cypress.Commands.add('sortByType', () => {
	cy.get('[cy-test=Type]').realClick();
});

// SEARCH RESULT SHOULD CONTAIN
Cypress.Commands.add('searchResultContains', (index, term) => {
	cy.get('[cy-test=search-result-item]').eq(index).should('contain', term);
});

// CLOSE SEARCH
Cypress.Commands.add('closeSearch', () => {
	cy.get('[cy-test=close-log]').realClick();
});

// *******************************************
// SHOW / HIDE FEATURES
// *******************************************

// SHOW / HIDE BEACON FROM META TAB
Cypress.Commands.add('showHideBeaconMetaTab', () => {
	cy.get('[cy-test=show-hide-this-beacon]').realClick();
	cy.get('[cy-test=confirm-show-hide]').realClick();
	cy.get('[cy-test=modal-header]').should('not.exist');
});

// SHOW / HIDE HOST FROM META TAB
Cypress.Commands.add('showHideHostMetaTab', () => {
	cy.get('[cy-test=show-hide-this-host]').realClick();
	cy.get('[cy-test=confirm-show-hide]').realClick();
	cy.get('[cy-test=modal-header]').should('not.exist');
});

// SHOW / HIDE SERVER FROM META TAB
Cypress.Commands.add('showHideServerMetaTab', () => {
	cy.get('[cy-test=show-hide-this-server]').realClick();
	cy.get('[cy-test=confirm-show-hide]').realClick();
	cy.get('[cy-test=modal-header]').should('not.exist');
});

// SHOW / HIDE ITEM FROM IN-LINE KEBAB MENU
Cypress.Commands.add('showHideItem', (index) => {
	cy.get('[cy-test=quick-meta-button]').eq(index).realClick();
	cy.get('[cy-test=show-hide-item]').realClick();
});

// VERIFY SHOW/HIDE DIALOG BOX APPEARS
Cypress.Commands.add('verifyDialogBoxAppears', () => {
	cy.get('[cy-test=dialog-text-line1]').should('exist');
	cy.get('[cy-test=dialog-text-line2]').should('exist');
	cy.get('[cy-test=dialog-text-line3]').should('exist');
	cy.get('[cy-test=cancel-show-hide]').should('exist');
	cy.get('[cy-test=confirm-show-hide]').should('exist');
});

// VERIFY SHOW/HIDE CONFIRMATION MODAL DISAPPEARS
Cypress.Commands.add('verifyDialogBoxDisappears', () => {
	cy.get('[cy-test=dialog-text-line1]').should('not.exist');
	cy.get('[cy-test=dialog-text-line2]').should('not.exist');
	cy.get('[cy-test=dialog-text-line3]').should('not.exist');
	cy.get('[cy-test=cancel-show-hide]').should('not.exist');
	cy.get('[cy-test=confirm-show-hide]').should('not.exist');
});

// VERIFY CANNOT HIDE FINAL ITEM
Cypress.Commands.add('verifyCannotHideFinal', () => {
	cy.get('[cy-test=cannot-hide-final-text1]').should('exist');
	cy.get('[cy-test=cannot-hide-final-text2]').should('exist');
});

// CONFIRM SHOW OR HIDE FROM CONFIRMATION MODAL
Cypress.Commands.add('confirmShowHide', () => {
	cy.get('[cy-test=confirm-show-hide]').realClick();
	cy.get('[cy-test=confirm-show-hide]').should('not.exist');
});

// CANCEL SHOW OR HIDE FROM CONFIRMATION MODAL
Cypress.Commands.add('cancelShowHide', () => {
	cy.get('[cy-test=cancel-show-hide]').realClick();
});
