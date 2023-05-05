import { graphqlRequest, mutRequest } from '../../../../support/utils';

describe('Add multi-command comment using GraphQL', () => {
	const camp = 'addMultiCommandCommentGraphQL';
	const commandId1 = '1166658656-1597693201000-2';
	const commandId2 = '1166658656-1597693205000-4';
	const commandId3 = '1166658656-1597693271000-7';
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
			  }
			  `;

			const variables = {
				campaignId: returnedUrl,
				commandIds: [commandId1, commandId2, commandId3],
				tags: tags,
				text: comment,
				user: commentUser,
			};

			mutRequest(mutation, variables).then((res) => {
				const response = res.body.data.addCommandGroupAnnotation;

				const commentCount = response.commandIds;
				expect(commentCount).to.include(commandId1).and.to.include(commandId2).and.to.include(commandId3);

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
