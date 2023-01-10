/// <reference types="cypress" />

const { Cyclist16 } = require('@carbon/icons-react');

describe('Timeline tests', () => {
	const camp = 'timeline';
	const fileName = 'gt.redeye';

	it('Verify timeline features', () => {
		cy.get('[cy-test=add-campaign-btn]').click();

		cy.uploadLogs('seb', '200817');
	});
});
