import { graphqlRequest, mutRequest } from '../../../../support/utils';

describe('Delete a comment using GraphQL', () => {
	const camp = 'deleteCommentGraphQL';
	const commandId = '1166658656-1597693201000-2';
	const comment = 'Text for comment.';
	const tags = 'GoldenTicket';
	const commentUser = 'cypress';

	it('Delete a comment', () => {
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]').eq(0).click();

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];

			// Add comment first
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

			const variables1 = {
				campaignId: returnedUrl,
				commandIds: commandId,
				tags: tags,
				text: comment,
				user: commentUser,
			};

			mutRequest(mutation, variables1).then((res) => {
				const response = res.body.data.addCommandGroupAnnotation;

				const commentText = response.text;
				expect(commentText).to.include(comment);

				const commentTag = response.tags.map((tag) => tag.id);
				expect(commentTag).to.include(tags);

				const userName = response.user;
				expect(userName).to.include(commentUser);

				const annotId = response.id;

				// Delete comment
				const mutationDelete = `mutation deleteAnnotation($annotationId: String!, $campaignId: String!) {
					deleteAnnotation(annotationId: $annotationId, campaignId: $campaignId) {
					  id
					  commandIds
					  text
					  user
					  tags {
						id
					  }
					}
				  }`;

				const variables2 = { annotationId: annotId, campaignId: returnedUrl };

				mutRequest(mutationDelete, variables2).then((res2) => {
					const responseDelete = res2.body.data.deleteAnnotation;

					const deletedComment = responseDelete.text;
					expect(deletedComment).to.include(comment);

					const deletedUser = responseDelete.user;
					expect(deletedUser).to.include(commentUser);
				});
			});
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
