/// <reference types="cypress" />

import { graphqlRequest, mutRequest } from '../support/utils.js';
import path from 'path';

Cypress.Commands.add('uploadLogs', (creatorName, folderName) => {
	const mutation = `
  mutation createCampaign($creatorName: String!, $name: String!) {
    createCampaign(creatorName: $creatorName, name: $name) {
      id
      name
    }
  }`;

	const variables = { creatorName: creatorName, name: folderName };
	mutRequest(mutation, variables).then((res) => {
		let camp = res.body.data.createCampaign.id;

		cy.log(camp);
		const mutation2 = `mutation addLocalServerFolder($campaignId: String!, $name: String!, $path: String!) { 
      addLocalServerFolder(campaignId: $campaignId, name: $name, path: $path) {
        id
        name
      }
		}`;
		cy.task('getPath', { dirPath: path.join(__dirname, '..', 'fixtures', 'smalldata') }).then((logPath) => {
			const variables1 = { campaignId: camp, name: '200817', path: logPath };
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

			const variables = { campaignId: camp };
			mutRequest(mutation1, variables).then((res) => {
				cy.log(res);
			});
		});
	});
});
