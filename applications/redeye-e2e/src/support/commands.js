/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />

import { graphqlRequest, mutRequest } from '../support/utils';

// *******************************************
// LOGIN / LOGOUT COMMANDS
// *******************************************

Cypress.Commands.add('loginLocal', (password, user) => {
	cy.visit('/');
	cy.get('[cy-test=password]').clear().type(password);
	cy.get('form input').last().type(user).type('{enter}');
});

Cypress.Commands.add('loginAPI', (user = 'cypress') => {
	const formData = new FormData();
	formData.append('password', '937038570');

	cy.session(
		user,
		() => {
			window.localStorage.setItem('user', 'cypress');
			cy.request({
				url: 'http://localhost:4000/api/login',
				method: 'POST',
				headers: {
					'content-type': 'multipart/form-data',
				},
				body: formData,
			});
		},
		{
			cacheAcrossSpecs: true,
		}
	),
		cy.visit('http://localhost:3500/#/campaigns/all');
});

Cypress.Commands.add('loginBlue', (user) => {
	cy.visit('/');
	cy.get('[cy-test=password]').clear();
	cy.get('form input').last().type(user).type('{enter}');
});

Cypress.Commands.add('logout', () => {
	cy.get('[cy-test=logged-in-user]').click();
});

// *******************************************
// COMMENTS AND TAGS
// *******************************************

//HOVER OVER TO ADD NEW COMMENT IF NONE EXIST
Cypress.Commands.add('addComment', (index, cmt) => {
	cy.get('[cy-test=command-info] [cy-test=add-comment]')
		.eq(index)
		.invoke('attr', 'style', 'visibility: visible')
		.should('be.visible')
		.click({ force: true });
	cy.get('[cy-test=comment-box]').should('be.visible');
	cy.get('[cy-test=comment-input]').type(cmt);
});

//DELETE COMMENT
Cypress.Commands.add('deleteComment', (index) => {
	cy.get('[cy-test=add-comment]')
		.eq(index)
		.click()
		.wait(100)
		.then(() => {
			cy.get('[cy-test=comment-dialog]').should('be.visible');
		});

	cy.get('[cy-test=delete-comment]').click();
	cy.contains('Delete Comment').click();
});

// ADD TO EXISTING COMMENT
Cypress.Commands.add('addToExistingComment', (index, cmt) => {
	cy.get('[cy-test=command-info] [cy-test=add-comment]')
		.eq(index)
		.invoke('attr', 'style', 'visibility: visible')
		.should('be.visible')
		.click({ force: true });
	cy.get('[cy-test=comment-box]').should('be.visible');
	cy.get('[cy-test=add-command-existing-comment]').click({ force: true });
	cy.get('[cy-test=search-comments]').type(cmt);
});

//SEARCH
Cypress.Commands.add('addExistingTags', (...term) => {
	term.forEach((tags) => {
		cy.get('[cy-test=tag-input]').type(tags);
		cy.get('[cy-test=tag-list-item]').contains(tags).click();
	});
	cy.get('[cy-test=save-comment]').should('be.visible').click();
	cy.wait('@addCommandGroupAnnotation');
});

//ADD TAGS TO COMMENT
Cypress.Commands.add('addNewTags', { prevSubject: false }, (...term) => {
	term.forEach((tags) => {
		cy.get('[cy-test=tag-input]').type(tags);
		cy.get('[cy-test=add-tag]').contains(tags).click({ force: true });
	});
	cy.get('[cy-test=save-comment]').should('be.visible').click();
	cy.wait('@addCommandGroupAnnotation');
});

//MARK COMMENT AS FAVORITE
Cypress.Commands.add('favoriteComment', (index) => {
	cy.get('[cy-test=fav-comment]').should('be.visible').eq(index).click({ force: true });
});

//ADD NEW COMMENT
Cypress.Commands.add('addNewComment', (index, comment, tag) => {
	cy.get('[cy-test=command-info]')
		.eq(index)
		.then(($co) => {
			if ($co.find('[cy-test=add-comment]').length > 0) {
				cy.get('[cy-test=add-comment]').then(($btn) => {
					if ($btn.is(':visible')) {
						cy.log('COMMENT ALREADY HERE');
						cy.get('[cy-test=add-comment]').click({ force: true });
						cy.get('[cy-test=add-new-comment]').click({ force: true });
						cy.get('[cy-test=comment-input]').type(comment).type('{enter}');
						cy.addExistingTags(tag);
						cy.wait(300);
					} else {
						cy.log('NEW COMMENT ');
						cy.addComment(index, comment);
						cy.addNewTags(tag);
						cy.wait(300);
					}
				});
			}
		});
});

// Edit an existing comment; do not edit tags
Cypress.Commands.add('editExistingComment', (index, editedCommentText) => {
	cy.get('[cy-test=edit-comment]').eq(index).click();
	cy.get('[cy-test=comment-input]').click().clear().type(editedCommentText);
	cy.get('[cy-test=save-comment]').click();
	cy.wait('@updateAnnotation');
});

// Reply to a comment (only adds text, no tags)
Cypress.Commands.add('replyToComment', (index, cmt) => {
	cy.get('[cy-test=reply]').eq(index).click();
	cy.get('[cy-test=comment-input]').type(cmt);
});

// Add existing tag to a comment REPLY
Cypress.Commands.add('addExistingTagsToReply', (...term) => {
	term.forEach((tags) => {
		cy.get('[cy-test=tag-input]').type(tags);
		cy.get('[cy-test=tag-list-item]').contains(tags).click();
	});
	cy.get('[cy-test=save-comment]').should('be.visible').click();
});

// *******************************************
// OTHER COMMANDS
// *******************************************

Cypress.Commands.add('hostNameEquals', (name) => {
	cy.get('.bp4-heading').first().contains(name);
});

Cypress.Commands.add('openRawLogs', () => {
	cy.get('[cy-test=openRawLogs]').click();
});

Cypress.Commands.add('infoRowTotal', (num) => {
	cy.get('[cy-test=info-row]').should('have.length', num);
});

//ACTUAL COMMANDS
Cypress.Commands.add('selectCommandType', (cmd) => {
	cy.get('[cy-test=commands]').contains(cmd).click();
	cy.wait(['@commands', '@commandIds']);
});

// Delete campaign using GraphQL
Cypress.Commands.add('deleteCampaignGraphQL', (name) => {
	const query = `query campaigns {
    campaigns {
          id
          name
        }
      }`;
	graphqlRequest(query).then((res) => {
		const camp = res.body.data.campaigns;
		cy.log(camp);

		const ids = Cypress._.find(camp, { name: name });
		const campToDelete = ids.id;
		cy.log(campToDelete);

		const mutation = `
    mutation deleteCampaign($campaignId: String!) {
     deleteCampaign(campaignId: $campaignId) 
  }`;
		const variables = `{"campaignId": "${campToDelete}"}`;
		mutRequest(mutation, variables).then((res) => {
			cy.log(res);
		});
	});
});

// Close raw logs
Cypress.Commands.add('closeRawLogs', () => {
	cy.get('[cy-test=close-log]').click();
	cy.wait(200);
});

// Search campaign for specific term
Cypress.Commands.add('searchCampaignFor', (searchTerm) => {
	cy.get('[cy-test=search]').click().clear().type(searchTerm).type('{enter}');
	cy.wait('@searchAnnotations');
});

// Edit an existing comment; do not edit tags
Cypress.Commands.add('editExistingComment', (index, editedCommentText) => {
	cy.get('[cy-test=edit-comment]').eq(index).click();
	cy.get('[cy-test=comment-input]').click().clear().type(editedCommentText);
	cy.get('[cy-test=save-comment]').click();
	cy.wait('@updateAnnotation');
});

// Reply to a comment (only adds text, no tags)
Cypress.Commands.add('replyToComment', (index, cmt) => {
	cy.get('[cy-test=reply]').eq(index).click();
	cy.get('[cy-test=comment-input]').type(cmt);
});

// Add existing tag to a comment REPLY
Cypress.Commands.add('addExistingTagsToReply', (...term) => {
	term.forEach((tags) => {
		cy.get('[cy-test=tag-input]').type(tags);
		cy.get('[cy-test=tag-list-item]').contains(tags).click();
	});
	cy.get('[cy-test=save-comment]').should('be.visible').click();
});

// Show hidden Beacons, Hosts, and Servers
Cypress.Commands.add('showHiddenItems', () => {
	cy.get('[cy-test=settings]').click({ force: true });
	cy.get('[cy-test=show-hide-beacons]').check({ force: true });
	// cy.wait('@servers');
	cy.get('[cy-test=close-log]').click();
	cy.wait(1000);
});

// Do not show hidden Beacons, Hosts, and Servers
Cypress.Commands.add('doNotShowHiddenItems', () => {
	cy.get('[cy-test=settings]').click({ force: true });
	cy.get('[cy-test=show-hide-beacons]').uncheck({ force: true });
	// cy.wait('@servers');
	cy.get('[cy-test=close-log]').click();
	cy.wait(1000);
});

Cypress.Commands.add('toggleLightTheme', () => {
	cy.get('[cy-test=settings]').click();
	cy.get('[cy-test=toggle-theme]').check({ force: true });
	cy.get('[cy-test=close-log]').click();
});

Cypress.Commands.add('toggleDarkTheme', () => {
	cy.get('[cy-test=settings]').click();
	cy.get('[cy-test=toggle-theme]').uncheck({ force: true });
	cy.get('[cy-test=close-log]').click();
});
