// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
	interface Chainable {
		/**Add an existing tag to a comment reply using partial text from the tag (ex: 'Golden' for the 'GoldenTicket' tag). Will also save the comment reply.
		 *
		 * @example
		 * cy.addExistingTagsToReply(partialTag)
		 */
		addExistingTagsToReply();

		/**Deletes the campaign using GraphQL to ensure campaigns are always removed after testing.
		 *
		 * @example
		 * cy.deleteCampaignGraphQL(campaign)
		 */
		deleteCampaignGraphQL;

		/**Deletes the contents within the cypress/downloads folder
		 */
		deleteDownloadsFolderContent();

		/**Reply to an existing comment. Will add text but no tags. Must indicate the index of the comment you are replying to. Will likely be used in conjunction with addExistingTagsToReply command.
		 *
		 * @example
		 * cy.replyToComment(index, comment)
		 */
		replyToComment();
	}
}
