/// <reference types="cypress" />

//CLICK CAMPAIGN CARD
Cypress.Commands.add('clickCampaignCard', (index) => {
	cy.get('[cy-test=campaign-card]').eq(index).click();
});

//SELECT CAMPAIGN
Cypress.Commands.add('selectCampaign', (camp) => {
	cy.get('[cy-test=campaign-name]').contains(camp).scrollIntoView().click();
	cy.get('.superGraph').should('be.visible');
	cy.get('[cy-test=timeline]').should('be.visible');
});

//DELETE CAMPAIGN USING THE UI
Cypress.Commands.add('deleteCampaign', (camp) => {
	cy.get('[cy-test=search]').click({ force: true }).type(camp).type('{enter}');
	cy.get('[cy-test=campaign-name]').should('contain', camp);
	cy.get('[cy-test=campaign-options]').click();
	cy.get('[cy-test=delete-campaign]').click();
	cy.contains('Delete Campaign').click();
});

//SEARCH FOR CAMPAIGN IN CAMPAIGN CARD SCREEN
Cypress.Commands.add('searchForCampaign', (camp) => {
	cy.get('[cy-test=search]').click().type(camp).type('{enter}');
	cy.get('[cy-test=campaign-name]').should('contain', camp);
});

//CLICK HELP ON CAMPAIGN CARD SCREEN
Cypress.Commands.add('clickAboutOnCampaignCard', () => {
	cy.get('[cy-test=help]').click();
	cy.get('[cy-test=about-modal]').should('be.visible');
});

//UPLOAD CAMPAIGN DB FILE
Cypress.Commands.add('uploadCampaign', (camp, fileName) => {
	cy.get('[cy-test=add-campaign-btn]').click();
	cy.get('[cy-test=upload-from-file]').click();
	cy.get('[cy-test=new-camp-name]').eq(1).click().type(camp);
	cy.fixture(fileName, { encoding: null }).as('myFixture');
	cy.get('[cy-test=browse-for-file]').selectFile('@myFixture');
	cy.get('[cy-test=import-database]').click();
	cy.wait(1000);
});

//UPLOAD FOLDER
Cypress.Commands.add('uploadFolder', (camp, fileName) => {
	cy.get('[cy-test=add-campaign-btn]').click();
	cy.get('[cy-test=new-camp-name]').eq(0).click().type(camp);
	cy.get('[cy-test=single-server-upload]').click({ force: true });
	cy.get('[cy-test=upload-folder]').selectFile(fileName, { encoding: 'utf8' }, { force: true });
	cy.wait(1000);
});

//UPLOAD CAMPAIGN DB FILE
Cypress.Commands.add('uploadCampaignBlue', (camp, fileName) => {
	cy.get('[cy-test=add-campaign-btn]').click();
	cy.get('[cy-test=upload-from-file]').click();
	cy.get('[cy-test=new-camp-name]').click().type(camp);
	cy.fixture(fileName, { encoding: null }).as('myFixture');
	cy.get('[cy-test=browse-for-file]').selectFile('@myFixture');
	cy.get('[cy-test=import-database]').click();
	cy.wait(1000);
});
