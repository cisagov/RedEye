/// <reference types="cypress" />

//SELECT COMPUTER, VERIFY HOSTNAME & TOTAL NUMBER OF BEACONS ATTACHED
// Cypress.Commands.add('clickComputer', (comp, name, beac) => {
//   return cy.window().then(window => {
//     const computer = window.store.campaign.allItems.filter(beacon => beacon.__typename === 'Computer');

//     computer[comp].select();

//     hostName = window.store.campaign.selectedHost.hostName;
//     console.log(hostName);
//     expect(hostName).to.eql(name);
//     cy.wait(300);

//     const numBeacons = window.store.campaign.selectedHost.beaconIds.data_.size;
//     console.log(numBeacons);
//     expect(numBeacons).to.eq(beac);
//   });
// });

Cypress.Commands.add('selectHost', (index) => {
	cy.get('[cy-test=graph-group]').eq(index).click({ force: true });
});

Cypress.Commands.add('numberOfBeacons', (num) => {
	cy.get('tspan').invoke('text').should('eq', num);
});
