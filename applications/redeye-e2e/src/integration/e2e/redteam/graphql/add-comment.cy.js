import { graphqlRequest, mutRequest } from '../../../../support/utils';

describe('Add a comment using GraphQL', () => {
	const camp = 'addCommentGraphQL';
	const commandId = '1166658656-1597693201000-2';
	const comment = 'Text for comment.';
	const tags = 'GoldenTicket';
	const commentUser = 'cypress';

	it('Add a comment', () => {
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]').eq(0).click();

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];

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
				  commandIds
				  text
				  user
				  tags {
					id
				  }
				}
			  }`;

			const variables = {
				campaignId: returnedUrl,
				commandIds: commandId,
				tags: tags,
				text: comment,
				user: commentUser,
			};

			mutRequest(mutation, variables).then((res) => {
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
