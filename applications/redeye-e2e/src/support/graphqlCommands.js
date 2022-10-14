/// <reference types="cypress" />
import path from 'path';
Cypress.Commands.add('uploadCampaign1', (folderName) => {
	let newId;

	const mutation = `
  mutation {
    createCampaign(creatorName: "seb", name: "${folderName}") {
      __typename
      id
      annotationCount
      beaconCount
      bloodStrikeServerCount
      commandCount
      computerCount
      firstLogTime
      lastLogTime
      name
      id
      annotationCount
      beaconCount
      bloodStrikeServerCount
      commandCount
      computerCount
      firstLogTime
      lastLogTime
      name
      lastOpenedBy {
      
      __typename
      id
      id
      
      }
      creator {
      
      __typename
      id
      id
      }
      
            }
}`;

	cy
		.request({
			url: 'http://localhost:4000/api/graphql',
			method: 'POST',
			failOnStatusCode: false,
			body: { query: mutation },
		})
		.then(() => {
			const query = `{
    campaigns {
      id
      name
    }
  }`;
			cy.request({
				url: 'http://localhost:4000/api/graphql',
				method: 'POST',
				failOnStatusCode: false,
				body: { query },
			});
		})
		.then((response) => {
			let body = response.body.data.campaigns;
			cy.log(body);
			const last = [...body].pop();
			newId = last['id'];
			cy.log(newId);
		})
		.then(() => {
			const mutation2 = `
  mutation    {
    addServerFromCypress(campaignId: ${newId}, fixture: "20201118-TestData/${folderName}")
  }`;
			cy.request({
				url: 'http://localhost:4000/api/graphql',
				method: 'POST',
				failOnStatusCode: false,
				body: { query: mutation2 },
			}).then((res) => {
				cy.log(res);
			});
		});
	cy.reload();
	cy.get('[cy-test="campaign-card"]').its('length').should('be.gt', 0);
});
