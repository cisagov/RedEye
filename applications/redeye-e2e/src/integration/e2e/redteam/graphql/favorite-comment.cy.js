import { graphqlRequest, mutRequest } from '../../../../support/utils';

describe('Mark comment as favorite using GraphQL', () => {
	const camp = 'favoriteCommentGraphQL';
	const commandId = '1166658656-1597693201000-2';
	const comment = 'Text for comment.';
	const tags = 'GoldenTicket';
	const commentUser = 'cypress';

	it('Favorite a comment', () => {
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]').eq(0).click();

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];
			cy.log(returnedUrl);

			const mutation1 = `mutation addCommandGroupAnnotation(
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

			mutRequest(mutation1, variables1).then((res) => {
				const response = res.body.data.addCommandGroupAnnotation;

				const commentText = response.text;
				expect(commentText).to.include(comment);

				const commentTag = response.tags.map((tag) => tag.id);
				expect(commentTag).to.include(tags);

				const userName = response.user;
				expect(userName).to.include(commentUser);

				const annotId = response.id;
				cy.log(annotId);

				const mutation2 = `mutation updateAnnotation(
				$annotationId: String!
				$campaignId: String!
				$favorite: Boolean
				$tags: [String!]!
				$text: String!
				$user: String!
			  ) {
				updateAnnotation(
					annotationId: $annotationId
					campaignId: $campaignId
					favorite: $favorite
					tags: $tags
					text: $text
					user: $user
				) {
				  id
				  commandIds
				  favorite
				  text
				  user
				  tags {
					id
				  }
				}
			  }`;

				const variables2 = {
					annotationId: annotId,
					campaignId: returnedUrl,
					favorite: true,
					commandIds: commandId,
					tags: tags,
					text: comment,
					user: commentUser,
				};

				mutRequest(mutation2, variables2).then((res2) => {
					const favoriteStatus = res2.body.data.updateAnnotation.favorite;
					expect(favoriteStatus).to.eq(true);
				});
			});
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
