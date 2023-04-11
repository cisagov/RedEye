/* eslint-disable cypress/no-unnecessary-waiting */

/// <reference types="cypress" />
/*
 *
 *
 *************BEACON COMMANDS*************
 *
 *
 */
//SELECT A BEACON
Cypress.Commands.add('clickBeacon', (index) => {
	cy.get('[cy-test=beacon]').eq(index).click({ force: true });
	cy.wait(500);
});

Cypress.Commands.add('verifyBeaconNameUserName', (beacon, uname) => {
	cy.get('[cy-test=beaconName]').contains(beacon);
	cy.get('[cy-test=userName]').contains(uname);
});

//VERIFY THAT COMMAND LOGS CONTAIN TEXT
Cypress.Commands.add('logsShouldContain', (txt) => {
	cy.get('[cy-test=logInfo]').invoke('text').should('contain', txt);
});

//VERIFY THAT COMMAND LOGS CONTAIN TEXT
Cypress.Commands.add('showMoreLines', () => {
	cy.get('[cy-test=showMoreLines]').click();
});

Cypress.Commands.add('expandedLogsContain', (log) => {
	cy.get('[cy-test=log]').invoke('text').should('contain', log);
});

//VERIFY THAT COMMANDS TYPE APPEAR ON BEACONS
Cypress.Commands.add('verifyCommandType', (index, cmd) => {
	cy.get('[cy-test=info-row] [cy-test=command-type]').eq(index).should('contain', cmd);
});

//VERIFY THAT COMMANDS PARAMS APPEAR ON BEACONS
Cypress.Commands.add('verifyCommandParams', (index, params) => {
	const trim = params.trim();
	cy.get('[cy-test=info-row] span[cy-test=command-params]').eq(index).invoke('text').should('contain', trim);
});

// //VERIFY OPERATOR NAME
// Cypress.Commands.add('verifyCurrentOperator', (text) => {
//   cy.get('[cy-test=opName]').should('contain', text);
// });

//VERIFY NUMBER OF TOTAL COMMANDS EXECUTED ON A BEACON
Cypress.Commands.add('verifyTotalCommands', (num) => {
	cy.wait(200);
	cy.get('[cy-test=command-info] [cy-test=info-row]').should('be.visible').its('length').should('eq', num);
});

//ADD COMMENTS
Cypress.Commands.add('clickAddComments', (index) => {
	cy.get('[cy-test=add-comment]').eq(index).click();
});

//ADD MULTI COMMAND COMMENTS
Cypress.Commands.add('addMultiCommandComment', () => {
	cy.get('[cy-test=multi-command-comment]').click();
	cy.get('[cy-test=comment-on-commands]').should('be.disabled');
});

////NEW
Cypress.Commands.add('beaconClick', (id) => {
	cy.wait(1000);
	return cy.window().then((win) => {
		win.graph.graphData.selectNode(id);
	});
});

Cypress.Commands.add('beaconHover', (id) => {
	cy.wait(1000);
	cy.window().then((win) => {
		win.graph.graphData.previewNode(id);
	});
});
