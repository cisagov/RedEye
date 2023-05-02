// Import Cypress Commands
import './commands';
import './graphqlCommands';
import './explore';
import './beacon';
import './computer';
import './campaignCard';
import './utils';
import 'cypress-map';
import 'cypress-real-events';

Cypress.on('uncaught:exception', (err, runnable, promise) => {
	if (promise) {
		return false;
	}
	if (err.message.includes('ResizeObserver loop limit exceeded')) {
		// ignore the error
		return false;
	}
});

export const hasOperationName = (req, operationName) => {
	const { body } = req;
	const d = body.query.split(' ');
	const [name] = d[1].split('(', 1);
	return name && name === operationName;
};

// Alias query if operationName matches
export const aliasQuery = (req, operationName) => {
	if (hasOperationName(req, operationName)) {
		req.alias = `${operationName}`;
	}
};

// Alias mutation if operationName matches
export const aliasMutation = (req, operationName) => {
	if (hasOperationName(req, operationName)) {
		req.alias = `${operationName}`;
	}
};

//LOGIN LOCALLY
beforeEach(() => {
	cy.intercept('POST', 'http://localhost:4000/api/graphql', (req) => {
		// Queries
		aliasQuery(req, 'searchCommands');
		aliasQuery(req, 'annotation');
		aliasQuery(req, 'annotations');
		aliasQuery(req, 'beacons');
		aliasQuery(req, 'campaign');
		aliasQuery(req, 'campaigns');
		aliasQuery(req, 'commandGroup');
		aliasQuery(req, 'commandGroups');
		aliasQuery(req, 'commandIds');
		aliasQuery(req, 'commandTypes');
		aliasQuery(req, 'commands');
		aliasQuery(req, 'files');
		aliasQuery(req, 'globalOperators');
		aliasQuery(req, 'hosts');
		aliasQuery(req, 'images');
		aliasQuery(req, 'links');
		aliasQuery(req, 'logs');
		aliasQuery(req, 'logsByBeaconId');
		aliasQuery(req, 'operators');
		aliasQuery(req, 'parsingProgress');
		aliasQuery(req, 'presentationItems');
		aliasQuery(req, 'searchAnnotations');
		aliasQuery(req, 'searchCommands');
		aliasQuery(req, 'servers');
		aliasQuery(req, 'tags');
		aliasQuery(req, 'timeline');

		// Mutations
		aliasMutation(req, 'addAnnotationToCommandGroup');
		aliasMutation(req, 'addCommandGroupAnnotation');
		aliasMutation(req, 'addCommandToCommandGroup');
		aliasMutation(req, 'addLocalServerFolder');
		aliasMutation(req, 'anonymizeCampaign');
		aliasMutation(req, 'createCampaign');
		aliasMutation(req, 'createGlobalOperator');
		aliasMutation(req, 'deleteAnnotation');
		aliasMutation(req, 'deleteCampaign');
		aliasMutation(req, 'renameCampaign');
		aliasMutation(req, 'serversParse');
		aliasMutation(req, 'toggleBeaconHidden');
		aliasMutation(req, 'toggleHostHidden');
		aliasMutation(req, 'toggleServerHidden');
		aliasMutation(req, 'updateAnnotation');
		aliasMutation(req, 'updateBeaconMetadata');
		aliasMutation(req, 'updateHostMetadata');
		aliasMutation(req, 'updateServerMetadata');
	});
	cy.loginAPI();
});
