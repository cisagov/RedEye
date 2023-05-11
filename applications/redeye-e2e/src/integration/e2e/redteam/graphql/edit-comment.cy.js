import { graphqlRequest, mutRequest } from '../../../../support/utils';

describe('Edit a comment using GraphQL', () => {
	const camp = 'editCommentGraphQL';
	const commandId = '1166658656-1597693201000-2';
	const origComment = 'Text for comment.';
	const editedComment = 'This is the edited comment.';
	const tags = 'GoldenTicket';
	const commentUser = 'cypress';

	it('Add and edit a comment', () => {
		cy.uploadCampaign(camp, 'gt.redeye');

		cy.selectCampaign(camp);
		cy.clickBeaconsTab();
		cy.get('[cy-test=beacons-row]').eq(0).click();

		cy.url().then((url) => {
			const returnedUrl = url.split('/')[5];

			// Add a comment for editing
			const mutationAdd = `mutation addCommandGroupAnnotation(
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

			const variablesAdd = {
				campaignId: returnedUrl,
				commandIds: commandId,
				tags: tags,
				text: origComment,
				user: commentUser,
			};

			mutRequest(mutationAdd, variablesAdd).then((res) => {
				const response = res.body.data.addCommandGroupAnnotation;

				const commentText = response.text;
				expect(commentText).to.include(origComment);

				const commentTag = response.tags.map((tag) => tag.id);
				expect(commentTag).to.include(tags);

				const userName = response.user;
				expect(userName).to.eq(commentUser);

				const commentId = response.id;

				// Edit the comment
				const mutationEdit = `mutation updateAnnotation(
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
					  favorite
					  text
					  user
					  tags {
						id
					  }
					}
				  }`;

				const variablesEdit = {
					annotationId: commentId,
					campaignId: returnedUrl,
					favorite: false,
					tags: tags,
					text: editedComment,
					user: commentUser,
				};

				mutRequest(mutationEdit, variablesEdit).then((respEdit) => {
					const responseEdit = respEdit.body.data.updateAnnotation;

					const editedId = responseEdit.id;
					expect(editedId).to.eq(commentId);

					const editedText = responseEdit.text;
					expect(editedText).to.eq(editedComment);

					const editedTag = response.tags.map((tagEdit) => tagEdit.id);
					expect(editedTag).to.include(tags);

					const editedUser = responseEdit.user;
					expect(editedUser).to.eq(commentUser);

					const editedFavorite = responseEdit.favorite;
					expect(editedFavorite).to.eq(false);
				});
			});
		});
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
