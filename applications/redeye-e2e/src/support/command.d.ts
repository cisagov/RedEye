// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
	interface Chainable {
		/**Clicks the button to add a new comment and adds comment text. Does not save the comment, so should be used in conjunction with another command to save.
		 * @example
		 * cy.addComment(index, comment)
		 */
		addComment();

		/**Add an existing tag or tags to a comment (not a comment reply) using partial text from the tag (ex: 'Golden' for the 'GoldenTicket' tag). Will also save the comment reply.
		 * NOTE: Needs to be used in conjunction with another command in order to add or select a comment to add the tag to.
		 * @example
		 * cy.addExistingTags(partialTag)
		 * cy.addExistingTags(partialTag1, partialTag2)
		 */
		addExistingTags();

		/**Add an existing tag to a comment reply using partial text from the tag (ex: 'Golden' for the 'GoldenTicket' tag). Will also save the comment.
		 * @example
		 * cy.addExistingTagsToReply(partialTag)
		 */
		addExistingTagsToReply();

		/**Clicks the option to add a multi-command comment and verifies that the default option for adding a comment gets disabled.
		 * @example
		 * cy.addMultiCommandComment()
		 */
		addMultiCommandComment();

		/**Adds a new comment to a command and creates a new tag.
		 * NOTE: Includes the addNewTags command.
		 * @example
		 * cy.addNewComment(index, comment, tag)
		 */
		addNewComment();

		/**Adds a tag that does not already exist to a comment. Will also save the comment.
		 * NOTE: Needs to be used in conjunction with another command in order to add or select a comment to add the tag to.
		 * @example
		 * cy.addNewTags(tag)
		 * cy.addNewTags(tag1, tag2)
		 */
		addNewTags();

		/**Modifies the end date of the timeline. Note: Date format = MM/DD/YY.
		 * @example
		 * cy.changeTimelineEndDate('01/05/23')
		 */
		changeTimelineEndDate();

		/**Modifies the start date of the timeline. Note: Date format = MM/DD/YY.
		 * @example
		 * cy.changeTimelineStartDate('01/01/23')
		 */
		changeTimelineStartDate();

		/**Clicks the 'Help' icon that opens the About modal to provide more information about RedEye.
		 * @example
		 * cy.clickAboutModal()
		 */
		clickAboutModal();

		/**Clicks the Help button on the campaign card page.
		 * @example
		 * cy.clickAboutOnCampaignCard()
		 */
		clickAboutOnCampaignCard();

		/**Clicks the button to add a new comment, but does NOT add comment text or tags.
		 * @example
		 * cy.clickAddComments(index)
		 */
		clickAddComments();

		/**Clicks the tab to switch to the list of beacons within the campaign.
		 * @example
		 * cy.clickBeaconsTab()
		 */
		clickBeaconsTab();

		/**Clicks the Comments tab in Explorer mode.
		 * NOTE: If you have selected another tab option in Explorer mode (ex: Beacons), you will need to use the clickCommentsTabWithinTab command to access Comments.
		 * @example
		 * cy.clickCommandsTab()
		 */
		clickCommandsTab();

		/**Clicks the Comments tab after you've clicked in another tab from Explorer mode.
		 * NOTE: This works if, for example, you've clicked the Beacons tab and want to see the comments related to that specific Beacon.
		 * @example
		 * cy.clickCommandsTab()
		 */
		clickCommandsTabWithinTab();

		/**Clicks the tab to switch to the list of command types within the campaign.
		 * @example
		 * cy.clickCommandTypesTab()
		 */
		clickCommandTypesTab();

		/**Clicks the tab to switch to the list of comments within the campaign.
		 * @example
		 * cy.clickCommentsTab()
		 */
		clickCommentsTab();

		/**Clicks the Explorer mode icon in the left navigation panel.
		 * @example
		 * cy.clickExplorerMode()
		 */
		clickExplorerMode();

		/**Click to open the General Settings modal.
		 * @example
		 * cy.clickGeneralSettings()
		 */
		clickGeneralSettings();

		/**Clicks the Hosts tab in Explorer mode.
		 * @example
		 * cy.clickHostsTab()
		 */
		clickHostsTab();

		/**Clicks the Details tab in Explorer mode.
		 * @example
		 * cy.clickDetailsTab()
		 */
		clickDetailsTab();

		/**Clicks the tab to open the list of Operators.
		 * @example
		 * cy.clickOperatorsTab()
		 */
		clickOperatorsTab();

		/** Clicks the Presentation mode icon in left navigation panel.
		 * @example
		 * cy.clickPresentationMode()
		 */
		clickPresentationMode();

		/**Clicks the Search icon in the left panel to open the search modal.
		 * @example
		 * cy.clickSearch()
		 */
		clickSearch();

		/**Click to open the User Settings modal.
		 * @example
		 * cy.clickUserSettings()
		 */
		clickUserSettings();

		/**Closes the log modal.
		 * @example
		 * cy.closeRawLogs()
		 */
		closeRawLogs();

		/**Closes the search modal.
		 * @example
		 * cy.closeSearch()
		 */
		closeSearch();

		/**Clicks the confirmation button in the modal to confirm that you either want to hide or show an item.
		 * @example
		 * cy.confirmShowHide()
		 */
		confirmShowHide();

		/**Deletes the campaign using GraphQL to ensure campaigns are always removed after testing.
		 * @example
		 * cy.deleteCampaignGraphQL(campaign)
		 */
		deleteCampaignGraphQL();

		/**Deletes a specific comment.
		 * @example
		 * cy.deleteComment(index)
		 */
		deleteComment();

		/**Toggles with switch within the Settings menu to make any hidden Beacons, Hosts, and/or Servers not appear in lists.
		 * @example
		 * cy.doNotShowHiddenItems()
		 */
		doNotShowHiddenItems();

		/**Deletes the contents within the cypress/downloads folder
		 */
		//deleteDownloadsFolderContent();

		/**Edit a comment that already exists. Does not edit any of the tags on the comment. Will also save the comment changes.
		 * @example
		 * cy.editExistingComment(index, editedText)
		 */
		editExistingComment();

		/**Clicks the dates in the timeline so the start and/or end dates can be modified.
		 * @example
		 * cy.editTimelineDates()
		 */
		editTimelineDates();

		/**Verifies that the log text contains what you are expecting.
		 * @example
		 * cy.expandedLogsContain(expectedText)
		 */
		expandedLogsContain();

		/**Expands the selected info row to view additional details.
		 * @example
		 * cy.expandInfoRow(index)
		 */
		expandInfoRow();

		/**Marks a comment as a favorite.
		 * @example
		 * cy.favoriteComment(index)
		 */
		favoriteComment();

		/**Opens the list of options in the Search modal to filter the search results.
		 * @example
		 * cy.filterSearchResults()
		 */
		filterSearchResults();

		/**Chooses the Beacons option in the Search modal's list of filtering options.
		 * @example
		 * cy.filterToBeacons()
		 */
		filterToBeacons();

		/**Chooses the Commands option in the Search modal's list of filtering options.
		 * @example
		 * cy.filterToCommands()
		 */
		filterToCommands();

		/**Chooses the Hosts option in the Search modal's list of filtering options.
		 * @example
		 * cy.filterToHosts()
		 */
		filterToHosts();

		/**Chooses the Servers option in the Search modal's list of filtering options.
		 * @example
		 * cy.filterToServers()
		 */
		filterToServers();

		/**Checks that the number of info rows is as expected.
		 * @example
		 * cy.infoRowTotal(expectedRows)
		 */
		infoRowTotal();

		/**Logs the current user out of the app.
		 * @example
		 * cy.logout()
		 */
		logout();

		/**Verifies that the log files in the campaign contain the text you're expecting.
		 * @example
		 * cy.logsShouldContain(expectedText)
		 */
		logsShouldContain();

		/**Checks that the number of beacons is as expected.
		 * @example
		 * cy.numberOfBeacons(expectedBeacons)
		 */
		numberOfBeacons();

		/**Removes the selected filter in the Search modal.
		 * @example
		 * cy.removeFilter()
		 */
		removeFilter();

		/**Reply to an existing comment. Will add text but no tags. Must indicate the index of the comment you are replying to. Will likely be used in conjunction with addExistingTagsToReply command.
		 * @example
		 * cy.replyToComment(index, comment)
		 */
		replyToComment();

		/**Clicks the reset button on the timeline to set dates back to their original configuration.
		 * @example
		 * cy.resetTimelineDates()
		 */
		resetTimelineDates();

		/**Searches the campaign card menu for a specific campaign using the Search feature at the top of the page.
		 * @example
		 * cy.searchForCampaign(campaign)
		 */
		searchForCampaign();

		/**Verifies that a specific search result contains a specific word or phrase.
		 * @example
		 * cy.searchResultContains(index, term)
		 */
		searchResultContains();

		/**Selects a specified campaign on the campaign card menu.
		 * @example
		 * cy.selectCampaign(campaign)
		 */
		selectCampaign();

		/**Selects a specified command from the list of commands.
		 * @example
		 * cy.SelectCommandType(command)
		 */
		selectCommandType();

		/**Toggles with switch within the Settings menu to make any hidden Beacons, Hosts, and/or Servers visible.
		 * @example
		 * cy.showHiddenItems()
		 */
		showHiddenItems();

		/**Clicks the "Show this Beacon" or "Hide this Beacon" link in the Meta tab.
		 * @example
		 * cy.showHideBeaconMetaTab()
		 */
		showHideBeaconMetaTab();

		/**Clicks the "Show this Host" or "Hide this Host" link in the Meta tab.
		 * @example
		 * cy.showHideHostMetaTab()
		 */
		showHideHostMetaTab();

		/**Uses the in-line kebab menu to show or hide a Beacon, Host, or Server.
		 * @example
		 * cy.showHideItem()
		 */
		showHideItem();

		/**Clicks the "Show this Server" or "Hide this Server" link in the Meta tab.
		 * @example
		 * cy.showHideServerMetaTab()
		 */
		showHideServerMetaTab();

		/**Sorts Search modal results by name.
		 * @example
		 * cy.sortByName()
		 */
		sortByName();

		/**Sorts Search modal results by relevance.
		 * @example
		 * cy.sortByRelevance()
		 */
		sortByRelevance();

		/**Sorts Search modal results by type.
		 * @example
		 * cy.sortByType()
		 */
		sortByType();

		/**Opens the list of options in the Search modal to sort the results.
		 * @example
		 * cy.sortSearchResults()
		 */
		sortSearchResults();

		/**Clicks the Back button on the timeline once.
		 * @example
		 * cy.timelineBack()
		 */
		timelineBack();

		/**Clicks the Forward button on the timeline once.
		 * @example
		 * cy.timelineForward()
		 */
		timelineForward();

		/**Clicks on the Play/Pause button of the timeline.
		 * @example
		 * cy.timelinePlayPause()
		 */
		timelinePlayPause();

		/**Toggle on Dark Theme
		 * @example
		 * cy.toggleDarkTheme()
		 */
		toggleDarkTheme();

		/**Toggle on Light Theme
		 * @example
		 * cy.toggleLightTheme()
		 */
		toggleLightTheme();

		/**Verifies that the beacon count is showing as expected.
		 * @example
		 * cy.totalBeacons(expectedCount)
		 */
		totalBeacons();

		/**Uploads a campaign database file using the "Upload from File" option.
		 * @example
		 * cy.uploadCampaign(campaignName, fileName)
		 */
		uploadCampaign();

		/**Verifies that the modal asking if you want to hide or show an item appears.
		 * @example
		 * cy.verifyDialogBoxAppears
		 */
		verifyDialogBoxAppears();

		/**Verifies that the total number of commands is showing as expected.
		 * @example
		 * cy.verifyTotalCommands(expectedCount)
		 */
		verifyTotalCommands();
	}
}
