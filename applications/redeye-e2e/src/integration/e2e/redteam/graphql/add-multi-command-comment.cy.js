import { graphqlRequest, mutRequest } from '../../../../support/utils';

describe('Add multi-command comment using GraphQL', () => {
	const camp = 'addMultiCommandCommentGraphQL';
	const commandId1 = '1166658656-1597693201000-2';
	const commandId2 = '1166658656-1597693205000-4';
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
				  commandGroupId
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
				commandIds: [commandId1, commandId2],
				tags: tags,
				text: comment,
				user: commentUser,
			};

			mutRequest(mutation, variables).then((res) => {
				cy.log(res.body.data);

				const response = res.body.data.addCommandGroupAnnotation;

				const commentText = response.text;
				expect(commentText).to.include(comment);

				const commentTag = response.tags.map((tag) => tag.id);
				expect(commentTag).to.include(tags);

				const userName = response.user;
				expect(userName).to.include(commentUser);

				const groupId = response.id;
				cy.log(groupId);

				const query = `query commands(
						$campaignId: String!
						$commandIds: [String!]
					  ) {
						commands(
						  campaignId: $campaignId
						  commandIds: $commandIds
						) {
						  commandGroups {
							annotations {
							  text
							  user
							  commandIds
							  commandGroupId
							  tags {
								id
							  }
							}
						  }
						}
					  }
					  `;

				const queryVariables = { campaignId: returnedUrl, commandIds: [commandId1, commandId2] };

				graphqlRequest(query, queryVariables).then((queryRes) => {
					cy.log(queryRes.body.data);
				});
			});
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
