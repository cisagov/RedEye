/// <reference types="cypress" />

import { graphqlRequest, mutRequest } from '../support/utils.js';

Cypress.Commands.add('uploadLogs', (creatorName, folderName) => {
	const mutation = `
  mutation createCampaign($creatorName: String!, $name: String!) {
    createCampaign(creatorName: $creatorName, name: $name) {
      id
      name
    }
  }`;

	const variables = `{"creatorName": "${creatorName}", "name": "${folderName}"}`;
	mutRequest(mutation, variables).then((res) => {
		let camp = res.body.data.createCampaign.id;

		cy.log(camp);
		const mutation2 = `mutation addLocalServerFolder($campaignId: String!, $name: String!, $path: String!) { 
      addLocalServerFolder(campaignId: $campaignId, name: $name, path: $path) {
        id
        name
      }
		}`;
		const variables1 = `{"campaignId": "${camp}", "name": "200817", "path": "applications/redeye-e2e/src/fixtures/testdata"}`;
		mutRequest(mutation2, variables1).then((res) => {
			cy.log(res);
		});

		const query = `query campaigns {
      campaigns {
            id
          }
        }`;
		graphqlRequest(query).then((res) => {
			cy.log(res);
		});
		const mutation1 = `
		    mutation serversParse($campaignId: String!) {
		      serversParse(campaignId: $campaignId)
		  }`;

		const variables = `{"campaignId": "${camp}"}`;
		mutRequest(mutation1, variables).then((res) => {
			cy.log(res);
		});
	});
});

// Cypress.Commands.add('uploadCampaign1', (creatorName, folderName) => {
// 	let newId;

// 	const mutation = `
//   mutation createCampaign($creatorName: String!, $name: String!) {
//     createCampaign(creatorName: $creatorName, name: $name) {
//       __typename
//       id
//       annotationCount
//       beaconCount
//       bloodStrikeServerCount
//       commandCount
//       computerCount
//       firstLogTime
//       lastLogTime
//       name
//       parsingStatus
//       lastOpenedBy {

//       __typename
//       id
//       id

//       }
//       creator {

//       __typename
//       id
//       id
//       }

//             }
// }`;

// 	cy
// 		.request({
// 			url: 'http://localhost:4000/api/graphql',
// 			method: 'POST',
// 			failOnStatusCode: false,
// 			body: { query: mutation },
// 		})
// 		.then(() => {
// 			const query = `{
//     campaigns {
//       id
//       name
//     }
//   }`;
// 			cy.request({
// 				url: 'http://localhost:4000/api/graphql',
// 				method: 'POST',
// 				failOnStatusCode: false,
// 				body: { query },
// 			});
// 		})
// 		.then((response) => {
// 			let body = response.body.data.campaigns;
// 			cy.log(body);
// 			const last = [...body].pop();
// 			newId = last['id'];
// 			cy.log(newId);
// 		})
// 		.then(() => {
// 			const mutation2 = `
//   mutation    {
//     addLocalServerFolder(campaignId: ${newId}, fixture: "TestDataSet/${folderName}")
//   }`;
// 			cy
// 				.request({
// 					url: 'http://localhost:4000/api/graphql',
// 					method: 'POST',
// 					failOnStatusCode: false,
// 					body: { query: mutation2 },
// 				})
// 				.then((res) => {
// 					cy.log(res);
// 				});
// 		});
// 	cy.reload();
// });
