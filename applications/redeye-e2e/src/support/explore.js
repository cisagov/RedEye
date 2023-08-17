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
	cy.get('div.bp5-tab-list').should('be.visible').children().click({ multiple: true, force: true });
});

//CLICK ON THE TABS AVAILABLE ON OVERVIEW PANEL
Cypress.Commands.add('clickTab', (name) => {
	cy.get(`[cy-test="${[name]}"]`).click();
});

// *******************************************
// LEFT-HAND NAVIGATION OPTIONS
// *******************************************

// RETURN TO CAMPAIGN CARD
Cypress.Commands.add('returnToCampaignCard', () => {
	cy.get('[cy-test=return-campaign-menu]').first().click({ force: true });
	cy.wait(500);
	// cy.wait('@campaigns');
});

// CLICK EXPLORER ON EXPLORER PANEL
Cypress.Commands.add('clickExplorerMode', () => {
	cy.get('[cy-test=explorer-mode]').click();
});

// CLICK PRESENTATION MODE ON EXPLORER PANEL
Cypress.Commands.add('clickPresentationMode', () => {
	cy.get('[cy-test=presentation-mode').click();
	// cy.wait('@presentationItems');
	cy.get('[cy-test=presentation-root]').should('be.visible');
	cy.get('div.bp5-spinner-annimation').should('not.exist');
	cy.get('.superGraph').should('be.visible', { timeout: 90000 });
	cy.wait(1000);
});

// CLICK SEARCH ON EXPLORER PANEL
Cypress.Commands.add('clickSearch', () => {
	cy.get('[cy-test=search-mode]').click();
});

// CLICK USER SETTINGS ON EXPLORER PANEL
Cypress.Commands.add('clickUserSettings', () => {
	cy.get('[cy-test=user-settings]').click();
});

// CLICK GENERAL SETTINGS ON EXPLORER PANEL
Cypress.Commands.add('clickGeneralSettings', () => {
	cy.get('[cy-test=settings]').click();
});

// CLICK ABOUT MODAL ON EXPLORER PANEL
Cypress.Commands.add('clickAboutModal', () => {
	cy.get('[cy-test=help-btn]').click();
	cy.get('[cy-test=about-modal]').should('be.visible');
});

// *******************************************
// TABS ACROSS THE TOP
// *******************************************
// CLICK HOSTS TAB
Cypress.Commands.add('clickHostsTab', () => {
	cy.get('[cy-test=hosts]').click();
});

// CLICK OPERATORS TAB
Cypress.Commands.add('clickOperatorsTab', () => {
	cy.get('[cy-test=operators]').click();
});

// CLICK COMMENTS ON EXPLORER OVERVIEW PANEL
Cypress.Commands.add('clickCommentsTab', () => {
	cy.get('[cy-test=comments_list]').click();
	cy.wait(500);
	cy.get('[data-test-id=virtuoso-item-list]').should('exist');
});

// CLICK BEACONS ON EXPLORER OVERVIEW PANEL
Cypress.Commands.add('clickBeaconsTab', () => {
	cy.get('[cy-test=beacons]').click();
	cy.wait(500);
});

// CLICK COMMAND TYPES TAB
Cypress.Commands.add('clickCommandTypesTab', () => {
	cy.get('[cy-test=command-overview]').click();
});

// CLICK COMMANDS TAB
Cypress.Commands.add('clickCommandsTab', () => {
	cy.get('[cy-test=commands]').click();
});

//CLICK META TAB
Cypress.Commands.add('clickDetailsTab', () => {
	cy.get('[cy-test=details]').click();
	cy.wait(500);
});

// *******************************************
// ACTIONS WITHIN ITEMS
// *******************************************

// CLICK COMMENTS TAB AFTER CLICKING IN ANOTHER TAB
Cypress.Commands.add('clickCommentsTabWithinTab', () => {
	cy.get('[cy-test=comments]').click();
	cy.wait(500);
	// cy.get('[data-test-id=virtuoso-item-list]').should('exist');
});

// EXPAND THE ROW
Cypress.Commands.add('expandInfoRow', (index) => {
	cy.get('[cy-test=info-row]').eq(index).find('[cy-test=expand]').click();
});

// SELECT BEACON FROM OVERVIEW PANEL
Cypress.Commands.add('clickBeaconPanelList', (index) => {
	cy.get('div[cy-test=beacons]').eq(index).click();
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
	cy.get('[cy-test=hostName]').contains(campaignName).click();
});

// *******************************************
// TIMELINE ACTIONS
// *******************************************

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
	cy.get('.bp5-input').eq(0).click().clear().type(newStartDate);
});

// CHANGE TIMELINE END DATE
Cypress.Commands.add('changeTimelineEndDate', (newEndDate) => {
	cy.get('.bp5-input').eq(1).click().clear().type(newEndDate);
});

// *******************************************
// SEARCH MODAL
// *******************************************

// OPEN SEARCH MODAL FILTER OPTIONS
Cypress.Commands.add('filterSearchResults', () => {
	cy.get('[cy-test=filter-search]').click();
});

// FILTER TO BEACONS
Cypress.Commands.add('filterToBeacons', () => {
	cy.get('[cy-test=Beacons]').click();
});

// FILTER TO COMMANDS
Cypress.Commands.add('filterToCommands', () => {
	cy.get('[cy-test=Commands]').click();
});

// FILTER TO HOSTS
Cypress.Commands.add('filterToHosts', () => {
	cy.get('[cy-test=Hosts]').click();
});

// FILTER TO SERVERS
Cypress.Commands.add('filterToServers', () => {
	cy.get('[cy-test=Teamservers]').click();
});

// REMOVE FILTER
Cypress.Commands.add('removeFilter', () => {
	cy.get('[cy-test=remove-filter]').click();
});

// OPEN SEARCH MODAL SORT OPTIONS
Cypress.Commands.add('sortSearchResults', () => {
	cy.get('[cy-test=sort-search]').click();
});

// SORT BY NAME
Cypress.Commands.add('sortByName', () => {
	cy.get('[cy-test=Name]').click();
});

// SORT BY RELEVANCE
Cypress.Commands.add('sortByRelevance', () => {
	cy.get('[cy-test=Relevance]').click();
});

// SORT BY TYPE
Cypress.Commands.add('sortByType', () => {
	cy.get('[cy-test=Type]').click();
});

// SEARCH RESULT SHOULD CONTAIN
Cypress.Commands.add('searchResultContains', (index, term) => {
	cy.get('[cy-test=search-result-item]').eq(index).should('contain', term);
});

// CLOSE SEARCH
Cypress.Commands.add('closeSearch', () => {
	cy.get('[cy-test=close-log]').click();
});

// *******************************************
// SHOW / HIDE FEATURES
// *******************************************

// SHOW / HIDE BEACON FROM META TAB
Cypress.Commands.add('showHideBeaconDetailsTab', () => {
	cy.get('[cy-test=show-hide-this-beacon]').click();
	cy.get('[cy-test=confirm-show-hide]').click();
	cy.get('[cy-test=modal-header]').should('not.exist');
});

// SHOW / HIDE HOST FROM META TAB
Cypress.Commands.add('showHideHostDetailsTab', () => {
	cy.get('[cy-test=show-hide-this-host]').click();
	cy.get('[cy-test=confirm-show-hide]').click();
	cy.get('[cy-test=modal-header]').should('not.exist');
});

// SHOW / HIDE SERVER FROM META TAB
Cypress.Commands.add('showHideServerDetailsTab', () => {
	cy.get('[cy-test=show-hide-this-server]').click();
	cy.get('[cy-test=confirm-show-hide]').click();
	cy.get('[cy-test=modal-header]').should('not.exist');
});

// SHOW / HIDE ITEM FROM IN-LINE KEBAB MENU
Cypress.Commands.add('showHideItem', (index) => {
	cy.get('[cy-test=quick-meta-button]').eq(index).click();
	cy.get('[cy-test=show-hide-item]').click();
	cy.wait(400);
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

// VERIFY CANNOT HIDE FINAL ITEM BOX DISAPPEARS
Cypress.Commands.add('verifyCannotHideFinalDisappears', () => {
	cy.get('[cy-test=cannot-hide-final-text1]').should('not.exist');
	cy.get('[cy-test=cannot-hide-final-text2]').should('not.exist');
});

// CONFIRM SHOW OR HIDE FROM CONFIRMATION MODAL
Cypress.Commands.add('confirmShowHide', () => {
	cy.get('[cy-test=confirm-show-hide]').click();
	cy.wait(400);
	cy.get('[cy-test=confirm-show-hide]').should('not.exist');
});

// CANCEL SHOW OR HIDE FROM CONFIRMATION MODAL
Cypress.Commands.add('cancelShowHide', () => {
	cy.get('[cy-test=cancel-show-hide]').click();
});

// CLICK BULK EDIT BUTTON TO SHOW/HIDE MULTIPLE ITEMS
Cypress.Commands.add('clickBulkEdit', () => {
	cy.get('[cy-test=bulk-edit]').click();
});

// HIDE ITEMS USING BULK EDIT
Cypress.Commands.add('bulkEditHide', () => {
	cy.get('[cy-test=hide]').click();
	cy.get('[cy-test=confirm-show-hide]').click();
	cy.wait(1000);
});

// SHOW ITEMS USING BULK EDIT
Cypress.Commands.add('bulkEditShow', () => {
	cy.get('[cy-test=show]').click();
	cy.get('[cy-test=confirm-show-hide]').click();
	cy.wait(1000);
});
