/// <reference types="cypress" />

//CLICK CAMPAIGN CARD
Cypress.Commands.add('clickCampaignCard', (index) => {
	cy.get('[cy-test=campaign-card]').eq(index).realClick();
});

//SELECT CAMPAIGN
Cypress.Commands.add('selectCampaign', (camp) => {
	cy.get('[cy-test=campaign-name]').contains(camp).scrollIntoView().realClick();
	//  cy.wait(['@servers', '@beacons', '@hosts', '@links', '@commandTypes', '@operators', '@timeline']);
	cy.get('.superGraph').should('be.visible');
	cy.get('[cy-test=timeline]').should('be.visible');
});

//DELETE CAMPAIGN USING THE UI
Cypress.Commands.add('deleteCampaign', (camp) => {
	cy.get('[cy-test=search]').click({ force: true }).type(camp).type('{enter}');
	cy.get('[cy-test=campaign-name]').should('contain', camp);
	cy.get('[cy-test=campaign-options]').realClick();
	cy.get('[cy-test=delete-campaign]').realClick();
	cy.contains('Delete Campaign').realClick();
});

//SEARCH FOR CAMPAIGN IN CAMPAIGN CARD SCREEN
Cypress.Commands.add('searchForCampaign', (camp) => {
	cy.get('[cy-test=search]').realClick().type(camp).type('{enter}');
	cy.get('[cy-test=campaign-name]').should('contain', camp);
});

//CLICK HELP ON CAMPAIGN CARD SCREEN
Cypress.Commands.add('clickAboutOnCampaignCard', () => {
	cy.get('[cy-test=help]').realClick();
	cy.get('[cy-test=about-modal]').should('be.visible');
});

//UPLOAD CAMPAIGN DB FILE
Cypress.Commands.add('uploadCampaign', (camp, fileName) => {
	cy.get('[cy-test=add-campaign-btn]').realClick();
	cy.get('[cy-test=upload-from-file]').realClick();
	cy.get('[cy-test=new-camp-name]').eq(1).realClick().type(camp);
	cy.fixture(fileName, { encoding: null }).as('myFixture');
	cy.get('[cy-test=browse-for-file]').selectFile('@myFixture');
	cy.get('[cy-test=import-database]').realClick();
	cy.wait(1000);
});

//UPLOAD FOLDER
Cypress.Commands.add('uploadFolder', (camp, fileName) => {
	cy.get('[cy-test=add-campaign-btn]').realClick();
	cy.get('[cy-test=new-camp-name]').eq(0).realClick().type(camp);
	cy.get('[cy-test=single-server-upload]').click({ force: true });
	cy.get('[cy-test=upload-folder]').selectFile(fileName, { encoding: 'utf8' }, { force: true });
	cy.wait(1000);
});

//UPLOAD CAMPAIGN DB FILE
Cypress.Commands.add('uploadCampaignBlue', (camp, fileName) => {
	cy.get('[cy-test=add-campaign-btn]').realClick();
	cy.get('[cy-test=upload-from-file]').realClick();
	cy.get('[cy-test=new-camp-name]').realClick().type(camp);
	cy.fixture(fileName, { encoding: null }).as('myFixture');
	cy.get('[cy-test=browse-for-file]').selectFile('@myFixture');
	cy.get('[cy-test=import-database]').realClick();
	cy.wait(1000);
});
