import { graphqlRequest, mutRequest } from '../../../../support/utils';

describe('Add multi-command comment using GraphQL', () => {
	const camp = 'addMultiCommandCommentGraphQL';
	const commandId = '1166658656-1597693201000-2';
	// UPDATE
	const comment = 'Multi-command comment text.';
	const tags = 'GoldenTicket';
	const commentUser = 'cypress';

	it('Add a multi-command comment', () => {
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]').eq(0).click();

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];
			cy.log(returnedUrl);

			// START HERE WITH UPDATES
			const mutation = `mutation addCommandGroupAnnotation(
				$campaignId: String!
				$commandIds: [String!]!
				$tags: [String!]!
				$text: String!
				$user: String!
			  ) {
				addCommandGroupAnnotation(
				  campaignId: $campaignId
				  commandIds: $commandIds
				  tags: $tags
				  text: $text
				  user: $user
				) {
				  id
				  commandIds
				  text
				  user
				  tags {
					id
				  }
				}
			  }`;

			const variables1 = `{"campaignId": "${returnedUrl}", "commandIds": "${commandId}", "tags": "${tags}", "text": "${comment}", "user": "${commentUser}"}`;

			mutRequest(mutation, variables1).then((res) => {
				const response = res.body.data.addCommandGroupAnnotation;

				const commentText = response.text;
				expect(commentText).to.include(comment);

				const commentTag = response.tags.map((tag) => tag.id);
				expect(commentTag).to.include(tags);

				const userName = response.user;
				expect(userName).to.include(commentUser);
			});
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
